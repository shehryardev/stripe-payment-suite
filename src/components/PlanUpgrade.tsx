"use client";

import { useState, useEffect } from "react";
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
import { ArrowUp, CreditCard, Calendar } from "lucide-react";
import { toast } from "sonner";
import products from "@/config/stripe-products.json";

interface UserData {
  currentPlan: {
    planId: string;
    planName: string;
    price: number;
    startDate: string;
    endDate: string;
    status: string;
  };
  credits: number;
  paymentHistory: Array<{
    amount: number;
    planName: string;
    date: string;
    type: string;
  }>;
}

export function PlanUpgrade() {
  const { user } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchUserData();
    }
  }, [user?.id]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/users?clerkId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (newPlanId: string) => {
    if (!user?.id) return;

    setUpgrading(newPlanId);

    try {
      // First create payment intent for upgrade
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId: newPlanId,
          quantity: 1,
          customerEmail: user.primaryEmailAddress?.emailAddress,
          metadata: {
            userId: user.id,
            type: "upgrade",
            currentPlanId: userData?.currentPlan.planId,
          },
        }),
      });

      const { client_secret, payment_intent_id } = await response.json();

      if (client_secret) {
        // Process upgrade after payment
        const upgradeResponse = await fetch("/api/users/upgrade", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clerkId: user.id,
            newPlanId,
            paymentIntentId: payment_intent_id,
          }),
        });

        if (upgradeResponse.ok) {
          const upgradeData = await upgradeResponse.json();
          toast.success(
            `Upgraded to ${upgradeData.user.currentPlan.planName}!`
          );
          setUserData(upgradeData.user);
        }
      }
    } catch (error) {
      console.error("Error upgrading plan:", error);
      toast.error("Failed to upgrade plan");
    } finally {
      setUpgrading(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>No subscription found</div>;
  }

  const currentPlan = products.find(
    (p) => p.id === userData.currentPlan.planId
  );
  const availableUpgrades = products.filter(
    (p) => p.price > userData.currentPlan.price
  );

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="w-5 h-5 mr-2" />
            Current Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">
                {userData.currentPlan.planName}
              </h3>
              <p className="text-gray-600">
                ${(userData.currentPlan.price / 100).toFixed(2)}/month
              </p>
              <p className="text-sm text-gray-500">
                Next billing:{" "}
                {new Date(userData.currentPlan.endDate).toLocaleDateString()}
              </p>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              {userData.currentPlan.status}
            </Badge>
          </div>
          {userData.credits > 0 && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                Available credits: ${(userData.credits / 100).toFixed(2)}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Upgrades */}
      {availableUpgrades.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ArrowUp className="w-5 h-5 mr-2" />
              Available Upgrades
            </CardTitle>
            <CardDescription>
              Upgrade your plan anytime. Credits from your current plan will be
              applied.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableUpgrades.map((plan) => (
                <div
                  key={plan.id}
                  className="flex justify-between items-center p-4 border rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold">{plan.name}</h4>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                    <p className="text-lg font-bold">
                      ${(plan.price / 100).toFixed(2)}/month
                    </p>
                  </div>
                  <Button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={upgrading === plan.id}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    {upgrading === plan.id ? "Upgrading..." : "Upgrade"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
