"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { type PropertyData, type OfferTemplate } from "@/services/ai-analysis-service"
import { Loader2 } from "lucide-react"
import { ProtectedContent } from "./protected-content"
import { DownloadPaywall } from "./download-paywall"
import { PdfService } from "@/services/enhanced-pdf-service"

interface OfferGeneratorProps {
  propertyData: PropertyData
  offerTemplate: OfferTemplate
}

export function OfferGenerator({ propertyData, offerTemplate }: OfferGeneratorProps) {
  const [customizedOffer, setCustomizedOffer] = useState<OfferTemplate>({ ...offerTemplate })
  const [buyerInfo, setBuyerInfo] = useState({
    name: "",
    company: "",
    contact: "",
  })
  const [offerLetter, setOfferLetter] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState("customize")
  const offerLetterRef = useRef<HTMLDivElement>(null)

  function handleOfferChange(field: keyof OfferTemplate, value: any) {
    setCustomizedOffer((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleContingencyChange = (index: number, value: string) => {
    const updatedContingencies = [...customizedOffer.contingencies]
    updatedContingencies[index] = value
    handleOfferChange("contingencies", updatedContingencies)
  }

  const addContingency = () => {
    handleOfferChange("contingencies", [...customizedOffer.contingencies, ""])
  }

  const removeContingency = (index: number) => {
    const updatedContingencies = customizedOffer.contingencies.filter((_, i) => i !== index)
    handleOfferChange("contingencies", updatedContingencies)
  }

  const handleBuyerInfoChange = (field: keyof typeof buyerInfo, value: string) => {
    setBuyerInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleGenerateOfferLetter = async () => {
    if (!buyerInfo.name || !buyerInfo.company || !buyerInfo.contact) {
      alert("Please fill in all buyer information fields")
      return
    }

    setIsGenerating(true)
    try {
      // Generate offer letter via API
      const response = await fetch('/api/generate-offer-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          propertyData, 
          offerTemplate: customizedOffer, 
          buyerInfo 
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || errorData.error || 'Failed to generate offer letter')
      }

      const data = await response.json()
      setOfferLetter(data.offerLetter)
      setActiveTab("preview")
    } catch (error) {
      console.error("Failed to generate offer letter:", error)
      alert(`Failed to generate offer letter: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
    if (offerLetterRef.current) {
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
        if (offerLetter) {
          PdfService.generateOfferLetter(propertyData.propertyAddress, offerLetter, buyerInfo)
        }

        // Restore protections
        document.body.style.userSelect = originalUserSelect
        watermarks.forEach((watermark) => {
          watermark.classList.remove("hidden")
        })
      } catch (error) {
        console.error("Failed to download offer letter:", error)
        alert("Failed to download offer letter. Please try again.")
      }
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="customize">Customize Offer</TabsTrigger>
        <TabsTrigger value="preview" disabled={!offerLetter}>
          Preview Offer Letter
        </TabsTrigger>
      </TabsList>

      <TabsContent value="customize" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Offer Details</CardTitle>
            <CardDescription>Customize your offer based on AI recommendations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="offerPrice">Offer Price ($)</Label>
                <Input
                  id="offerPrice"
                  type="number"
                  value={customizedOffer.offerPrice}
                  onChange={(e) => handleOfferChange("offerPrice", Number(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Offer Expiration Date</Label>
                <Input
                  id="dueDate"
                  value={customizedOffer.dueDate}
                  onChange={(e) => handleOfferChange("dueDate", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="closingTimeframe">Closing Timeframe</Label>
              <Input
                id="closingTimeframe"
                value={customizedOffer.closingTimeframe}
                onChange={(e) => handleOfferChange("closingTimeframe", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="financingTerms">Financing Terms</Label>
              <Input
                id="financingTerms"
                value={customizedOffer.financingTerms}
                onChange={(e) => handleOfferChange("financingTerms", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Contingencies</Label>
                <Button variant="outline" size="sm" onClick={addContingency}>
                  Add Contingency
                </Button>
              </div>
              <div className="space-y-2">
                {customizedOffer.contingencies.map((contingency, index) => (
                  <div key={index} className="flex gap-2">
                    <Input value={contingency} onChange={(e) => handleContingencyChange(index, e.target.value)} />
                    <Button variant="destructive" size="icon" onClick={() => removeContingency(index)}>
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalTerms">Additional Terms</Label>
              <Textarea
                id="additionalTerms"
                value={customizedOffer.additionalTerms}
                onChange={(e) => handleOfferChange("additionalTerms", e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Buyer Information</CardTitle>
            <CardDescription>Enter your information for the offer letter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buyerName">Your Name</Label>
                <Input
                  id="buyerName"
                  value={buyerInfo.name}
                  onChange={(e) => handleBuyerInfoChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyerCompany">Company Name</Label>
                <Input
                  id="buyerCompany"
                  value={buyerInfo.company}
                  onChange={(e) => handleBuyerInfoChange("company", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="buyerContact">Contact Information</Label>
              <Input
                id="buyerContact"
                value={buyerInfo.contact}
                onChange={(e) => handleBuyerInfoChange("contact", e.target.value)}
                placeholder="Phone, email, etc."
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleGenerateOfferLetter}
              disabled={isGenerating || !buyerInfo.name || !buyerInfo.company || !buyerInfo.contact}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Offer Letter...
                </>
              ) : (
                "Generate Offer Letter"
              )}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="preview">
        <Card>
          <CardHeader>
            <CardTitle>Offer Letter Preview</CardTitle>
            <CardDescription>Review your offer letter before sending</CardDescription>
          </CardHeader>
          <ProtectedContent>
            <CardContent>
              <div ref={offerLetterRef} className="bg-white border rounded-md p-6 whitespace-pre-wrap font-serif">
                {offerLetter}
              </div>
            </CardContent>
          </ProtectedContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab("customize")}>
              Edit Offer
            </Button>
            <DownloadPaywall onDownload={handleDownload} reportType="Offer Letter" />
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

