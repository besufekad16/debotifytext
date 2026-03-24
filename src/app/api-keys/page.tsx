import { type Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import PageNavbar from "~/components/PageNavbar";
import { SiteFooter } from "~/components/SiteFooter";
import ApiKeysClient from "~/components/ApiKeysClient";

export const metadata: Metadata = {
  title: "API Keys - HumanifyLab | AI Humanizer API",
  description: "Manage your API keys for HumanifyLab integration. ULTRA plan users get API access to integrate AI humanizer into their systems.",
  keywords: [
    "ai humanizer api",
    "humanizer api key",
    "API integration",
    "developer api",
    "AI text humanizer API"
  ],
  robots: {
    index: false,
    follow: true,
  },
};

export default async function ApiKeysPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in?redirect_url=/api-keys");
  }

  // Get user's subscription info
  let userInfo = null;
  try {
    userInfo = await db.user.findUnique({
      where: { clerkId: user.id },
      select: {
        subscriptionPlan: true,
        credits: true,
      }
    });
  } catch (error) {
    console.error("Error fetching user info:", error);
  }

  // Check if user has ULTRA plan (adjust this logic based on your plan naming)
  const hasApiAccess = !!(userInfo?.subscriptionPlan?.toLowerCase().includes("large") ||
    userInfo?.subscriptionPlan?.toLowerCase().includes("ultra"));

  return (
    <div className="min-h-screen bg-white">
      <PageNavbar currentCredits={userInfo?.credits} />
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <ApiKeysClient hasApiAccess={hasApiAccess} />
      </main>
      <SiteFooter />
    </div>
  );
}
