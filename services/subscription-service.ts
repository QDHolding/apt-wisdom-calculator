export type SubscriptionPlan = {
  id: string
  name: string
  price: number
  downloads: number
  features: string[]
}

export type UserSubscription = {
  planId: string
  active: boolean
  downloadsRemaining: number
  expiresAt: Date
  stripeSessionId?: string
}

// Free trial tracking
export type FreeTrialUsage = {
  analysesUsed: number
  totalAllowed: number
}

// Mock subscription plans
export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "Basic",
    price: 9.99,
    downloads: 3,
    features: ["Download PDF reports", "Basic watermark removal", "Valid for 30 days"],
  },
  {
    id: "pro",
    name: "Professional",
    price: 29.99,
    downloads: 15,
    features: ["Download PDF reports", "No watermarks", "Excel export", "Valid for 30 days"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 99.99,
    downloads: 100,
    features: ["Unlimited PDF downloads", "No watermarks", "Excel & CSV exports", "API access", "Valid for 1 year"],
  },
]

// Mock user subscription (would normally be stored in a database)
let currentUserSubscription: UserSubscription | null = null

// Free trial usage tracking (would normally be stored in a database or localStorage)
let freeTrialUsage: FreeTrialUsage = {
  analysesUsed: 0,
  totalAllowed: 2,
}

export const SubscriptionService = {
  // Get current user subscription
  getCurrentSubscription: (): UserSubscription | null => {
    return currentUserSubscription
  },

  // Get free trial usage
  getFreeTrialUsage: (): FreeTrialUsage => {
    // In a real app, you would retrieve this from localStorage or a database
    const storedUsage = localStorage.getItem("freeTrialUsage")
    if (storedUsage) {
      freeTrialUsage = JSON.parse(storedUsage)
    }
    return freeTrialUsage
  },

  // Update free trial usage
  updateFreeTrialUsage: (used: number): void => {
    freeTrialUsage.analysesUsed = used
    // In a real app, you would store this in localStorage or a database
    localStorage.setItem("freeTrialUsage", JSON.stringify(freeTrialUsage))
  },

  // Check if user has free trial uses remaining
  hasFreeTrialRemaining: (): boolean => {
    const usage = SubscriptionService.getFreeTrialUsage()
    return usage.analysesUsed < usage.totalAllowed
  },

  // Use a free trial analysis
  useFreeTrialAnalysis: (): boolean => {
    const usage = SubscriptionService.getFreeTrialUsage()
    if (usage.analysesUsed < usage.totalAllowed) {
      usage.analysesUsed += 1
      SubscriptionService.updateFreeTrialUsage(usage.analysesUsed)
      return true
    }
    return false
  },

  // Check if user can download
  canDownload: (): boolean => {
    // First check if user has free trial uses remaining
    if (SubscriptionService.hasFreeTrialRemaining()) {
      return true
    }

    // Otherwise check for active subscription
    if (!currentUserSubscription) return false
    if (!currentUserSubscription.active) return false
    if (currentUserSubscription.downloadsRemaining <= 0) return false
    if (new Date() > currentUserSubscription.expiresAt) return false
    return true
  },

  // Process a download (decrement counter or use free trial)
  processDownload: (): boolean => {
    // First try to use a free trial
    let usedFreeTrial = false
    if (SubscriptionService.hasFreeTrialRemaining()) {
      usedFreeTrial = SubscriptionService.useFreeTrialAnalysis()
    }

    if (usedFreeTrial) {
      return true
    }

    // Otherwise use subscription
    if (!SubscriptionService.canDownload()) return false

    currentUserSubscription!.downloadsRemaining -= 1
    return true
  },

  // Create a Stripe checkout session
  createCheckoutSession: async (planId: string): Promise<string> => {
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          successUrl: `${window.location.origin}?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: window.location.origin,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to create checkout session")
      }

      const { sessionId } = await response.json()
      return sessionId
    } catch (error) {
      console.error("Error creating checkout session:", error)
      throw error
    }
  },

  // Activate subscription after successful payment
  activateSubscription: async (
    planId: string,
    downloads: number,
    expiresInDays: number,
    stripeSessionId?: string,
  ): Promise<UserSubscription> => {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expiresInDays)

    currentUserSubscription = {
      planId,
      active: true,
      downloadsRemaining: downloads,
      expiresAt,
      stripeSessionId,
    }

    return currentUserSubscription
  },

  // Legacy method for mock subscriptions (for testing without Stripe)
  subscribe: (planId: string): Promise<UserSubscription> => {
    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        const plan = subscriptionPlans.find((p) => p.id === planId)
        if (!plan) throw new Error("Invalid plan")

        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + (planId === "enterprise" ? 365 : 30))

        currentUserSubscription = {
          planId,
          active: true,
          downloadsRemaining: plan.downloads,
          expiresAt,
        }

        resolve(currentUserSubscription)
      }, 1000)
    })
  },

  // Cancel subscription
  cancelSubscription: (): Promise<void> => {
    return new Promise((resolve) => {
      // Simulate API call
      setTimeout(() => {
        if (currentUserSubscription) {
          currentUserSubscription.active = false
        }
        resolve()
      }, 1000)
    })
  },

  // Check for active session on page load
  checkSession: async (sessionId: string): Promise<boolean> => {
    try {
      // In a real app, you would verify the session with Stripe
      // For now, we'll simulate this
      if (sessionId) {
        // Find a plan (in a real app, you'd get this from the session)
        const plan = subscriptionPlans[0] // Default to basic plan for demo
        await SubscriptionService.activateSubscription(
          plan.id,
          plan.downloads,
          30, // 30 days
          sessionId,
        )
        return true
      }
      return false
    } catch (error) {
      console.error("Error checking session:", error)
      return false
    }
  },

  // Reset free trial (for testing purposes)
  resetFreeTrial: (): void => {
    SubscriptionService.updateFreeTrialUsage(0)
  },
}

