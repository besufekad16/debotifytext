import { type Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "~/server/db";
import PageNavbar from "~/components/PageNavbar";
import { SiteFooter } from "~/components/SiteFooter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { CreditCard, Mail, User, Calendar, Key, Users } from "lucide-react";
import SubscriptionManagement from "~/components/SubscriptionManagement";

export const metadata: Metadata = {
  title: "Account - HumanifyLab | Manage Your Free AI Humanizer",
  description: "Manage your HumanifyLab account and credits. Access your AI humanizer and track your usage for professional writing enhancement.",
  keywords: [
    "ai humanizer",
    "humanizer",
    "account",
    "user profile",
    "credits",
    "AI detection bypass",
    "humanize AI text",
    "AI text humanizer",
    "free AI humanizer"
  ],
  robots: {
    index: false, // Account pages typically shouldn't be indexed
    follow: true,
  },
};

export default async function AccountPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in?redirect_url=/account");
  }

  // Get user's information from database
  let userCredits = 0;
  let userExtraCredits = 0;
  let subscriptionPlan: string | null = null;
  let subscriptionType: string | null = null;
  let nextResetDate: Date | null = null;
  let productId: string | null = null;
  let hasApiAccess = false;
  let isTeamMember = false;

  try {
    let dbUser = await db.user.findUnique({
      where: { clerkId: user.id },
      include: {
        team: {
          include: {
            owner: true
          }
        }
      }
    });

    // Fallback: If user not found in DB (webhook delay), create on the fly
    if (!dbUser) {
      console.log("⚠️ [Account] User not found in DB, creating on the fly...");
      const email = user.emailAddresses[0]?.emailAddress || "";
      const name = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "User";

      const newUser = await db.user.create({
        data: {
          clerkId: user.id,
          email,
          name,
          image: user.imageUrl,
          emailVerified: user.emailAddresses[0]?.verification?.status === 'verified',
          // credits will default to 300 from schema
        }
      });

      // Refetch with relations to match the expected type
      dbUser = await db.user.findUnique({
        where: { id: newUser.id },
        include: {
          team: {
            include: {
              owner: true
            }
          }
        }
      });
    }

    // If user is part of a team, show owner's credits and plan
    const effectiveUser = dbUser?.team?.owner || dbUser;
    isTeamMember = !!dbUser?.team?.owner;

    userCredits = effectiveUser?.credits ?? 0;
    userExtraCredits = effectiveUser?.extraCredits ?? 0;
    subscriptionPlan = effectiveUser?.subscriptionPlan ?? null;
    subscriptionType = effectiveUser?.subscriptionType ?? null;
    nextResetDate = effectiveUser?.nextResetDate ?? null;
    productId = effectiveUser?.productId ?? null;
    hasApiAccess = subscriptionPlan?.toLowerCase().includes("large") || subscriptionPlan?.toLowerCase().includes("ultra") || false;
  } catch (error) {
    console.error("Error fetching user information:", error);
  }

  const userEmail = user.primaryEmailAddress?.emailAddress ?? "No email";
  const userName = user.firstName && user.lastName
    ? `${user.firstName} ${user.lastName}`
    : user.username ?? "User";
  const createdAt = user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }) : "Unknown";

  return (
    <div className="min-h-screen bg-white">
      <PageNavbar currentCredits={userCredits + userExtraCredits} isTeamMember={isTeamMember} />
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-[1.6rem] sm:text-[2rem] font-bold tracking-tight text-gray-950">
            Manage Your Account Settings
          </h1>
          <p className="mt-2 text-[14px] text-gray-400">
            Manage your HumanifyLab account and view your usage
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Subscription Management */}
          <SubscriptionManagement
            subscriptionPlan={subscriptionPlan}
            subscriptionType={subscriptionType}
            nextResetDate={nextResetDate}
            productId={productId}
            isTeamMember={isTeamMember}
          />

          {/* Profile Information */}
          <Card className="border-white/60 bg-white/80 shadow-md backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-[#8B6F47]" />
                Profile Information
              </CardTitle>
              <CardDescription className="text-[12px] text-gray-400">Your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-[12px] font-medium text-gray-400">Full Name</label>
                <p className="mt-1 text-[13.5px] font-semibold text-gray-900">{userName}</p>
              </div>
              <Separator />
              <div>
                <label className="flex items-center gap-2 text-[12px] font-medium text-gray-400">
                  <Mail className="h-4 w-4" />
                  Email Address
                </label>
                <p className="mt-1 text-[13.5px] font-semibold text-gray-900">{userEmail}</p>
              </div>
              <Separator />
              <div>
                <label className="flex items-center gap-2 text-[12px] font-medium text-gray-400">
                  <Calendar className="h-4 w-4" />
                  Member Since
                </label>
                <p className="mt-1 text-[13.5px] font-semibold text-gray-900">{createdAt}</p>
              </div>
            </CardContent>
          </Card>

          {/* Credits & Usage */}
          <Card className="border-white/60 bg-white/80 shadow-md backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#8B6F47]" />
                Credits & Usage
              </CardTitle>
              <CardDescription className="text-[12px] text-gray-400">Your current credit balance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-[12px] font-medium text-gray-400">Available Credits</label>
                <p className="mt-1.5 text-[1.8rem] font-bold text-[#8B6F47]">
                  {(userCredits + userExtraCredits).toLocaleString()}
                </p>
                <div className="mt-2 flex gap-4 text-[13px] text-gray-400">
                  <div>
                    <span className="font-medium text-foreground">Plan:</span> {userCredits.toLocaleString()}
                  </div>
                  {userExtraCredits > 0 && (
                    <div>
                      <span className="font-medium text-foreground">Top-up:</span> {userExtraCredits.toLocaleString()}
                    </div>
                  )}
                </div>
                <p className="mt-2 text-[13px] text-gray-400">
                  Credits are used to humanize your AI-generated text. Plan credits reset monthly, while top-up credits never expire.
                </p>
              </div>
              <Separator />
              <div className="rounded-lg bg-primary/10 p-4">
                <p className="text-[13px] font-medium text-gray-900">Need more credits?</p>
                <p className="mt-1 text-[13px] text-gray-400">
                  Visit our pricing page to purchase more credits and continue humanizing your content.
                </p>
                <Link
                  href="/pricing"
                  className="mt-3 inline-block bg-[#8B6F47] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#6D5635]"
                >
                  View Pricing Plans
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="mt-8">
          <Card className="border-white/60 bg-white/80 shadow-md backdrop-blur">
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription className="text-[12px] text-gray-400">Access important resources and support</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                <Link
                  href="/"
                  className="rounded-lg border border-border bg-card p-4 text-center transition hover:border-[#8B6F47] hover:shadow-md"
                >
                  <p className="text-[13.5px] font-semibold text-gray-900">Humanizer Tool</p>
                  <p className="mt-0.5 text-[11px] text-gray-400">Transform your text</p>
                </Link>
                <Link
                  href="/pricing"
                  className="rounded-lg border border-border bg-card p-4 text-center transition hover:border-[#8B6F47] hover:shadow-md"
                >
                  <p className="text-[13.5px] font-semibold text-gray-900">Pricing</p>
                  <p className="mt-0.5 text-[11px] text-gray-400">View credit packages</p>
                </Link>
                {(isTeamMember || hasApiAccess) && (
                  <Link
                    href="/team"
                    className="rounded-lg border border-border bg-card p-4 text-center transition hover:border-[#8B6F47] hover:shadow-md"
                  >
                    <div className="flex justify-center mb-1">
                      <Users className="h-5 w-5 text-[#8B6F47]" />
                    </div>
                    <p className="text-[13.5px] font-semibold text-gray-900">Team</p>
                    <p className="mt-0.5 text-[11px] text-gray-400">Manage team</p>
                  </Link>
                )}
                {hasApiAccess && (
                  <Link
                    href="/api-keys"
                    className="rounded-lg border border-border bg-card p-4 text-center transition hover:border-[#8B6F47] hover:shadow-md"
                  >
                    <div className="flex justify-center mb-1">
                      <Key className="h-5 w-5 text-[#8B6F47]" />
                    </div>
                    <p className="text-[13.5px] font-semibold text-gray-900">API Keys</p>
                    <p className="mt-0.5 text-[11px] text-gray-400">Manage integrations</p>
                  </Link>
                )}
                <Link
                  href="/faq"
                  className="rounded-lg border border-border bg-card p-4 text-center transition hover:border-[#8B6F47] hover:shadow-md"
                >
                  <p className="text-[13.5px] font-semibold text-gray-900">FAQ</p>
                  <p className="mt-0.5 text-[11px] text-gray-400">Common questions</p>
                </Link>
                <Link
                  href="/contact"
                  className="rounded-lg border border-border bg-card p-4 text-center transition hover:border-[#8B6F47] hover:shadow-md"
                >
                  <p className="text-[13.5px] font-semibold text-gray-900">Contact</p>
                  <p className="mt-0.5 text-[11px] text-gray-400">Get support</p>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

