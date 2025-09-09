"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      // Fetch actual payment details from Stripe
      const fetchPaymentDetails = async () => {
        try {
          const response = await fetch(
            `/api/payment-details?payment_intent_id=${sessionId}`
          );
          if (response.ok) {
            const details = await response.json();
            setPaymentDetails(details);
          } else {
            console.error("Failed to fetch payment details");
            // Fallback to basic details
            setPaymentDetails({
              id: sessionId,
              amount: 0,
              currency: "usd",
              status: "succeeded",
              created: new Date().toISOString(),
            });
          }
        } catch (error) {
          console.error("Error fetching payment details:", error);
          // Fallback to basic details
          setPaymentDetails({
            id: sessionId,
            amount: 0,
            currency: "usd",
            status: "succeeded",
            created: new Date().toISOString(),
          });
        }
      };

      fetchPaymentDetails();
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Payment Successful!
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
              Thank you for your purchase. Your payment has been processed
              successfully.
            </p>
          </motion.div>

          {/* Payment Details Card */}
          {paymentDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Details
                  </CardTitle>
                  <CardDescription>
                    Your payment has been confirmed
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Payment ID
                      </p>
                      <p className="font-mono text-sm text-slate-900 dark:text-white">
                        {paymentDetails.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Amount
                      </p>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        ${(paymentDetails.amount / 100).toFixed(2)}{" "}
                        {paymentDetails.currency.toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Status
                      </p>
                      <p className="font-semibold text-green-600 dark:text-green-400 capitalize">
                        {paymentDetails.status}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Date
                      </p>
                      <p className="text-slate-900 dark:text-white">
                        {new Date(paymentDetails.created).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
          >
            <Link href="/dashboard">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/payment">
              <Button variant="outline" className="w-full sm:w-auto">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Payment
              </Button>
            </Link>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-slate-600 dark:text-slate-300">
              A confirmation email has been sent to your registered email
              address.
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
              If you have any questions, please contact our support team.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
