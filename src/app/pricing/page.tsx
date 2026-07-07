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
    canonical: "https://www.humanifylab.com/pricing",
  },
  openGraph: {
    title: "Pricing — AI Humanizer Plans, Free Plan Included | HumanifyLab",
    description: "Start free with monthly word credits, or upgrade for higher limits, faster processing and API access. Plans for students, professionals and teams.",
    url: "https://www.humanifylab.com/pricing",
    siteName: "HumanifyLab",
    images: [
      {
        url: "/forOpenGraph.png",
        width: 1200,
        height: 630,
        alt: "HumanifyLab Pricing — AI Humanizer Plans",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing — AI Humanizer Plans, Free Plan Included | HumanifyLab",
    description: "Start free with monthly word credits, or upgrade for higher limits, faster processing and API access.",
    images: ["/forOpenGraph.png"],
    site: "@humanifylab",
    creator: "@humanifylab",
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

  return (<>
    <PageNavbar />
    <div className="mb-12 text-center pt-4">
      <h1 className="mb-4 text-[1.6rem] sm:text-[2rem] font-bold tracking-tight text-gray-950">
        Choose Your Perfect Plan
      </h1>
      <p className="mx-auto max-w-2xl text-[14px] text-gray-400">
        Transform AI-generated content into natural, human-like writing. All plans include our advanced humanization features.
      </p>

    </div>
    <PricingPageClient isTeamMember={isTeamMember} hasSubscription={hasSubscription} />

    <SiteFooter />
  </>
  );

}

