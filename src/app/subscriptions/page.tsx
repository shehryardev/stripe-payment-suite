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
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  CreditCard,
  Calendar,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

interface Subscription {
  id: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  canceled_at: number | null;
  created: number;
  items: Array<{
    id: string;
    price: {
      id: string;
      amount: number;
      currency: string;
      interval: string;
      product: string;
    };
    quantity: number;
  }>;
}

export default function SubscriptionsPage() {
  const { user } = useUser();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState<string | null>(null);

  // Mock data for demonstration (replace with actual API call)
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSubscriptions([
        {
          id: "sub_1234567890",
          status: "active",
          current_period_start: Date.now() / 1000 - 86400 * 15, // 15 days ago
          current_period_end: Date.now() / 1000 + 86400 * 15, // 15 days from now
          cancel_at_period_end: false,
          canceled_at: null,
          created: Date.now() / 1000 - 86400 * 30, // 30 days ago
          items: [
            {
              id: "si_1234567890",
              price: {
                id: "price_pro_plan",
                amount: 9900, // $99.00
                currency: "usd",
                interval: "month",
                product: "prod_pro_plan",
              },
              quantity: 1,
            },
          ],
        },
        {
          id: "sub_0987654321",
          status: "canceled",
          current_period_start: Date.now() / 1000 - 86400 * 5,
          current_period_end: Date.now() / 1000 + 86400 * 25,
          cancel_at_period_end: true,
          canceled_at: Date.now() / 1000 - 86400 * 2,
          created: Date.now() / 1000 - 86400 * 60,
          items: [
            {
              id: "si_0987654321",
              price: {
                id: "price_enterprise_plan",
                amount: 29900, // $299.00
                currency: "usd",
                interval: "month",
                product: "prod_enterprise_plan",
              },
              quantity: 1,
            },
          ],
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusBadge = (subscription: Subscription) => {
    if (
      subscription.status === "active" &&
      !subscription.cancel_at_period_end
    ) {
      return <Badge className="bg-green-100 text-green-800">Active</Badge>;
    } else if (subscription.cancel_at_period_end) {
      return <Badge className="bg-yellow-100 text-yellow-800">Canceling</Badge>;
    } else if (subscription.status === "canceled") {
      return <Badge className="bg-red-100 text-red-800">Canceled</Badge>;
    }
    return (
      <Badge className="bg-gray-100 text-gray-800">{subscription.status}</Badge>
    );
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const handleCancelSubscription = async (
    subscriptionId: string,
    cancelAtPeriodEnd: boolean = true
  ) => {
    setCanceling(subscriptionId);

    try {
      const response = await fetch("/api/cancel-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionId,
          cancelAtPeriodEnd,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(
          cancelAtPeriodEnd
            ? "Subscription will be canceled at the end of the billing period"
            : "Subscription canceled immediately"
        );

        // Update local state
        setSubscriptions((prev) =>
          prev.map((sub) =>
            sub.id === subscriptionId
              ? {
                  ...sub,
                  cancel_at_period_end: cancelAtPeriodEnd,
                  status: cancelAtPeriodEnd ? "active" : "canceled",
                  canceled_at: cancelAtPeriodEnd ? null : Date.now() / 1000,
                }
              : sub
          )
        );
      } else {
        toast.error(result.error || "Failed to cancel subscription");
      }
    } catch (error) {
      console.error("Error canceling subscription:", error);
      toast.error("Failed to cancel subscription");
    } finally {
      setCanceling(null);
    }
  };

  const handleReactivateSubscription = async (subscriptionId: string) => {
    setCanceling(subscriptionId);

    try {
      const response = await fetch("/api/reactivate-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionId,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Subscription reactivated successfully");

        // Update local state
        setSubscriptions((prev) =>
          prev.map((sub) =>
            sub.id === subscriptionId
              ? {
                  ...sub,
                  cancel_at_period_end: false,
                  canceled_at: null,
                }
              : sub
          )
        );
      } else {
        toast.error(result.error || "Failed to reactivate subscription");
      }
    } catch (error) {
      console.error("Error reactivating subscription:", error);
      toast.error("Failed to reactivate subscription");
    } finally {
      setCanceling(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-300">
            Loading subscriptions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Subscription Management
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                Manage your active subscriptions and billing
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {subscriptions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm max-w-md mx-auto">
              <CardContent className="pt-6">
                <CreditCard className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  No Active Subscriptions
                </h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">
                  You don't have any active subscriptions yet.
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Browse Plans
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {subscriptions.map((subscription, index) => (
              <motion.div
                key={subscription.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5" />
                          Subscription #{subscription.id.slice(-8)}
                          {getStatusBadge(subscription)}
                        </CardTitle>
                        <CardDescription>
                          Created on {formatDate(subscription.created)}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Subscription Details */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          Plan Details
                        </h4>
                        {subscription.items.map((item) => (
                          <div
                            key={item.id}
                            className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-slate-900 dark:text-white">
                                {formatAmount(
                                  item.price.amount,
                                  item.price.currency
                                )}
                              </span>
                              <span className="text-sm text-slate-600 dark:text-slate-300">
                                per {item.price.interval}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Billing Information */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-slate-900 dark:text-white">
                          Billing Information
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-500" />
                            <span className="text-sm text-slate-600 dark:text-slate-300">
                              Current period:{" "}
                              {formatDate(subscription.current_period_start)} -{" "}
                              {formatDate(subscription.current_period_end)}
                            </span>
                          </div>
                          {subscription.cancel_at_period_end && (
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm text-yellow-600 dark:text-yellow-400">
                                Will cancel on{" "}
                                {formatDate(subscription.current_period_end)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                      {subscription.status === "active" &&
                        !subscription.cancel_at_period_end && (
                          <>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Cancel Subscription
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Cancel Subscription
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to cancel this
                                    subscription? You can choose to cancel at
                                    the end of the current billing period or
                                    immediately.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                                  <AlertDialogCancel>
                                    Keep Subscription
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleCancelSubscription(
                                        subscription.id,
                                        true
                                      )
                                    }
                                    className="bg-yellow-600 hover:bg-yellow-700"
                                  >
                                    Cancel at Period End
                                  </AlertDialogAction>
                                  <AlertDialogAction
                                    onClick={() =>
                                      handleCancelSubscription(
                                        subscription.id,
                                        false
                                      )
                                    }
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Cancel Immediately
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}

                      {subscription.cancel_at_period_end && (
                        <Button
                          onClick={() =>
                            handleReactivateSubscription(subscription.id)
                          }
                          disabled={canceling === subscription.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          {canceling === subscription.id
                            ? "Reactivating..."
                            : "Reactivate"}
                        </Button>
                      )}

                      <Button variant="outline">
                        <DollarSign className="w-4 h-4 mr-2" />
                        Update Payment Method
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
