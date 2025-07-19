import { NextRequest, NextResponse } from 'next/server'
import { generatePropertyAnalysis, type PropertyData } from '@/services/ai-analysis-service'
import { config } from '@/lib/env-config'

export async function POST(request: NextRequest) {
  try {
    // Enhanced debugging with multiple environment sources
    const directEnv = process.env.OPENAI_API_KEY;
    const configEnv = config.openai.apiKey;
    
    console.log('Enhanced environment check:', {
      hasDirectEnv: !!directEnv,
      hasConfigEnv: !!configEnv,
      directLength: directEnv?.length || 0,
      configLength: configEnv?.length || 0,
      directPrefix: directEnv?.substring(0, 8) || 'not-found',
      configPrefix: configEnv?.substring(0, 8) || 'not-found',
      nodeEnv: process.env.NODE_ENV,
      allEnvKeys: Object.keys(process.env).filter(key => key.includes('OPENAI')),
    })

    // Use the config system with fallbacks
    const apiKey = configEnv || directEnv;
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          error: 'OpenAI API key not configured',
          details: 'Please set OPENAI_API_KEY in your environment variables. Debug info logged.',
          debug: {
            hasDirectEnv: !!directEnv,
            hasConfigEnv: !!configEnv,
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
