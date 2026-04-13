"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { sendPayout } from "~/server/utils/oxapay-client";

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

  // Idempotent — return existing record if already registered
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

  try {
    const affiliate = await db.affiliate.create({
      data: { clerkId: userId, referralCode },
    });
    return {
      success: true,
      referralCode: affiliate.referralCode,
      referralUrl: `${BASE_URL}/?ref=${affiliate.referralCode}`,
    };
  } catch {
    // Race condition: another request created the record — return existing
    const retry = await db.affiliate.findUnique({ where: { clerkId: userId } });
    if (retry) {
      return {
        success: true,
        referralCode: retry.referralCode,
        referralUrl: `${BASE_URL}/?ref=${retry.referralCode}`,
      };
    }
    return { success: false, error: "Registration failed. Please try again." };
  }
}

export async function requestPayout(walletAddress: string, network = "TRX"): Promise<{
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

  // Fast pre-check before entering transaction
  const affiliate = await db.affiliate.findUnique({
    where: { clerkId: userId },
    include: { payouts: { where: { status: "processing" }, take: 1 } },
  });

  if (!affiliate) return { success: false, error: "Not an affiliate" };
  if (affiliate.payouts.length > 0) return { success: false, error: "A payout is already in progress" };

  const preCheckBalance = Number(affiliate.availableBalance);
  if (preCheckBalance < MIN_PAYOUT) {
    return { success: false, error: `Minimum payout is $${MIN_PAYOUT}.00. Your balance is $${preCheckBalance.toFixed(2)}` };
  }

  // Atomically re-read balance inside transaction to prevent race conditions
  let payout: { id: string; amount: { toString(): string } };
  try {
    payout = await db.$transaction(async (tx) => {
      // Re-read with fresh data inside the transaction
      const fresh = await tx.affiliate.findUnique({
        where: { id: affiliate.id },
        include: { payouts: { where: { status: "processing" }, take: 1 } },
      });
      if (!fresh) throw new Error("Affiliate not found");
      if (fresh.payouts.length > 0) throw new Error("A payout is already in progress");

      const freshAvailable = Number(fresh.availableBalance);
      if (freshAvailable < MIN_PAYOUT) {
        throw new Error(`Minimum payout is $${MIN_PAYOUT}.00. Your balance is $${freshAvailable.toFixed(2)}`);
      }

      await tx.affiliate.update({
        where: { id: affiliate.id },
        data: { availableBalance: { decrement: freshAvailable } },
      });

      return tx.affiliatePayout.create({
        data: {
          affiliateId: affiliate.id,
          amount: freshAvailable,
          walletAddress,
          status: "processing",
        },
      });
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Payout failed. Please try again.";
    return { success: false, error: msg };
  }

  const payoutAmount = Number(payout.amount.toString());

  // Call OxaPay to send USDT
  const result = await sendPayout({
    amount: payoutAmount.toFixed(2),
    walletAddress,
    orderId: payout.id,
    network,
  });

  if (result.success) {
    await db.affiliatePayout.update({
      where: { id: payout.id },
      data: { status: "completed", cryptomusId: result.trackId },
    });
    return { success: true, payoutId: payout.id, amount: payoutAmount.toFixed(2) };
  }

  // OxaPay failed — rollback: restore balance and mark payout as failed
  await db.$transaction(async (tx) => {
    await tx.affiliatePayout.update({
      where: { id: payout.id },
      data: { status: "failed" },
    });
    await tx.affiliate.update({
      where: { id: affiliate.id },
      data: { availableBalance: { increment: payoutAmount } },
    });
  });

  return { success: false, error: result.error ?? "Payout failed. Please try again." };
}
