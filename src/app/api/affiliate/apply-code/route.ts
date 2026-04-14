/**
 * POST /api/affiliate/apply-code
 * Stores a referral code on the authenticated user's record.
 * Called when a user enters a referral code after signing up.
 * Idempotent — can only be set once (ignored if already set).
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json() as { referralCode?: string };
  const code = body.referralCode?.trim().toLowerCase();

  if (!code || code.length < 3 || code.length > 32) {
    return NextResponse.json({ error: "Invalid referral code" }, { status: 400 });
  }

  // Validate the code exists
  const affiliate = await db.affiliate.findUnique({
    where: { referralCode: code },
    select: { id: true, clerkId: true, referralCode: true },
  });

  if (!affiliate) {
    return NextResponse.json({ error: "Referral code not found" }, { status: 404 });
  }

  // Block self-referral
  if (affiliate.clerkId === userId) {
    return NextResponse.json({ error: "You cannot use your own referral code" }, { status: 400 });
  }

  // Only set if not already set (first-come, first-served)
  const user = await db.user.findUnique({
    where: { clerkId: userId },
    select: { referredByCode: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.referredByCode) {
    return NextResponse.json({
      success: true,
      message: "Referral code already applied",
      alreadySet: true,
    });
  }

  await db.user.update({
    where: { clerkId: userId },
    data: { referredByCode: affiliate.referralCode },
  });

  return NextResponse.json({
    success: true,
    message: `Referral code applied successfully`,
  });
}
