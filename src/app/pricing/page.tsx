import { type Metadata } from "next";
import PageNavbar from "~/components/PageNavbar";
import PricingPageClient from "~/components/PricingPageClient";
import { SiteFooter } from "~/components/SiteFooter";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "~/server/db";

export const metadata: Metadata = {
  title: "Pricing — AI Humanizer Plans, Free Plan Included",
  description: "Simple, transparent AI humanizer pricing. Start free with monthly word credits, or upgrade for higher limits, faster processing and API access. Plans for students, professionals and teams.",
  keywords: [
    "ai humanizer pricing",
    "free ai humanizer",
    "ai humanizer plans",
    "ai humanizer cost",
    "humanize ai text pricing",
    "cheap ai humanizer",
    "ai humanizer free trial",
    "ai humanizer subscription",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.debotifytext.com/pricing",
  },
  openGraph: {
    title: "Pricing — AI Humanizer Plans, Free Plan Included | DebotifyText",
    description: "Start free with monthly word credits, or upgrade for higher limits, faster processing and API access. Plans for students, professionals and teams.",
    url: "https://www.debotifytext.com/pricing",
    siteName: "DebotifyText",
    images: [
      {
        url: "/forOpenGraph.png",
        width: 1200,
        height: 630,
        alt: "DebotifyText Pricing — AI Humanizer Plans",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — AI Humanizer Plans, Free Plan Included | DebotifyText",
    description: "Start free with monthly word credits, or upgrade for higher limits, faster processing and API access.",
    images: ["/forOpenGraph.png"],
    site: "@debotifytext",
    creator: "@debotifytext",
  },
};

export default async function PricingPage() {
  const user = await currentUser();
  let isTeamMember = false;
  let hasSubscription = false;

  if (user) {
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
      console.log("⚠️ [Pricing Page] User not found in DB, creating on the fly...");
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

      // Refetch with relations
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

    if (dbUser) {
      // Check if user is in a team and NOT the owner
      if (dbUser.team?.owner && dbUser.team.ownerId !== dbUser.id) {
        isTeamMember = true;
      }

      // Check if user has an active subscription
      if (dbUser.subscriptionPlan) {
        hasSubscription = true;
      }
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <PageNavbar />
      <main className="flex-1">
        <div className="relative pt-24 pb-16 bg-gradient-to-b from-green-50/50 to-white text-center">
          <div className="mx-auto max-w-3xl px-5 sm:px-6 relative z-10">
            <span className="inline-block py-1 px-3 rounded-full bg-green-100/50 border border-green-200/50 text-[11px] font-bold tracking-widest text-green-700 uppercase mb-6">
              Pricing
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Simple, transparent pricing
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-slate-500 font-medium">
              Transform AI-generated content into natural, human-like writing. Every plan includes our full humanization
              engine — upgrade or cancel anytime.
            </p>
          </div>
        </div>
        <PricingPageClient isTeamMember={isTeamMember} hasSubscription={hasSubscription} />
      </main>
      <SiteFooter />
    </div>
  );
}

