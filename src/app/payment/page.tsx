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

  const handleSignOut = () => {
    signOut();
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
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <User className="w-6 h-6 text-slate-600 dark:text-slate-300" />
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-sm font-medium mb-6">
              ✅ Real Stripe Integration - Ready for Payments
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300">
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
                className="mb-8"
              >
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center">
                          <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                          Current Plan
                        </CardTitle>
                        <CardDescription>
                          Your active subscription details
                        </CardDescription>
                      </div>
                      {userPlan.currentPlan.status === "active" && (
                        <button
                          onClick={handleCancelSubscription}
                          disabled={isCancelling}
                          className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                          {userPlan.currentPlan.planName}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-300">
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
                      <div className="text-right">
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
                          <p className="text-sm text-blue-600 mt-2">
                            Credits: ${(userPlan.credits / 100).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Select Plan
                  </CardTitle>
                  <CardDescription>
                    Choose the plan that best fits your business needs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
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
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">
                                {product.name}
                              </CardTitle>
                              <CardDescription>
                                {product.description}
                              </CardDescription>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                ${product.price}
                              </div>
                              <div className="text-sm text-slate-600 dark:text-slate-300">
                                per month
                              </div>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            {product.features.map((feature, index) => (
                              <li
                                key={index}
                                className="flex items-center text-sm"
                              >
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                {feature}
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
            >
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Details
                  </CardTitle>
                  <CardDescription>
                    Complete your purchase securely with Stripe
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                      Order Summary
                    </h3>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-300">
                        {selectedProduct.name}
                      </span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        ${(selectedProduct.price / 100).toFixed(2)}/month
                      </span>
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-600 mt-2 pt-2">
                      <div className="flex justify-between items-center font-semibold">
                        <span className="text-slate-900 dark:text-white">
                          Total
                        </span>
                        <span className="text-slate-900 dark:text-white">
                          ${(selectedProduct.price / 100).toFixed(2)}/month
                        </span>
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
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6"
                    >
                      {isProcessing ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        `Pay $${(selectedProduct.price / 100).toFixed(2)}/month`
                      )}
                    </Button>
                  )}

                  <div className="text-center">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
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
