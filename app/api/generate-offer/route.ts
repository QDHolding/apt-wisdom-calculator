import { NextRequest, NextResponse } from 'next/server'
import { generateOfferTemplate, type PropertyData, type AnalysisReport } from '@/services/ai-analysis-service'

export async function POST(request: NextRequest) {
  try {
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

    const { propertyData, analysisReport }: { 
      propertyData: PropertyData
      analysisReport: AnalysisReport 
    } = await request.json()
    
    // Validate required fields
    if (!propertyData.propertyAddress || !analysisReport) {
      return NextResponse.json(
        { error: 'Property data and analysis report are required' },
        { status: 400 }
      )
    }
    
    const offerTemplate = await generateOfferTemplate(propertyData, analysisReport)
    
    return NextResponse.json(offerTemplate)
  } catch (error) {
    console.error('Offer template generation error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate offer template',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
