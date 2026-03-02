import { type Metadata } from "next";
import PageNavbar from "~/components/PageNavbar";
import PricingPageClient from "~/components/PricingPageClient";
import { SiteFooter } from "~/components/SiteFooter";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "~/server/db";

export const metadata: Metadata = {
  title: "Student Pricing - Free AI Humanizer Plans | Bypass Turnitin & AI Detectors | HumanifyLab",
  description: "Affordable AI humanizer pricing for students. Bypass Turnitin, GPTZero, Originality.AI, ZeroGPT & all AI detectors. 99.9% success rate. Free plan available. Perfect for essays & assignments. Join 450,000+ students.",
  keywords: [
    // Student Pricing Keywords (HIGH PRIORITY)
    "free ai humanizer for students",
    "student ai humanizer pricing",
    "cheap ai humanizer for students",
    "affordable essay humanizer",
    "free essay humanizer",
    "student discount ai humanizer",
    "college student ai humanizer",
    
    // Pricing Keywords
    "ai humanizer pricing",
    "undetectable ai pricing",
    "ai detector bypass pricing",
    "humanizer plans",
    "free ai humanizer",
    "affordable ai humanizer",
    
    // AI Detector Bypass
    "bypass originality ai pricing",
    "bypass gptzero cost",
    "bypass turnitin pricing",
    "undetectable ai cost",
    "ai detection bypass plans",
    
    // Core Features
    "AI text humanizer cost",
    "humanize AI text pricing",
    "writing enhancement pricing",
    "text humanization plans",
    "undetectable ai humanizer plans",
    
    // Value Propositions
    "best ai humanizer pricing",
    "cheap ai humanizer",
    "ai humanizer free trial",
    "pay as you go ai humanizer"
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.humanifylab.com/pricing",
  },
  openGraph: {
    title: "Pricing - Undetectable AI Humanizer | Bypass All AI Detectors",
    description: "Affordable undetectable AI humanizer. Bypass Originality.AI, GPTZero, Turnitin, ZeroGPT. 99.9% success rate. Flexible plans starting free.",
    url: "https://www.humanifylab.com/pricing",
    siteName: "HumanifyLab",
    images: [
      {
        url: "/forOpengraph.png",
        width: 1200,
        height: 630,
        alt: "HumanifyLab Pricing - Undetectable AI Humanizer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing - Undetectable AI Humanizer | Bypass All AI Detectors",
    description: "Affordable undetectable AI humanizer. Bypass Originality.AI, GPTZero, Turnitin. 99.9% success rate. Start free.",
    images: ["/forOpengraph.png"],
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
      <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        Choose Your Perfect Plan
      </h1>
      <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
        Transform AI-generated content into natural, human-like writing. All plans include our advanced humanization features.
      </p>

    </div>
    <PricingPageClient isTeamMember={isTeamMember} hasSubscription={hasSubscription} />

    <SiteFooter />
  </>
  );

}

