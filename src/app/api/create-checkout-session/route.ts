import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      priceId,
      quantity = 1,
      customerEmail,
      metadata,
      amount,
      currency = "usd",
    } = body;

    // Handle both priceId (from existing payment page) and direct amount
    let finalAmount = amount;

    if (priceId && !amount) {
      // If priceId is provided, we need to get the price from Stripe
      const price = await stripe.prices.retrieve(priceId);
      finalAmount = price.unit_amount || 0;
    }

    if (!finalAmount || finalAmount <= 0) {
      return NextResponse.json(
        { error: "Amount is required and must be greater than 0" },
        { status: 400 }
      );
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount * quantity,
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        ...metadata,
        priceId: priceId || "",
        quantity: quantity.toString(),
        customerEmail: customerEmail || "",
      },
    });

    return NextResponse.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    );
  }
}
