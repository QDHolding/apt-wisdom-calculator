"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { PropertyAnalysisReport } from "./components/property-analysis-report"
import { OfferGenerator } from "./components/offer-generator"
import { Logo } from "./components/logo"
import {
  type PropertyData,
  type AnalysisReport,
  type OfferTemplate,
} from "./services/ai-analysis-service"

export default function ApartmentAnalysisForm() {
  // [All the existing state variables from the previous component]
  // Property Information
  const [propertyAddress, setPropertyAddress] = useState("")
  const [propClass, setPropClass] = useState("")
  const [ownerContact, setOwnerContact] = useState("")
  const [contactPhone, setContactPhone] = useState("")

  // Price Information
  const [offerPrice, setOfferPrice] = useState<number | "">("")
  const [askingPrice, setAskingPrice] = useState<number | "">("")
  const [rehabCost, setRehabCost] = useState<number | "">("")
  const [numUnits, setNumUnits] = useState<number>(0)

  // Mortgage Information
  const [mortgage1Amount, setMortgage1Amount] = useState<number | "">("")
  const [mortgage1Rate, setMortgage1Rate] = useState<number | "">("")
  const [mortgage1Payment, setMortgage1Payment] = useState<number | "">("")
  const [mortgage1Assumable, setMortgage1Assumable] = useState<boolean>(false)

  const [mortgage2Amount, setMortgage2Amount] = useState<number | "">("")
  const [mortgage2Rate, setMortgage2Rate] = useState<number | "">("")
  const [mortgage2Payment, setMortgage2Payment] = useState<number | "">("")
  const [mortgage2Assumable, setMortgage2Assumable] = useState<boolean>(false)

  // Unit Mix
  const [subsidizedUnits, setSubsidizedUnits] = useState<number>(0)
  const [units, setUnits] = useState<Array<{
    beds: number | string
    baths: number
    rent: number
    ttlMonthRent: number
    count: number
  }>>([
    { beds: 1, baths: 1, rent: 0, ttlMonthRent: 0, count: 0 },
    { beds: 2, baths: 1, rent: 0, ttlMonthRent: 0, count: 0 },
    { beds: 2, baths: 1.5, rent: 0, ttlMonthRent: 0, count: 0 },
    { beds: 2, baths: 2, rent: 0, ttlMonthRent: 0, count: 0 },
    { beds: 2, baths: 2, rent: 0, ttlMonthRent: 0, count: 0 },
    { beds: 2, baths: 2, rent: 0, ttlMonthRent: 0, count: 0 },
    { beds: 3, baths: 2, rent: 0, ttlMonthRent: 0, count: 0 },
    { beds: "eff", baths: 0, rent: 0, ttlMonthRent: 0, count: 0 },
  ])

  // Operating Expenses
  const [allBillsPaid, setAllBillsPaid] = useState(false)
  const [expenses, setExpenses] = useState({
    taxes: 0,
    insurance: 0,
    waterSewer: 0,
    floodInsurance: 0,
    trashRemoval: 0,
    electric: 0,
    gas: 0,
    oil: 0,
    legal: 0,
    management: 0,
    payroll: 0,
    repairs: 0,
    supplies: 0,
    pestControl: 0,
    telephone: 0,
    advertising: 0,
    poolMaintenance: 0,
    generalAdmin: 0,
    contractServices: 0,
    security: 0,
    other: 0,
  })

  // Calculated Values
  const [totalUnits, setTotalUnits] = useState(0)
  const [totalRent, setTotalRent] = useState(0)
  const [monthlyIncome, setMonthlyIncome] = useState(0)
  const [yearlyIncome, setYearlyIncome] = useState(0)
  const [otherIncome, setOtherIncome] = useState(0)
  const [totalGSI, setTotalGSI] = useState(0)
  const [vacancyRate, setVacancyRate] = useState(0)
  const [vacancyLoss, setVacancyLoss] = useState(0)
  const [opExpenseRate, setOpExpenseRate] = useState(0)
  const [opExpenseAmount, setOpExpenseAmount] = useState(0)
  const [netOperatingIncome, setNetOperatingIncome] = useState(0)
  const [capRateAskingPrice, setCapRateAskingPrice] = useState(0)
  const [capRateOfferPrice, setCapRateOfferPrice] = useState(0)
  const [capRateOfferRehab, setCapRateOfferRehab] = useState(0)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [expenseRatio, setExpenseRatio] = useState(0)

  // Debt Service
  const [downPayment, setDownPayment] = useState<number | "">("")
  const [closingCosts, setClosingCosts] = useState<number | "">("")
  const [rehabNeeded, setRehabNeeded] = useState(0)

  // AI Analysis State
  const [activeTab, setActiveTab] = useState("form")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisReport, setAnalysisReport] = useState<AnalysisReport | null>(null)
  const [offerTemplate, setOfferTemplate] = useState<OfferTemplate | null>(null)

  // [All the existing useEffect hooks from the previous component]
  // Calculate totals when units change
  useEffect(() => {
    const totalUnitCount = units.reduce((sum, unit) => sum + (unit.count || 0), 0)
    const totalMonthlyRent = units.reduce((sum, unit) => sum + (unit.ttlMonthRent || 0), 0)

    setTotalUnits(totalUnitCount)
    setTotalRent(totalMonthlyRent)
    setMonthlyIncome(totalMonthlyRent)
    setYearlyIncome(totalMonthlyRent * 12)
  }, [units])

  // Calculate GSI
  useEffect(() => {
    setTotalGSI(yearlyIncome + (otherIncome || 0))
  }, [yearlyIncome, otherIncome])

  // Calculate vacancy loss
  useEffect(() => {
    setVacancyLoss(totalGSI * (vacancyRate / 100))
  }, [totalGSI, vacancyRate])

  // Calculate operating expenses
  useEffect(() => {
    const totalExp = Object.values(expenses).reduce((sum, exp) => sum + (exp || 0), 0)
    setTotalExpenses(totalExp)
    setOpExpenseAmount(totalGSI * (opExpenseRate / 100))
    setExpenseRatio((totalExp / totalGSI) * 100 || 0)
  }, [expenses, totalGSI, opExpenseRate])

  // Calculate NOI
  useEffect(() => {
    setNetOperatingIncome(totalGSI - vacancyLoss - (opExpenseAmount || totalExpenses))
  }, [totalGSI, vacancyLoss, opExpenseAmount, totalExpenses])

  // Calculate cap rates
  useEffect(() => {
    if (askingPrice) {
      setCapRateAskingPrice((netOperatingIncome / askingPrice) * 100)
    }
    if (offerPrice) {
      setCapRateOfferPrice((netOperatingIncome / offerPrice) * 100)
      if (rehabCost) {
        setCapRateOfferRehab((netOperatingIncome / (offerPrice + rehabCost)) * 100)
      }
    }
  }, [netOperatingIncome, askingPrice, offerPrice, rehabCost])

  // [All the existing helper functions from the previous component]
  // Update unit total rent when count or rent changes
  const updateUnit = (index: number, field: "count" | "rent", value: number) => {
    const updatedUnits = [...units]
    updatedUnits[index][field] = value

    // Recalculate total rent for this unit type
    if (field === "count" || field === "rent") {
      updatedUnits[index].ttlMonthRent = updatedUnits[index].count * updatedUnits[index].rent
    }

    setUnits(updatedUnits)
  }

  // Update expense value
  const updateExpense = (field: keyof typeof expenses, value: string) => {
    setExpenses({
      ...expenses,
      [field]: Number.parseFloat(value) || 0,
    })
  }

  // New function to run AI analysis
  const runAnalysis = async () => {
    if (!propertyAddress) {
      alert("Please enter a property address")
      return
    }

    setIsAnalyzing(true)

    try {
      // Prepare property data for analysis
      const propertyData: PropertyData = {
        propertyAddress,
        propClass,
        ownerContact,
        contactPhone,
        offerPrice: (offerPrice as number) || 0,
        askingPrice: (askingPrice as number) || 0,
        rehabCost: (rehabCost as number) || 0,
        numUnits: totalUnits,
        totalRent,
        monthlyIncome,
        yearlyIncome,
        otherIncome,
        totalGSI,
        vacancyRate,
        vacancyLoss,
        opExpenseRate,
        opExpenseAmount,
        totalExpenses,
        netOperatingIncome,
        capRateAskingPrice,
        capRateOfferPrice,
        capRateOfferRehab,
        expenseRatio,
        units,
        expenses,
      }

      try {
        // Generate analysis report via API
        const analysisResponse = await fetch('/api/analyze-property', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(propertyData),
        })

        if (!analysisResponse.ok) {
          const errorData = await analysisResponse.json()
          throw new Error(errorData.details || errorData.error || 'Failed to generate analysis')
        }

        const report = await analysisResponse.json()
        setAnalysisReport(report)

        try {
          // Generate offer template via API
          const offerResponse = await fetch('/api/generate-offer', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ propertyData, analysisReport: report }),
          })

          if (!offerResponse.ok) {
            const errorData = await offerResponse.json()
            throw new Error(errorData.details || errorData.error || 'Failed to generate offer template')
          }

          const template = await offerResponse.json()
          setOfferTemplate(template)

          // Switch to analysis tab
          setActiveTab("analysis")
        } catch (offerError) {
          console.error("Offer template generation failed:", offerError)
          alert(`Failed to generate offer template: ${offerError instanceof Error ? offerError.message : "Unknown error"}`)
          // Still switch to analysis tab since we have the report
          setActiveTab("analysis")
        }
      } catch (analysisError) {
        console.error("Analysis failed:", analysisError)
        alert(`Failed to generate analysis: ${analysisError instanceof Error ? analysisError.message : "Unknown error"}`)
      }
    } catch (error) {
      console.error("General error:", error)
      alert("An unexpected error occurred. Please check your data and try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="form">Property Data</TabsTrigger>
          <TabsTrigger value="analysis" disabled={!analysisReport}>
            Analysis Report
          </TabsTrigger>
          <TabsTrigger value="offer" disabled={!offerTemplate}>
            Generate Offer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <Card className="border-0 overflow-hidden">
            {/* Header */}
            <div className="bg-wealth-gradient text-white p-6 flex flex-col md:flex-row justify-between items-start md:items-center rounded-t-lg">
              <div className="flex items-center">
                <Logo size="md" variant="full" />
                <div className="ml-4">
                  <h1 className="text-2xl font-bold mb-1">Apartment Analysis Form</h1>
                  <p className="text-investor-gold font-medium">Unlock the true potential of your investment</p>
                </div>
              </div>
              <div className="mt-3 md:mt-0 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg text-sm">
                <div className="flex items-center mb-1">
                  <span className="w-3 h-3 bg-investor-gold rounded-full mr-2"></span>
                  <span>ENTER DATA IN HIGHLIGHTED FIELDS</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-investor-gold/50 rounded-full mr-2"></span>
                  <span>USE WHOLE DOLLAR AMOUNTS</span>
                </div>
              </div>
            </div>

            {/* Rest of the form remains unchanged */}
            {/* Property Information */}
            <div className="grid grid-cols-2 gap-4 p-4 border-b">
              <div>
                <Label htmlFor="propertyAddress">Property Address</Label>
                <Input
                  id="propertyAddress"
                  className="bg-investor-gold/10 border-investor-gold/30"
                  value={propertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="offerPrice">Offer Price</Label>
                <div className="flex items-center">
                  <span className="mr-2">$</span>
                  <Input
                    id="offerPrice"
                    className="bg-investor-gold/10 border-investor-gold/30"
                    type="number"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value ? Number.parseFloat(e.target.value) : "")}
                  />
                  <span className="mx-2">Offer + rehab</span>
                  <span className="ml-2">$</span>
                  <Input readOnly value={offerPrice && rehabCost ? (offerPrice + rehabCost).toFixed(0) : "-"} />
                </div>
              </div>

              <div>
                <Label htmlFor="propClass">Prop Class A/B/C</Label>
                <Input
                  id="propClass"
                  className="bg-investor-gold/10 border-investor-gold/30"
                  value={propClass}
                  onChange={(e) => setPropClass(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="askingPrice">Asking Price</Label>
                <div className="flex items-center">
                  <span className="mr-2">$</span>
                  <Input
                    id="askingPrice"
                    className="bg-investor-gold/10 border-investor-gold/30"
                    type="number"
                    value={askingPrice}
                    onChange={(e) => setAskingPrice(e.target.value ? Number.parseFloat(e.target.value) : "")}
                  />
                  <span className="mx-2">Asking + rehab</span>
                  <span className="ml-2">$</span>
                  <Input readOnly value={askingPrice && rehabCost ? (askingPrice + rehabCost).toFixed(0) : "-"} />
                </div>
              </div>

              <div>
                <Label htmlFor="ownerContact">Owner/contact</Label>
                <Input
                  id="ownerContact"
                  className="bg-investor-gold/10 border-investor-gold/30"
                  value={ownerContact}
                  onChange={(e) => setOwnerContact(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="numUnits"># Units</Label>
                <Input id="numUnits" type="number" value={totalUnits} readOnly />
              </div>

              <div>
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  className="bg-investor-gold/10 border-investor-gold/30"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unitOffer">$/Unit offer</Label>
                  <Input
                    id="unitOffer"
                    readOnly
                    value={offerPrice && totalUnits ? (offerPrice / totalUnits).toFixed(0) : "-"}
                  />
                </div>
                <div>
                  <Label htmlFor="unitOfferRehab">offer + rehab</Label>
                  <Input
                    id="unitOfferRehab"
                    readOnly
                    value={
                      offerPrice && rehabCost && totalUnits ? ((offerPrice + rehabCost) / totalUnits).toFixed(0) : "-"
                    }
                  />
                </div>
              </div>
            </div>

            {/* Mortgages */}
            <div className="p-4 border-b">
              <h2 className="font-bold mb-2">Mortgages</h2>
              <div className="grid grid-cols-5 gap-4 mb-2">
                <div></div>
                <div className="font-semibold">Amount</div>
                <div className="font-semibold">Rate</div>
                <div className="font-semibold">Payment</div>
                <div className="font-semibold">Assumable Y/N</div>
              </div>

              <div className="grid grid-cols-5 gap-4 mb-2">
                <div className="font-semibold">Current 1st</div>
                <div className="flex items-center">
                  <span className="mr-2">$</span>
                  <Input
                    className="bg-investor-gold/10 border-investor-gold/30"
                    type="number"
                    value={mortgage1Amount}
                    onChange={(e) => setMortgage1Amount(e.target.value ? Number.parseFloat(e.target.value) : "")}
                  />
                </div>
                <div>
                  <Input
                    className="bg-investor-gold/10 border-investor-gold/30"
                    type="number"
                    value={mortgage1Rate}
                    onChange={(e) => setMortgage1Rate(e.target.value ? Number.parseFloat(e.target.value) : "")}
                  />
                </div>
                <div className="flex items-center">
                  <span className="mr-2">$</span>
                  <Input
                    className="bg-investor-gold/10 border-investor-gold/30"
                    type="number"
                    value={mortgage1Payment}
                    onChange={(e) => setMortgage1Payment(e.target.value ? Number.parseFloat(e.target.value) : "")}
                  />
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="mortgage1Assumable"
                    checked={mortgage1Assumable}
                    onCheckedChange={(checked) => setMortgage1Assumable(checked === true)}
                    className="bg-investor-gold/10 border-investor-gold/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-5 gap-4">
                <div className="font-semibold">Current 2nd</div>
                <div className="flex items-center">
                  <span className="mr-2">$</span>
                  <Input
                    className="bg-investor-gold/10 border-investor-gold/30"
                    type="number"
                    value={mortgage2Amount}
                    onChange={(e) => setMortgage2Amount(e.target.value ? Number.parseFloat(e.target.value) : "")}
                  />
                </div>
                <div>
                  <Input
                    className="bg-investor-gold/10 border-investor-gold/30"
                    type="number"
                    value={mortgage2Rate}
                    onChange={(e) => setMortgage2Rate(e.target.value ? Number.parseFloat(e.target.value) : "")}
                  />
                </div>
                <div className="flex items-center">
                  <span className="mr-2">$</span>
                  <Input
                    className="bg-investor-gold/10 border-investor-gold/30"
                    type="number"
                    value={mortgage2Payment}
                    onChange={(e) => setMortgage2Payment(e.target.value ? Number.parseFloat(e.target.value) : "")}
                  />
                </div>
                <div className="flex items-center">
                  <Checkbox
                    id="mortgage2Assumable"
                    checked={mortgage2Assumable}
                    onCheckedChange={(checked) => setMortgage2Assumable(checked === true)}
                    className="bg-investor-gold/10 border-investor-gold/30"
                  />
                </div>
              </div>
            </div>

            {/* Unit Mix and Operating Expenses */}
            <div className="grid grid-cols-2 gap-4 p-4 border-b">
              {/* Unit Mix */}
              <div>
                <h2 className="font-bold mb-2">Unit Mix</h2>
                <div className="mb-2">
                  <Label htmlFor="subsidizedUnits">Subsidized Units</Label>
                  <Input
                    id="subsidizedUnits"
                    className="bg-investor-gold/10 border-investor-gold/30 w-24"
                    type="number"
                    value={subsidizedUnits}
                    onChange={(e) => setSubsidizedUnits(Number.parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border p-1 text-sm">No of Units</th>
                        <th className="border p-1 text-sm">Beds</th>
                        <th className="border p-1 text-sm">Baths</th>
                        <th className="border p-1 text-sm">Curr Rent/mo</th>
                        <th className="border p-1 text-sm">TTL Month rent</th>
                      </tr>
                    </thead>
                    <tbody>
                      {units.map((unit, index) => (
                        <tr key={index}>
                          <td className="border p-1">
                            <Input
                              className="bg-investor-gold/10 border-investor-gold/30 w-full p-1 h-8"
                              type="number"
                              value={unit.count}
                              onChange={(e) => updateUnit(index, "count", Number.parseInt(e.target.value) || 0)}
                            />
                          </td>
                          <td className="border p-1 text-center">{unit.beds}</td>
                          <td className="border p-1 text-center">{unit.baths}</td>
                          <td className="border p-1">
                            <Input
                              className="bg-investor-gold/10 border-investor-gold/30 w-full p-1 h-8"
                              type="number"
                              value={unit.rent}
                              onChange={(e) => updateUnit(index, "rent", Number.parseInt(e.target.value) || 0)}
                            />
                          </td>
                          <td className="border p-1 text-center">${unit.ttlMonthRent}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-100">
                        <td className="border p-1 font-bold">Total Units</td>
                        <td className="border p-1" colSpan={2}></td>
                        <td className="border p-1 font-bold">Total Rent</td>
                        <td className="border p-1 font-bold">${totalRent}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="mt-4">
                  <h2 className="font-bold mb-2">Total Income Analysis</h2>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-semibold">Total Monthly Income ($/mo)</div>
                    <div className="text-right">${monthlyIncome}</div>

                    <div className="font-semibold">Total Gross Yearly Income (GYI)</div>
                    <div className="text-right">${yearlyIncome}</div>

                    <div className="font-semibold">Other Income</div>
                    <div className="flex justify-end">
                      <Input
                        className="bg-investor-gold/10 border-investor-gold/30 w-24 text-right"
                        type="number"
                        value={otherIncome}
                        onChange={(e) => setOtherIncome(Number.parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div className="font-semibold">Total Gross Scheduled Income (GSI)</div>
                    <div className="text-right">${totalGSI}</div>

                    <div className="font-semibold">Vacancy % ***</div>
                    <div className="flex justify-end">
                      <Input
                        className="bg-investor-gold/10 border-investor-gold/30 w-24 text-right"
                        type="number"
                        value={vacancyRate}
                        onChange={(e) => setVacancyRate(Number.parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div className="font-semibold">Op Expenses</div>
                    <div className="flex justify-end">
                      <Input
                        className="bg-investor-gold/10 border-investor-gold/30 w-24 text-right"
                        type="number"
                        value={opExpenseRate}
                        onChange={(e) => setOpExpenseRate(Number.parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div className="font-semibold">Net Operating Income</div>
                    <div className="text-right">${netOperatingIncome.toFixed(0)}</div>

                    <div className="font-semibold">Cap Rate Asking Price</div>
                    <div className="text-right">{capRateAskingPrice.toFixed(2)}%</div>

                    <div className="font-semibold">Cap Rate Offer Price</div>
                    <div className="text-right">{capRateOfferPrice.toFixed(2)}%</div>

                    <div className="font-semibold">Cap Rate on Offer + Rehab</div>
                    <div className="text-right">{capRateOfferRehab.toFixed(2)}%</div>
                  </div>
                </div>
              </div>

              {/* Operating Expenses */}
              <div>
                <h2 className="font-bold mb-2">Annual Operating Expense Analysis</h2>
                <div className="flex items-center mb-4">
                  <Label htmlFor="allBillsPaid" className="mr-2">
                    All Bills Paid?
                  </Label>
                  <div className="flex-1"></div>
                  <div className="flex items-center">
                    <Checkbox
                      id="allBillsPaid"
                      checked={allBillsPaid}
                      onCheckedChange={(checked) => setAllBillsPaid(checked === true)}
                      className="bg-investor-gold/10 border-investor-gold/30 mr-2"
                    />
                    <span>{allBillsPaid ? "yes" : "no"}</span>
                  </div>
                  <div className="ml-4">% of GSI</div>
                </div>

                <div className="space-y-2">
                  {(Object.entries({
                    taxes: "Taxes Due next year",
                    insurance: "Insurance",
                    waterSewer: "Water & Sewer",
                    floodInsurance: "Flood Insurance",
                    trashRemoval: "Trash Removal",
                    electric: "Electric",
                    gas: "Gas",
                    oil: "Oil",
                    legal: "Legal & Acct, license & permit",
                    management: "Management Fees",
                    payroll: "Onsite Payroll & benefits",
                    repairs: "Repairs & Maintenance",
                    supplies: "Supplies & Miscellaneous",
                    pestControl: "Pest Control",
                    telephone: "Telephone",
                    advertising: "Advertising/marketing",
                    poolMaintenance: "Pool Maintenance/landscaping",
                    generalAdmin: "General Admin",
                    contractServices: "Other Contract Services",
                    security: "Security",
                    other: "Other",
                  }) as Array<[keyof typeof expenses, string]>).map(([key, label]) => (
                    <div key={key} className="grid grid-cols-2 gap-2">
                      <div>{label}</div>
                      <div className="flex items-center">
                        <span className="mr-2">$</span>
                        <Input
                          className="bg-investor-gold/10 border-investor-gold/30"
                          type="number"
                          value={expenses[key]}
                          onChange={(e) => updateExpense(key, e.target.value)}
                        />
                      </div>
                    </div>
                  ))}

                  <div className="grid grid-cols-2 gap-2 font-bold">
                    <div>Total operating Expenses</div>
                    <div className="flex items-center">
                      <span className="mr-2">$</span>
                      <Input readOnly value={totalExpenses.toFixed(0)} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 font-bold">
                    <div>Total Expenses / GSI</div>
                    <div className="text-right">{expenseRatio.toFixed(2)}%</div>
                  </div>
                </div>

                <div className="mt-6">
                  <h2 className="font-bold mb-2">Debt Service Analysis</h2>
                  <div className="grid grid-cols-3 gap-2">
                    <div>Down Payment</div>
                    <div className="flex items-center col-span-2">
                      <span className="mr-2">$</span>
                      <Input
                        className="bg-investor-gold/10 border-investor-gold/30"
                        type="number"
                        value={downPayment}
                        onChange={(e) => setDownPayment(e.target.value ? Number.parseFloat(e.target.value) : "")}
                      />
                    </div>

                    <div>Closing Costs</div>
                    <div className="flex items-center col-span-2">
                      <span className="mr-2">$</span>
                      <Input
                        className="bg-investor-gold/10 border-investor-gold/30"
                        type="number"
                        value={closingCosts}
                        onChange={(e) => setClosingCosts(e.target.value ? Number.parseFloat(e.target.value) : "")}
                      />
                    </div>

                    <div>rehab needed/deferred maint</div>
                    <div className="flex items-center col-span-2">
                      <Input
                        className="bg-investor-gold/10 border-investor-gold/30"
                        type="number"
                        value={rehabCost}
                        onChange={(e) => setRehabCost(e.target.value ? Number.parseFloat(e.target.value) : "")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Button to run analysis */}
            <div className="p-4 flex justify-end">
              <Button
                onClick={runAnalysis}
                disabled={isAnalyzing}
                className="bg-investor-navy hover:bg-investor-navy/90 text-white px-6 py-2.5 rounded-lg shadow-premium transition-all hover:shadow-wealth"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Property...
                  </>
                ) : (
                  "Run AI Analysis"
                )}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="analysis">
          {analysisReport && (
            <div className="space-y-4">
              <PropertyAnalysisReport 
                report={analysisReport} 
                propertyAddress={propertyAddress}
                propertyData={{
                  capRateAskingPrice,
                  capRateOfferPrice,
                  capRateOfferRehab,
                  netOperatingIncome,
                  numUnits: totalUnits,
                  monthlyIncome,
                  yearlyIncome,
                  totalGSI,
                  vacancyRate,
                  vacancyLoss,
                  opExpenseAmount,
                  totalExpenses,
                  expenseRatio,
                  offerPrice,
                  askingPrice,
                  rehabCost
                }}
              />

              <div className="flex justify-end">
                <Button
                  onClick={() => setActiveTab("offer")}
                  className="bg-investor-gold hover:bg-investor-gold/90 text-investor-navy font-medium px-6 py-2.5 rounded-lg shadow-premium transition-all hover:shadow-wealth"
                >
                  Proceed to Offer Generation
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="offer">
          {offerTemplate && (
            <OfferGenerator
              propertyData={{
                propertyAddress,
                propClass,
                ownerContact,
                contactPhone,
                offerPrice: (offerPrice as number) || 0,
                askingPrice: (askingPrice as number) || 0,
                rehabCost: (rehabCost as number) || 0,
                numUnits: totalUnits,
                totalRent,
                monthlyIncome,
                yearlyIncome,
                otherIncome,
                totalGSI,
                vacancyRate,
                vacancyLoss,
                opExpenseRate,
                opExpenseAmount,
                totalExpenses,
                netOperatingIncome,
                capRateAskingPrice,
                capRateOfferPrice,
                capRateOfferRehab,
                expenseRatio,
                units,
                expenses,
              }}
              offerTemplate={offerTemplate}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

