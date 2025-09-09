"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreditCard,
  DollarSign,
  CheckCircle,
  LogOut,
  User,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useClerk } from "@clerk/nextjs";
import products from "@/config/stripe-products.json";
import { PaymentForm } from "@/components/PaymentForm";

export default function PaymentPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "checkout">(
    "checkout"
  );
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [userPlan, setUserPlan] = useState<any>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Fetch user's current plan
  useEffect(() => {
    if (user?.id) {
      fetchUserPlan();
    }
  }, [user?.id]);

  const fetchUserPlan = async () => {
    try {
      const response = await fetch(`/api/users?clerkId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setUserPlan(data);
      }
    } catch (error) {
      console.error("Error fetching user plan:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut({ redirectUrl: "/" });
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  const handleCancelSubscription = async () => {
    if (!user?.id) {
      toast.error("Please sign in to cancel subscription");
      return;
    }

    if (
      !confirm(
        "Are you sure you want to cancel your subscription? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsCancelling(true);
    try {
      const response = await fetch("/api/users/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkId: user.id,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Subscription cancelled successfully");
        // Refresh user plan to show updated status
        await fetchUserPlan();
      } else {
        toast.error(result.error || "Failed to cancel subscription");
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast.error("Failed to cancel subscription");
    } finally {
      setIsCancelling(false);
    }
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error("Please sign in to make a payment");
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === "checkout") {
        // Create real Stripe Checkout session
        const response = await fetch("/api/create-checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            priceId: selectedProduct.priceId,
            quantity: 1,
            customerEmail: user.primaryEmailAddress?.emailAddress,
            metadata: {
              userId: user.id,
              productId: selectedProduct.id,
            },
          }),
        });

        const { client_secret, payment_intent_id, error } =
          await response.json();

        if (error) {
          toast.error(`Error: ${error}`);
          return;
        }

        if (client_secret) {
          setClientSecret(client_secret);
          setShowPaymentForm(true);
          toast.success(
            "Payment intent created! Please enter your card details."
          );
        } else {
          toast.error("Failed to create payment intent");
        }
      } else {
        // Handle card payment with Payment Intent
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: selectedProduct.price, // Already in cents
            currency: "usd",
            metadata: {
              userId: user.id,
              productId: selectedProduct.id,
              productName: selectedProduct.name,
            },
          }),
        });

        const { clientSecret, error } = await response.json();

        if (error) {
          toast.error(`Error: ${error}`);
          return;
        }

        // In a real implementation, you would use Stripe Elements here
        // For now, we'll show a success message and redirect
        toast.success("Payment intent created successfully!");
        toast.info(
          "In a full implementation, you would integrate Stripe Elements for card input"
        );

        // Simulate successful payment for demo
        setTimeout(() => {
          window.location.href = "/payment/success?session_id=pi_demo_session";
        }, 2000);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent: any) => {
    try {
      // Record payment in MongoDB
      await fetch("/api/payment-success", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clerkId: user?.id,
          paymentIntentId: paymentIntent.id,
          planId: selectedProduct.id,
          amount: selectedProduct.price,
        }),
      });

      toast.success("Payment successful!");
      window.location.href = `/payment/success?session_id=${paymentIntent.id}`;
    } catch (error) {
      console.error("Error recording payment:", error);
      toast.error(
        "Payment successful but failed to record. Please contact support."
      );
    }
  };

  const handlePaymentError = (error: string) => {
    toast.error(`Payment failed: ${error}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <User className="w-6 h-6 text-slate-600 dark:text-slate-300 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900 dark:text-white truncate">
                  Welcome back, {user?.firstName} {user?.lastName}!
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 truncate">
                  Here's what's happening with your payments today.
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="flex items-center space-x-2 self-start sm:self-auto"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              ✅ Real Stripe Integration - Ready for Payments
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
              Choose Your Plan
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              Select the perfect plan for your needs and start processing
              payments today
            </p>
          </motion.div>

          {/* Current Plan Display */}
          {userPlan &&
            userPlan.currentPlan.planId &&
            userPlan.currentPlan.planName && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-6 sm:mb-8"
              >
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div>
                        <CardTitle className="flex items-center text-lg sm:text-xl">
                          <CheckCircle className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" />
                          Current Plan
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Your active subscription details
                        </CardDescription>
                      </div>
                      {userPlan.currentPlan.status === "active" && (
                        <button
                          onClick={handleCancelSubscription}
                          disabled={isCancelling}
                          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 hover:underline disabled:opacity-50 disabled:cursor-not-allowed self-start sm:self-auto"
                        >
                          {isCancelling ? (
                            <div className="flex items-center">
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-500 mr-2"></div>
                              Cancelling...
                            </div>
                          ) : (
                            "Cancel subscription"
                          )}
                        </button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <div className="space-y-1">
                        <h3 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
                          {userPlan.currentPlan.planName}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300 font-medium">
                          $
                          {((userPlan.currentPlan.price || 0) / 100).toFixed(2)}
                          /month
                        </p>
                        {userPlan.currentPlan.endDate && (
                          <p className="text-sm text-slate-500">
                            Next billing:{" "}
                            {new Date(
                              userPlan.currentPlan.endDate
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-2">
                        <Badge
                          variant="outline"
                          className={`${
                            userPlan.currentPlan.status === "active"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : userPlan.currentPlan.status === "cancelled"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : "bg-gray-50 text-gray-700 border-gray-200"
                          }`}
                        >
                          {userPlan.currentPlan.status || "expired"}
                        </Badge>
                        {userPlan.credits > 0 && (
                          <p className="text-sm text-blue-600 font-medium">
                            Credits: ${(userPlan.credits / 100).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Product Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="order-2 lg:order-1"
            >
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm h-fit">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <DollarSign className="w-5 h-5 mr-2 flex-shrink-0" />
                    Select Plan
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Choose the plan that best fits your business needs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  {products.map((product) => (
                    <motion.div
                      key={product.id}
                      whileHover={{ scale: 1.02 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <Card
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedProduct.id === product.id
                            ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
                            : "hover:shadow-md"
                        }`}
                        onClick={() => setSelectedProduct(product)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                            <div className="flex-1">
                              <CardTitle className="text-base sm:text-lg">
                                {product.name}
                              </CardTitle>
                              <CardDescription className="text-sm mt-1">
                                {product.description}
                              </CardDescription>
                            </div>
                            <div className="text-left sm:text-right">
                              <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                                ${(product.price / 100).toFixed(2)}
                              </div>
                              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                                per month
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <ul className="space-y-2">
                            {product.features.map((feature, index) => (
                              <li
                                key={index}
                                className="flex items-start text-xs sm:text-sm"
                              >
                                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                <span className="leading-tight">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="order-1 lg:order-2"
            >
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-24">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center text-lg sm:text-xl">
                    <CreditCard className="w-5 h-5 mr-2 flex-shrink-0" />
                    Payment Details
                  </CardTitle>
                  <CardDescription className="text-sm sm:text-base">
                    Complete your purchase securely with Stripe
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  {/* Payment Method Selection */}
                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <Select
                      value={paymentMethod}
                      onValueChange={(value: "card" | "checkout") =>
                        setPaymentMethod(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checkout">
                          Stripe Checkout (Recommended)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Selected Plan Summary */}
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 sm:p-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm sm:text-base">
                      Order Summary
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 dark:text-slate-300 text-sm">
                          {selectedProduct.name}
                        </span>
                        <span className="font-semibold text-slate-900 dark:text-white text-sm">
                          ${(selectedProduct.price / 100).toFixed(2)}/month
                        </span>
                      </div>
                      <div className="border-t border-slate-200 dark:border-slate-600 pt-2">
                        <div className="flex justify-between items-center font-semibold">
                          <span className="text-slate-900 dark:text-white text-sm sm:text-base">
                            Total
                          </span>
                          <span className="text-slate-900 dark:text-white text-base sm:text-lg">
                            ${(selectedProduct.price / 100).toFixed(2)}/month
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Button or Payment Form */}
                  {showPaymentForm && clientSecret ? (
                    <PaymentForm
                      clientSecret={clientSecret}
                      amount={selectedProduct.price}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  ) : (
                    <Button
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-base sm:text-lg py-4 sm:py-6 font-semibold"
                    >
                      {isProcessing ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        `Pay $${(selectedProduct.price / 100).toFixed(2)}/month`
                      )}
                    </Button>
                  )}

                  <div className="text-center">
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                      🔒 Secured by Stripe • Cancel anytime
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
