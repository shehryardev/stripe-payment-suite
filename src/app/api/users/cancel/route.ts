import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { clerkId } = body;

    if (!clerkId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Find the user
    const user = await User.findOne({ clerkId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update the current plan status to cancelled
    if (user.currentPlan) {
      user.currentPlan.status = "cancelled";
      await user.save();
    }

    return NextResponse.json({
      success: true,
      message: "Subscription cancelled successfully",
      user: {
        clerkId: user.clerkId,
        currentPlan: user.currentPlan,
      },
    });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
