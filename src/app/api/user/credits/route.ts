import { type NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { addCorsHeaders, handleCorsPreflight } from "~/lib/cors";
import { refreshMonthlyCreditsIfNeeded } from "~/server/utils/credit-reset";

export async function GET(request: NextRequest) {
  const corsResponse = handleCorsPreflight(request);
  if (corsResponse) return corsResponse;

  try {
    console.log("🔍 [API] Starting credits fetch at", new Date().toISOString());
    const startTime = Date.now();

    const { userId } = await auth();

    if (!userId) {
      console.log("❌ [API] No session found for credits");
      const response = NextResponse.json({ credits: 0 }, { status: 401 });
      return addCorsHeaders(response, request);
    }

    let user = await db.user.findFirst({
      where: { clerkId: userId },
      select: { 
        id: true,
        email: true,
        credits: true, 
        extraCredits: true,
        subscriptionPlan: true,
        subscriptionType: true,
        nextResetDate: true,
        team: {
          select: {
            owner: {
              select: {
                id: true,
                credits: true,
                extraCredits: true,
                subscriptionPlan: true,
                subscriptionType: true,
                nextResetDate: true
              }
            }
          }
        }
      },
    });

    // Fallback: If user not found in DB (webhook delay), try to sync from Clerk
    if (!user) {
      console.log("⚠️ [API] User not found in DB, attempting to sync from Clerk...");
      try {
        const clerkUser = await currentUser();
        if (clerkUser) {
          const email = clerkUser.emailAddresses[0]?.emailAddress || "";
          const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || clerkUser.username || "User";
          
          // Create user with default credits (300)
          const newUser = await db.user.create({
            data: {
              clerkId: userId,
              email,
              name,
              image: clerkUser.imageUrl,
              emailVerified: clerkUser.emailAddresses[0]?.verification?.status === 'verified',
              // credits will default to 300 from schema
            }
          });

          console.log(`✅ [API] Created missing user ${userId} on the fly`);
          
          // Use the new user data
          user = {
            id: newUser.id,
            email: newUser.email,
            credits: newUser.credits,
            extraCredits: newUser.extraCredits,
            subscriptionPlan: newUser.subscriptionPlan,
            subscriptionType: newUser.subscriptionType,
            nextResetDate: newUser.nextResetDate,
            team: null
          };
        }
      } catch (syncError) {
        console.error("❌ [API] Failed to sync user from Clerk:", syncError);
      }
    }

    if (!user) {
      const response = NextResponse.json({ credits: 0, extraCredits: 0, subscriptionPlan: null }, { status: 404 });
      return addCorsHeaders(response, request);
    }

    // If user is in a team, use the owner's billing balance.
    const billingUser = user.team?.owner ? user.team.owner : user;
    const { user: refreshedBillingUser, resetApplied } =
      await refreshMonthlyCreditsIfNeeded(billingUser);

    if (resetApplied) {
      console.log(`🔄 [API] Refreshed monthly credits for billing user ${refreshedBillingUser.id}`);
    }

    const effectiveCredits = refreshedBillingUser.credits;
    const effectiveExtraCredits = refreshedBillingUser.extraCredits;
    const effectivePlan = refreshedBillingUser.subscriptionPlan;
    const isTeamMember = !!user.team?.owner;

    const endTime = Date.now();
    console.log(`✅ [API] Credits fetched in ${endTime - startTime}ms:`, effectiveCredits + effectiveExtraCredits);

    const response = NextResponse.json(
      { 
        email: user.email,
        credits: effectiveCredits, 
        extraCredits: effectiveExtraCredits,
        subscriptionPlan: effectivePlan,
        subscriptionType: refreshedBillingUser.subscriptionType,
        nextResetDate: refreshedBillingUser.nextResetDate,
        isTeamMember
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
    return addCorsHeaders(response, request);
  } catch (error) {
    console.error("❌ [API] Error fetching credits:", error);
    const response = NextResponse.json(
      { credits: 0, extraCredits: 0 },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
    return addCorsHeaders(response, request);
  }
}

export async function OPTIONS(request: NextRequest) {
  return handleCorsPreflight(request) || new NextResponse(null, { status: 200 });
}
