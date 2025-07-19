import { NextRequest, NextResponse } from 'next/server'
import { generatePropertyAnalysis, type PropertyData } from '@/services/ai-analysis-service'
import { config } from '@/lib/env-config'

export async function POST(request: NextRequest) {
  try {
    // Enhanced debugging with multiple environment sources
    const directEnv = process.env.OPENAI_API_KEY;
    const configEnv = config.openai.apiKey;
    
    // Safe substring function
    const safeSubstring = (str: any): string => {
      if (typeof str === 'string' && str.length > 0) {
        return str.substring(0, 8);
      }
      return 'not-found';
    };
    
    console.log('Enhanced environment check:', {
      hasDirectEnv: !!directEnv,
      hasConfigEnv: !!configEnv,
      directType: typeof directEnv,
      configType: typeof configEnv,
      directLength: (typeof directEnv === 'string') ? directEnv.length : 0,
      configLength: (typeof configEnv === 'string') ? configEnv.length : 0,
      directPrefix: safeSubstring(directEnv),
      configPrefix: safeSubstring(configEnv),
      nodeEnv: process.env.NODE_ENV,
      allEnvKeys: Object.keys(process.env).filter(key => key.includes('OPENAI')),
    })

    // Use the config system with fallbacks and ensure it's a valid string
    let apiKey = configEnv || directEnv;
    
    // Ensure API key is a valid string
    if (apiKey && typeof apiKey !== 'string') {
      console.error('API key is not a string:', typeof apiKey, apiKey);
      apiKey = String(apiKey);
    }
    
    if (!apiKey || typeof apiKey !== 'string' || apiKey.length < 20) {
      return NextResponse.json(
        { 
          error: 'OpenAI API key not configured',
          details: 'Please set OPENAI_API_KEY in your environment variables. Debug info logged.',
          debug: {
            hasDirectEnv: !!directEnv,
            hasConfigEnv: !!configEnv,
            directType: typeof directEnv,
            configType: typeof configEnv,
            envKeys: Object.keys(process.env).filter(key => key.includes('OPENAI')),
          }
        },
        { status: 500 }
      )
    }

    const propertyData: PropertyData = await request.json()
    
    // Validate required fields
    if (!propertyData.propertyAddress) {
      return NextResponse.json(
        { error: 'Property address is required' },
        { status: 400 }
      )
    }
    
    const analysisReport = await generatePropertyAnalysis(propertyData)
    
    return NextResponse.json(analysisReport)
  } catch (error) {
    console.error('Property analysis error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate property analysis',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
