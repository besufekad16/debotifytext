"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Package, Calendar, CreditCard, ExternalLink, Loader2 } from "lucide-react";
import { Separator } from "~/components/ui/separator";
import Link from "next/link";
import { toast } from "sonner";

interface SubscriptionDetails {
  subscriptionPlan?: string | null;
  subscriptionType?: string | null;
  nextResetDate?: string | null;
  productId?: string | null;
  billingCycle?: string;
  status?: string | null;
  cancelAtPeriodEnd?: boolean;
  currentPeriodEnd?: string | null;
  isTeamMember?: boolean;
}

interface SubscriptionManagementProps {
  subscriptionPlan?: string | null;
  subscriptionType?: string | null;
  nextResetDate?: Date | null;
  productId?: string | null;
  isTeamMember?: boolean;
}

export default function SubscriptionManagement({
  subscriptionPlan: initialPlan,
  subscriptionType: initialType,
  nextResetDate: initialResetDate,
  productId: initialProductId,
  isTeamMember: initialIsTeamMember = false
}: SubscriptionManagementProps) {
  const [isCanceling, setIsCanceling] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [details, setDetails] = useState<SubscriptionDetails>({
    subscriptionPlan: initialPlan,
    subscriptionType: initialType,
    nextResetDate: initialResetDate?.toISOString() || null,
    productId: initialProductId,
    billingCycle: "N/A",
    isTeamMember: initialIsTeamMember,
  });

  useEffect(() => {
    // Fetch subscription details from Polar
    const fetchDetails = async () => {
      try {
        const response = await fetch("/api/subscription/details");
        if (response.ok) {
          const data = await response.json();
          setDetails(prev => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error("Failed to fetch subscription details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, []);

  const hasActiveSubscription = !!details.subscriptionPlan;
  const planName = details.subscriptionPlan ? formatPlanName(details.subscriptionPlan) : "Free";
  const billingCycle = details.billingCycle || "N/A";
  const nextResetDate = details.nextResetDate ? new Date(details.nextResetDate) : null;

  const handleCancelSubscription = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You'll retain access until the end of your current billing period.")) {
      return;
    }

    setIsCanceling(true);
    try {
      const response = await fetch("/api/subscription/cancel", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to cancel subscription");
      }

      toast.success(data.message || "Subscription canceled successfully");

      // Reload the page to reflect changes
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Cancellation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to cancel subscription");
    } finally {
      setIsCanceling(false);
    }
  };

  const handleLeaveTeam = async () => {
    if (!confirm("Are you sure you want to leave this team? You will lose access to shared credits.")) {
      return;
    }

    setIsCanceling(true);
    try {
      const response = await fetch("/api/team/leave", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to leave team");
      }

      toast.success("Left team successfully");

      // Reload the page to reflect changes
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Leave team error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to leave team");
    } finally {
      setIsCanceling(false);
    }
  };

  return (
    <Card className="border-white/60 bg-white/80 shadow-md backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-[#8B6F47]" />
          Subscription
        </CardTitle>
        <CardDescription className="text-[12px] text-gray-400">Manage your subscription and billing</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-[#8B6F47]" />
          </div>
        ) : hasActiveSubscription ? (
          <>
            <div>
              <label className="text-[12px] font-medium text-gray-400">Current Plan</label>
              <p className="mt-1 text-[1.4rem] font-bold text-[#8B6F47]">{planName}</p>
              {details.cancelAtPeriodEnd && (
                <p className="mt-1 text-[12px] text-amber-600">
                  Cancels at period end
                </p>
              )}
            </div>
            <Separator />
            <div>
              <label className="flex items-center gap-2 text-[12px] font-medium text-gray-400">
                <CreditCard className="h-4 w-4" />
                Billing Cycle
              </label>
              <p className="mt-1 text-[13.5px] font-semibold text-gray-900">{billingCycle}</p>
            </div>
            {nextResetDate && (
              <>
                <Separator />
                <div>
                  <label className="flex items-center gap-2 text-[12px] font-medium text-gray-400">
                    <Calendar className="h-4 w-4" />
                    Next Renewal
                  </label>
                  <p className="mt-1 text-[13.5px] font-semibold text-gray-900">
                    {new Date(nextResetDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                </div>
              </>
            )}
            <Separator />
            <div className="space-y-2">
              <Link href="/pricing">
                <Button variant="outline" className="w-full" disabled={details.isTeamMember}>
                  {details.isTeamMember ? "Managed by Team Owner" : "Change Plan"}
                </Button>
              </Link>
              {details.isTeamMember ? (
                <Button
                  variant="outline"
                  className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={handleLeaveTeam}
                  disabled={isCanceling}
                >
                  Leave Team
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
                  onClick={handleCancelSubscription}
                  disabled={isCanceling || details.cancelAtPeriodEnd}
                >
                  {details.cancelAtPeriodEnd ? "Cancellation Scheduled" : "Cancel Subscription"}
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="text-[12px] font-medium text-gray-400">Current Plan</label>
              <p className="mt-1 text-[1.4rem] font-bold text-gray-400">Free</p>
              <p className="mt-1 text-[13px] text-gray-400">
                Upgrade to unlock more credits and premium features
              </p>
            </div>
            <Separator />
            <div className="rounded-lg bg-gradient-to-r from-[#e0f2fe] to-[#bae6fd] p-4">
              <p className="text-[13px] font-medium text-gray-900">Ready to upgrade?</p>
              <p className="mt-1 text-[13px] text-gray-400">
                Get more credits, priority support, and API access with our premium plans.
              </p>
              <Link href="/pricing">
                <Button className="mt-3 w-full bg-[#8B6F47] hover:bg-[#6D5635]">
                  View Premium Plans
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function formatPlanName(plan: string): string {
  // Format plan names nicely
  if (plan.toLowerCase().includes("small")) return "Starter Plan";
  if (plan.toLowerCase().includes("medium")) return "Professional Plan";
  if (plan.toLowerCase().includes("large") || plan.toLowerCase().includes("ultra")) return "ULTRA Plan";
  return plan;
}

