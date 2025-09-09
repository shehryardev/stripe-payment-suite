import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import products from "@/config/stripe-products.json";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { clerkId, newPlanId, paymentIntentId } = body;

    if (!clerkId || !newPlanId || !paymentIntentId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newPlan = products.find((p) => p.id === newPlanId);
    if (!newPlan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const currentDate = new Date();
    const currentPlanEndDate = new Date(user.currentPlan.endDate || new Date());
    const daysRemaining = Math.ceil(
      (currentPlanEndDate.getTime() - currentDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    // Calculate prorated amount for current plan
    const currentPlanDailyRate = (user.currentPlan.price || 0) / 30; // Assuming 30 days per month
    const currentPlanRemainingValue = currentPlanDailyRate * daysRemaining;

    // Calculate new plan daily rate
    const newPlanDailyRate = newPlan.price / 30;
    const newPlanRemainingValue = newPlanDailyRate * daysRemaining;

    // Calculate the difference (what user needs to pay)
    const upgradeAmount = Math.max(
      0,
      newPlanRemainingValue - currentPlanRemainingValue
    );

    // Add any existing credits
    const totalCredits = user.credits + currentPlanRemainingValue;
    const finalAmount = Math.max(0, upgradeAmount - user.credits);

    // Update user's plan
    user.currentPlan = {
      planId: newPlan.id,
      planName: newPlan.name,
      price: newPlan.price,
      startDate: currentDate,
      endDate: currentPlanEndDate, // Keep same end date
      status: "active",
    };

    // Add payment to history
    user.paymentHistory.push({
      paymentIntentId,
      amount: finalAmount,
      planId: newPlan.id,
      planName: newPlan.name,
      date: currentDate,
      type: "upgrade",
      proratedAmount: upgradeAmount,
      creditApplied: Math.min(user.credits, upgradeAmount),
    });

    // Update credits (remaining from previous plan)
    user.credits = Math.max(0, totalCredits - upgradeAmount);

    await user.save();

    return NextResponse.json({
      success: true,
      user,
      upgradeDetails: {
        currentPlanRemainingValue,
        newPlanRemainingValue,
        upgradeAmount,
        creditsApplied: Math.min(user.credits, upgradeAmount),
        finalAmount,
        remainingCredits: user.credits,
      },
    });
  } catch (error) {
    console.error("Error upgrading user plan:", error);
    return NextResponse.json(
      { error: "Failed to upgrade plan" },
      { status: 500 }
    );
  }
}
