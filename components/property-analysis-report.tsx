"use client"

import { useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { AnalysisReport } from "@/services/ai-analysis-service"
import { ProtectedContent } from "./protected-content"
import { DownloadPaywall } from "./download-paywall"
import { PdfService } from "@/services/enhanced-pdf-service"

interface PropertyAnalysisReportProps {
  report: AnalysisReport
  propertyAddress: string
  propertyData?: any // Optional for backward compatibility
}

export function PropertyAnalysisReport({ report, propertyAddress, propertyData }: PropertyAnalysisReportProps) {
  const reportRef = useRef<HTMLDivElement>(null)

  const handleDownload = async () => {
    if (reportRef.current) {
      try {
        // Temporarily remove protections for the export
        const originalUserSelect = document.body.style.userSelect
        document.body.style.userSelect = "auto"

        // Remove watermarks for the export
        const watermarks = document.querySelectorAll(".watermark-container")
        watermarks.forEach((watermark) => {
          watermark.classList.add("hidden")
        })

        // Use the enhanced PDF service for better formatting
        PdfService.generateAnalysisReport(propertyAddress, report, propertyData)

        // Restore protections
        document.body.style.userSelect = originalUserSelect
        watermarks.forEach((watermark) => {
          watermark.classList.remove("hidden")
        })
      } catch (error) {
        console.error("Failed to download report:", error)
        alert("Failed to download report. Please try again.")
      }
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Investment Analysis Report</span>
          <Badge variant="outline" className="ml-2">
            AI Generated
          </Badge>
        </CardTitle>
        <CardDescription>{propertyAddress}</CardDescription>
      </CardHeader>

      <ProtectedContent>
        <div ref={reportRef}>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Executive Summary</h3>
              <p className="text-muted-foreground">{report.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Strengths</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    {report.strengths.map((strength, index) => (
                      <li key={index} className="text-sm">
                        {strength}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Weaknesses</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    {report.weaknesses.map((weakness, index) => (
                      <li key={index} className="text-sm">
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Opportunities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    {report.opportunities.map((opportunity, index) => (
                      <li key={index} className="text-sm">
                        {opportunity}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Threats</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1">
                    {report.threats.map((threat, index) => (
                      <li key={index} className="text-sm">
                        {threat}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Recommended Offer Price</h3>
                <span className="text-xl font-bold">${report.recommendedOfferPrice.toLocaleString()}</span>
              </div>
              <p className="text-sm mt-2">{report.recommendedOfferPriceRationale}</p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-1">Cap Rate Analysis</h3>
                <p className="text-sm">{report.capRateAnalysis}</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-1">Cash Flow Analysis</h3>
                <p className="text-sm">{report.cashFlowAnalysis}</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-1">Return on Investment</h3>
                <p className="text-sm">{report.returnOnInvestment}</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Recommendations</h3>
              <ul className="list-disc pl-5 space-y-1">
                {report.recommendations.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </div>
      </ProtectedContent>

      <CardFooter className="flex justify-end pt-6">
        <DownloadPaywall onDownload={handleDownload} reportType="Analysis Report" />
      </CardFooter>
    </Card>
  )
}

