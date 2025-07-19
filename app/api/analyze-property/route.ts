import { NextRequest, NextResponse } from 'next/server'
import { generatePropertyAnalysis, type PropertyData } from '@/services/ai-analysis-service'

export async function POST(request: NextRequest) {
  try {
    // Debug: Log environment variable status (without exposing the key)
    console.log('Environment check:', {
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      keyLength: process.env.OPENAI_API_KEY?.length || 0,
      keyPrefix: process.env.OPENAI_API_KEY?.substring(0, 8) || 'not-found'
    })

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { 
          error: 'OpenAI API key not configured',
          details: 'Please set OPENAI_API_KEY in your environment variables'
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
