import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import products from "@/config/stripe-products.json";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { clerkId, paymentIntentId, planId, amount } = body;

    if (!clerkId || !paymentIntentId || !planId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const plan = products.find((p) => p.id === planId);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Check if user exists
    let user = await User.findOne({ clerkId });

    if (!user) {
      // Create new user
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      user = new User({
        clerkId,
        email: "", // Will be updated from Clerk
        currentPlan: {
          planId: plan.id,
          planName: plan.name,
          price: plan.price,
          startDate,
          endDate,
          status: "active",
        },
        credits: 0,
        paymentHistory: [],
      });
    }

    // Add payment to history
    user.paymentHistory.push({
      paymentIntentId,
      amount,
      planId: plan.id,
      planName: plan.name,
      date: new Date(),
      type: user.paymentHistory.length === 0 ? "initial" : "renewal",
    });

    // If this is a new user or plan change, update current plan
    if (
      user.paymentHistory.length === 1 ||
      user.currentPlan.planId !== plan.id
    ) {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      user.currentPlan = {
        planId: plan.id,
        planName: plan.name,
        price: plan.price,
        startDate,
        endDate,
        status: "active",
      };
    }

    await user.save();

    return NextResponse.json({
      success: true,
      user,
      message: "Payment recorded successfully",
    });
  } catch (error) {
    console.error("Error recording payment:", error);
    return NextResponse.json(
      { error: "Failed to record payment" },
      { status: 500 }
    );
  }
}
