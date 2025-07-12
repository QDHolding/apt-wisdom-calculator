import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { SubscriptionService } from "@/services/subscription-service"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

// This is your Stripe webhook secret for testing your endpoint locally
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  const payload = await req.text()
  const sig = req.headers.get("stripe-signature") as string

  let event

  try {
    event = stripe.webhooks.constructEvent(payload, sig, endpointSecret!)
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    // Fulfill the purchase
    try {
      await fulfillOrder(session)
    } catch (error) {
      console.error("Error fulfilling order:", error)
      return NextResponse.json({ error: "Error fulfilling order" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}

async function fulfillOrder(session: Stripe.Checkout.Session) {
  // Extract plan details from session metadata
  const planId = session.metadata?.planId
  const downloads = Number.parseInt(session.metadata?.downloads || "0")
  const expiresInDays = Number.parseInt(session.metadata?.expiresInDays || "30")

  if (!planId || !downloads) {
    throw new Error("Missing plan information in session metadata")
  }

  // Create a subscription for the user
  // In a real application, you would associate this with the user's account
  // For now, we'll use our mock implementation
  await SubscriptionService.activateSubscription(planId, downloads, expiresInDays)
}

