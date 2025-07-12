import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { subscriptionPlans } from "@/services/subscription-service"

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(req: NextRequest) {
  try {
    const { planId, successUrl, cancelUrl } = await req.json()

    // Find the selected plan
    const plan = subscriptionPlans.find((p) => p.id === planId)
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 })
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${plan.name} Plan`,
              description: `${plan.downloads} downloads, valid for ${planId === "enterprise" ? "1 year" : "30 days"}`,
            },
            unit_amount: Math.round(plan.price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        planId: plan.id,
        downloads: plan.downloads.toString(),
        expiresInDays: planId === "enterprise" ? "365" : "30",
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}

