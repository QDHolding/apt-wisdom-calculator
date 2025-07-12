"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader2, Check, Download, Gift } from "lucide-react"
import { SubscriptionService, subscriptionPlans } from "@/services/subscription-service"
import { getStripe } from "@/lib/stripe"
import { useSearchParams } from "next/navigation"
import { Badge } from "@/components/ui/badge"

interface DownloadPaywallProps {
  onDownload: () => void
  reportType: string
}

export function DownloadPaywall({ onDownload, reportType }: DownloadPaywallProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string>(subscriptionPlans[0].id)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [downloadsRemaining, setDownloadsRemaining] = useState(0)
  const [isCheckingSession, setIsCheckingSession] = useState(false)
  const [freeTrialUsage, setFreeTrialUsage] = useState({ analysesUsed: 0, totalAllowed: 2 })
  const [hasUsedFreeTrial, setHasUsedFreeTrial] = useState(false)

  const searchParams = useSearchParams()

  // Check for successful payment on component mount and get free trial status
  useEffect(() => {
    const sessionId = searchParams.get("session_id")

    if (sessionId) {
      setIsCheckingSession(true)

      SubscriptionService.checkSession(sessionId)
        .then((success) => {
          if (success) {
            const subscription = SubscriptionService.getCurrentSubscription()
            if (subscription) {
              setIsSubscribed(true)
              setDownloadsRemaining(subscription.downloadsRemaining)
            }
          }
        })
        .finally(() => {
          setIsCheckingSession(false)
        })
    }

    // Get free trial usage
    const usage = SubscriptionService.getFreeTrialUsage()
    setFreeTrialUsage(usage)
  }, [searchParams])

  const handleDownloadClick = () => {
    // Check if user has free trial uses remaining
    if (SubscriptionService.hasFreeTrialRemaining()) {
      setHasUsedFreeTrial(true)
      onDownload()
      return
    }

    // Otherwise check for subscription
    const canDownload = SubscriptionService.canDownload()

    if (canDownload) {
      SubscriptionService.processDownload()
      const subscription = SubscriptionService.getCurrentSubscription()
      setDownloadsRemaining(subscription?.downloadsRemaining || 0)
      onDownload()
    } else {
      setIsDialogOpen(true)
    }
  }

  useEffect(() => {
    if (hasUsedFreeTrial) {
      SubscriptionService.useFreeTrialAnalysis()
      const updatedUsage = SubscriptionService.getFreeTrialUsage()
      setFreeTrialUsage(updatedUsage)
      setHasUsedFreeTrial(false)
    }
  }, [hasUsedFreeTrial])

  const handleSubscribe = async () => {
    setIsProcessing(true)
    try {
      // Create Stripe checkout session
      const sessionId = await SubscriptionService.createCheckoutSession(selectedPlan)

      // Redirect to Stripe Checkout
      const stripe = await getStripe()
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId })
      }
    } catch (error) {
      console.error("Subscription failed:", error)
      alert("Payment processing failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  // For demo purposes, allow using the mock subscription method
  const handleMockSubscribe = async () => {
    setIsProcessing(true)
    try {
      const subscription = await SubscriptionService.subscribe(selectedPlan)
      setIsSubscribed(true)
      setDownloadsRemaining(subscription.downloadsRemaining)
      setTimeout(() => {
        setIsDialogOpen(false)
        onDownload()
      }, 1500)
    } catch (error) {
      console.error("Subscription failed:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  // For demo purposes, reset free trial
  const handleResetFreeTrial = () => {
    SubscriptionService.resetFreeTrial()
    const updatedUsage = SubscriptionService.getFreeTrialUsage()
    setFreeTrialUsage(updatedUsage)
  }

  // Determine button text based on free trial status
  const getButtonText = () => {
    if (SubscriptionService.hasFreeTrialRemaining()) {
      return `Download ${reportType} (${freeTrialUsage.analysesUsed + 1} of ${freeTrialUsage.totalAllowed} Free)`
    }
    return `Download ${reportType}`
  }

  return (
    <div className="flex flex-col items-end gap-2">
      {freeTrialUsage.analysesUsed < freeTrialUsage.totalAllowed && (
        <Badge variant="outline" className="bg-investor-gold/10 text-investor-navy flex items-center gap-1 mb-1">
          <Gift size={14} />
          <span>
            {freeTrialUsage.totalAllowed - freeTrialUsage.analysesUsed} free{" "}
            {freeTrialUsage.totalAllowed - freeTrialUsage.analysesUsed === 1 ? "analysis" : "analyses"} remaining
          </span>
        </Badge>
      )}

      <Button onClick={handleDownloadClick} className="flex items-center gap-2">
        <Download size={16} />
        {getButtonText()}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Subscribe to Download</DialogTitle>
            <DialogDescription>
              You&apos;ve used all your free analyses. Choose a subscription plan to continue downloading reports.
            </DialogDescription>
          </DialogHeader>

          {isSubscribed ? (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="bg-green-100 rounded-full p-3 mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Subscription Successful!</h3>
              <p className="text-center text-muted-foreground">
                You now have {downloadsRemaining} downloads remaining.
              </p>
            </div>
          ) : (
            <>
              <div className="py-4">
                <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan}>
                  {subscriptionPlans.map((plan) => (
                    <div key={plan.id} className="flex items-start space-x-3 space-y-3">
                      <RadioGroupItem value={plan.id} id={plan.id} className="mt-1" />
                      <div className="grid gap-1.5 w-full">
                        <div className="flex justify-between">
                          <Label htmlFor={plan.id} className="font-medium">
                            {plan.name}
                          </Label>
                          <span className="font-bold">${plan.price}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{plan.downloads} downloads included</p>
                        <ul className="text-sm text-muted-foreground list-disc pl-4 mt-1">
                          {plan.features.map((feature, i) => (
                            <li key={i}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubscribe} disabled={isProcessing} className="bg-investor-navy">
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Pay with Stripe"
                  )}
                </Button>
                <Button onClick={handleMockSubscribe} disabled={isProcessing} variant="outline" className="text-xs">
                  Demo: Skip Payment
                </Button>
                {/* For demo purposes only */}
                <Button onClick={handleResetFreeTrial} variant="ghost" size="sm" className="text-xs opacity-50">
                  Demo: Reset Free Trial
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

