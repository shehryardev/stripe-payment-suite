"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface PaymentFormProps {
  clientSecret: string;
  amount: number;
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
}

function CheckoutForm({
  clientSecret,
  amount,
  onSuccess,
  onError,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    // Submit the elements first
    const { error: submitError } = await elements.submit();

    if (submitError) {
      setError(submitError.message || "An error occurred");
      onError(submitError.message || "An error occurred");
      toast.error(submitError.message || "An error occurred");
      setLoading(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success`,
      },
      redirect: "if_required",
    });

    if (error) {
      const errorMessage = error.message || "An error occurred";
      setError(errorMessage);
      onError(errorMessage);
      toast.error(errorMessage);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent);
      toast.success("Payment successful!");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={!stripe || loading}>
        {loading ? "Processing..." : `Pay $${(amount / 100).toFixed(2)}`}
      </Button>
    </form>
  );
}

export function PaymentForm({
  clientSecret,
  amount,
  onSuccess,
  onError,
}: PaymentFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Complete Payment</CardTitle>
        <CardDescription>
          Enter your card details to complete the payment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm
            clientSecret={clientSecret}
            amount={amount}
            onSuccess={onSuccess}
            onError={onError}
          />
        </Elements>
      </CardContent>
    </Card>
  );
}
