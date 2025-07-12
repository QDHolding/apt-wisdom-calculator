import { NextRequest, NextResponse } from 'next/server'
import { generateOfferLetter, type PropertyData, type OfferTemplate } from '@/services/ai-analysis-service'

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

    const { propertyData, offerTemplate, buyerInfo }: { 
      propertyData: PropertyData
      offerTemplate: OfferTemplate
      buyerInfo: { name: string; company: string; contact: string }
    } = await request.json()
    
    // Validate required fields
    if (!propertyData.propertyAddress || !offerTemplate || !buyerInfo.name) {
      return NextResponse.json(
        { error: 'Property data, offer template, and buyer info are required' },
        { status: 400 }
      )
    }
    
    const offerLetter = await generateOfferLetter(propertyData, offerTemplate, buyerInfo)
    
    return NextResponse.json({ offerLetter })
  } catch (error) {
    console.error('Offer letter generation error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate offer letter',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
