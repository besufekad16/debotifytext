"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { sendPayout } from "~/server/utils/cryptomus-client";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://humanifylab.com";

function generateReferralCode(count: number): string {
  return `humanify-${String(count + 1).padStart(3, "0")}`;
}

export async function registerAffiliate(): Promise<{
  success: boolean;
  referralCode?: string;
  referralUrl?: string;
  error?: string;
}> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  // Idempotent
  const existing = await db.affiliate.findUnique({ where: { clerkId: userId } });
  if (existing) {
    return {
      success: true,
      referralCode: existing.referralCode,
      referralUrl: `${BASE_URL}/?ref=${existing.referralCode}`,
    };
  }

  const count = await db.affiliate.count();
  const referralCode = generateReferralCode(count);

  const affiliate = await db.affiliate.create({
    data: { clerkId: userId, referralCode },
  });

  return {
    success: true,
    referralCode: affiliate.referralCode,
    referralUrl: `${BASE_URL}/?ref=${affiliate.referralCode}`,
  };
}

export async function requestPayout(walletAddress: string): Promise<{
  success: boolean;
  payoutId?: string;
  amount?: string;
  error?: string;
}> {
  const { userId } = await auth();
  if (!userId) return { success: false, error: "Unauthorized" };

  const MIN_WALLET = 26;
  const MAX_WALLET = 62;
  const MIN_PAYOUT = 15;

  if (!walletAddress || walletAddress.length < MIN_WALLET || walletAddress.length > MAX_WALLET) {
    return { success: false, error: `Wallet address must be ${MIN_WALLET}–${MAX_WALLET} characters` };
  }

  const affiliate = await db.affiliate.findUnique({
    where: { clerkId: userId },
    include: { payouts: { where: { status: "processing" }, take: 1 } },
  });

  if (!affiliate) return { success: false, error: "Not an affiliate" };
  if (affiliate.payouts.length > 0) return { success: false, error: "A payout is already in progress" };

  const available = Number(affiliate.availableBalance);
  if (available < MIN_PAYOUT) {
    return { success: false, error: `Minimum payout is $${MIN_PAYOUT}.00. Your balance is $${available.toFixed(2)}` };
  }

  // Create payout + deduct balance atomically
  const payout = await db.$transaction(async (tx) => {
    await tx.affiliate.update({
      where: { id: affiliate.id },
      data: { availableBalance: { decrement: available } },
    });
    return tx.affiliatePayout.create({
      data: { affiliateId: affiliate.id, amount: available, walletAddress, status: "processing" },
    });
  });

  const result = await sendPayout({
    amount: available.toFixed(2),
    walletAddress,
    orderId: payout.id,
  });

  if (result.success) {
    await db.affiliatePayout.update({
      where: { id: payout.id },
      data: { status: "completed", cryptomusId: result.cryptomusId },
    });
    return { success: true, payoutId: payout.id, amount: available.toFixed(2) };
  }

  // Rollback
  await db.$transaction(async (tx) => {
    await tx.affiliatePayout.update({ where: { id: payout.id }, data: { status: "failed" } });
    await tx.affiliate.update({ where: { id: affiliate.id }, data: { availableBalance: { increment: available } } });
  });

  return { success: false, error: result.error ?? "Payout failed. Please try again." };
}
