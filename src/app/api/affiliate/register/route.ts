import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.debotifytext.com";

function generateReferralCode(count: number): string {
  const padded = String(count + 1).padStart(3, "0");
  return `debotify-${padded}`;
}

export async function POST() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Idempotent — return existing record if already registered
  const existing = await db.affiliate.findUnique({
    where: { clerkId: userId },
  });

  if (existing) {
    return NextResponse.json({
      referralCode: existing.referralCode,
      referralUrl: `${BASE_URL}/?ref=${existing.referralCode}`,
      pendingBalance: existing.pendingBalance.toString(),
      availableBalance: existing.availableBalance.toString(),
    });
  }

  // Generate sequential code — count existing affiliates
  const count = await db.affiliate.count();
  const referralCode = generateReferralCode(count);

  const affiliate = await db.affiliate.create({
    data: {
      clerkId: userId,
      referralCode,
    },
  });

  return NextResponse.json({
    referralCode: affiliate.referralCode,
    referralUrl: `${BASE_URL}/?ref=${affiliate.referralCode}`,
    pendingBalance: affiliate.pendingBalance.toString(),
    availableBalance: affiliate.availableBalance.toString(),
  });
}
