import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    console.log("Starting user sync...");
    await connectDB();
    console.log("Connected to MongoDB");

    const body = await request.json();
    const { clerkId, email } = body;

    if (!clerkId || !email) {
      console.log("Missing required fields:", {
        clerkId: !!clerkId,
        email: !!email,
      });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log("Syncing user:", { clerkId, email });

    // Check if user already exists
    let user = await User.findOne({ clerkId });

    if (!user) {
      console.log("Creating new user");
      // Create new user without a plan initially
      user = new User({
        clerkId,
        email,
        currentPlan: {
          status: "expired",
        },
        credits: 0,
        paymentHistory: [],
      });

      await user.save();
      console.log("User created successfully");
    } else {
      console.log("Updating existing user");
      // Update email if changed
      user.email = email;
      await user.save();
      console.log("User updated successfully");
    }

    return NextResponse.json({
      success: true,
      user,
      message: "User synced successfully",
    });
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json(
      {
        error: "Failed to sync user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
