import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export type PropertyData = {
  propertyAddress: string
  propClass: string
  ownerContact: string
  contactPhone: string
  offerPrice: number
  askingPrice: number
  rehabCost: number
  numUnits: number
  totalRent: number
  monthlyIncome: number
  yearlyIncome: number
  otherIncome: number
  totalGSI: number
  vacancyRate: number
  vacancyLoss: number
  opExpenseRate: number
  opExpenseAmount: number
  totalExpenses: number
  netOperatingIncome: number
  capRateAskingPrice: number
  capRateOfferPrice: number
  capRateOfferRehab: number
  expenseRatio: number
  units: Array<{
    beds: number | string
    baths: number
    rent: number
    ttlMonthRent: number
    count: number
  }>
  expenses: Record<string, number>
}

export type AnalysisReport = {
  summary: string
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
  recommendedOfferPrice: number
  recommendedOfferPriceRationale: string
  capRateAnalysis: string
  cashFlowAnalysis: string
  returnOnInvestment: string
  recommendations: string[]
}

export type OfferTemplate = {
  offerPrice: number
  contingencies: string[]
  closingTimeframe: string
  financingTerms: string
  dueDate: string
  additionalTerms: string
}

export async function generatePropertyAnalysis(propertyData: PropertyData): Promise<AnalysisReport> {
  // Verify OpenAI API key is available
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set in environment variables')
  }

  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: `You are an expert real estate investment analyst specializing in apartment buildings. 
    Analyze the provided apartment property data and generate a comprehensive investment analysis report.
    Focus on key metrics like cap rate, cash flow, ROI, and provide actionable insights.
    Be specific, data-driven, and highlight both opportunities and risks.
    IMPORTANT: Return ONLY a valid JSON object with no markdown formatting, no code blocks, and no additional text.`,
    prompt: `Analyze this apartment property data and provide a detailed investment analysis report:
    
    ${JSON.stringify(propertyData, null, 2)}
    
    Return ONLY a JSON object with the following structure (no markdown, no code blocks, no additional text):
    {
      "summary": "Brief executive summary of the property and investment opportunity",
      "strengths": ["List of property strengths"],
      "weaknesses": ["List of property weaknesses"],
      "opportunities": ["List of investment opportunities"],
      "threats": ["List of investment risks"],
      "recommendedOfferPrice": number,
      "recommendedOfferPriceRationale": "Explanation for the recommended offer price",
      "capRateAnalysis": "Analysis of the cap rate and how it compares to market",
      "cashFlowAnalysis": "Analysis of potential cash flow",
      "returnOnInvestment": "Projected ROI analysis",
      "recommendations": ["List of specific recommendations"]
    }`,
    temperature: 0.2,
  })

  try {
    // Clean the response text to handle markdown code blocks
    let cleanedText = text

    // Remove markdown code block syntax if present
    if (text.includes("```")) {
      cleanedText = text.replace(/```json\n|```\n/g, "")
    } else if (text.includes("`")) {
      cleanedText = text.replace(/`\n|`\n/g, "")
    }

    // Attempt to parse the cleaned JSON
    try {
      return JSON.parse(cleanedText) as AnalysisReport
    } catch (parseError) {
      console.error("Failed to parse cleaned response:", parseError)
      console.log("Cleaned response text:", cleanedText)
      throw new Error("Failed to parse AI response: Invalid JSON format")
    }
  } catch (error: unknown) {
    console.error("Analysis generation failed:", error)
    throw new Error(`Failed to generate property analysis: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
export async function generateOfferTemplate(
  propertyData: PropertyData,
  analysisReport: AnalysisReport,
): Promise<OfferTemplate> {
  // Verify OpenAI API key is available
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set in environment variables')
  }

  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: `You are an expert real estate investment advisor specializing in apartment buildings.
    Based on the property data and analysis report, generate a strategic offer template.
    The offer should be competitive but favorable to the investor.
    IMPORTANT: Return ONLY a valid JSON object with no markdown formatting, no code blocks, and no additional text.`,
    prompt: `Generate a strategic offer template for this property based on the data and analysis:
    
    Property Data:
    ${JSON.stringify(propertyData, null, 2)}
    
    Analysis Report:
    ${JSON.stringify(analysisReport, null, 2)}
    
    Return ONLY a JSON object with the following structure (no markdown, no code blocks, no additional text):
    {
      "offerPrice": number,
      "contingencies": ["List of recommended contingencies"],
      "closingTimeframe": "Recommended closing timeframe",

      "financingTerms": "Recommended financing terms", 
      "dueDate": "Recommended offer expiration date (7 days from now)",
      "additionalTerms": "Any additional terms or conditions"
    }`,
    temperature: 0.3,
  })

  try {
    // Clean the response text to handle markdown code blocks
    let cleanedText = text

    // Remove markdown code block syntax if present
    if (text.includes("```")) {
      cleanedText = text.replace(/```json\n|```\n/g, "")
    } else if (text.includes("`")) {
      cleanedText = text.replace(/`\n|`\n/g, "")
    }

    // Attempt to parse the cleaned JSON
    try {
      return JSON.parse(cleanedText) as OfferTemplate
    } catch (parseError) {
      console.error("Failed to parse cleaned response:", parseError)
      console.log("Cleaned response text:", cleanedText)
      throw new Error("Failed to parse AI response: Invalid JSON format")
    }
  } catch (error: unknown) {
    console.error("Offer template generation failed:", error)
    throw new Error(`Failed to generate offer template: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
export async function generateOfferLetter(
  propertyData: PropertyData,
  offerTemplate: OfferTemplate,
  buyerInfo: { name: string; company: string; contact: string },
): Promise<string> {
  // Verify OpenAI API key is available
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set in environment variables')
  }

  const { text } = await generateText({
    model: openai("gpt-4o"),
    system: `You are an expert real estate professional who drafts clear, professional offer letters for apartment building acquisitions.
    Create a formal offer letter that is concise, professional, and includes all necessary terms.`,
    prompt: `Generate a professional offer letter for the following apartment property:
    
    Property Data:
    ${JSON.stringify(propertyData, null, 2)}
    
    Offer Terms:
    ${JSON.stringify(offerTemplate, null, 2)}
    
    Buyer Information:
    ${JSON.stringify(buyerInfo, null, 2)}
    
    The letter should be formatted professionally with proper sections for property details, offer price, terms, contingencies, 
    closing timeline, and next steps. Make it concise but comprehensive, ready for submission to the property owner.`,
    temperature: 0.3,
  })

  return text
}

