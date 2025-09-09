import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentIntentId = searchParams.get("payment_intent_id");

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Payment intent ID is required" },
        { status: 400 }
      );
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return NextResponse.json({
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      created: new Date(paymentIntent.created * 1000).toISOString(),
      metadata: paymentIntent.metadata,
    });
  } catch (error) {
    console.error("Error fetching payment details:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment details" },
      { status: 500 }
    );
  }
}
