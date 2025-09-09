import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  clerkId: string;
  email: string;
  currentPlan: {
    planId?: string;
    planName?: string;
    price?: number;
    startDate?: Date;
    endDate?: Date;
    status?: "active" | "cancelled" | "expired";
  };
  paymentHistory: Array<{
    paymentIntentId: string;
    amount: number;
    planId: string;
    planName: string;
    date: Date;
    type: "initial" | "upgrade" | "downgrade" | "renewal";
    proratedAmount?: number;
    creditApplied?: number;
  }>;
  credits: number; // Remaining credits from previous plans
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  currentPlan: {
    planId: { type: String, required: false },
    planName: { type: String, required: false },
    price: { type: Number, required: false },
    startDate: { type: Date, required: false },
    endDate: { type: Date, required: false },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "expired",
    },
  },
  paymentHistory: [
    {
      paymentIntentId: { type: String, required: true },
      amount: { type: Number, required: true },
      planId: { type: String, required: true },
      planName: { type: String, required: true },
      date: { type: Date, default: Date.now },
      type: {
        type: String,
        enum: ["initial", "upgrade", "downgrade", "renewal"],
        required: true,
      },
      proratedAmount: { type: Number },
      creditApplied: { type: Number },
    },
  ],
  credits: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

UserSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Clear any existing model to avoid conflicts
if (mongoose.models.User) {
  delete mongoose.models.User;
}

export default mongoose.model<IUser>("User", UserSchema);
