import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { sendPayout } from "~/server/utils/oxapay-client";

const MIN_PAYOUT = 15;
const MIN_WALLET_LEN = 26;
const MAX_WALLET_LEN = 62;

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json() as { walletAddress?: string; network?: string };
  const { walletAddress, network = "TRX" } = body;

  // Validate wallet address
  if (
    !walletAddress ||
    walletAddress.length < MIN_WALLET_LEN ||
    walletAddress.length > MAX_WALLET_LEN
  ) {
    return NextResponse.json(
      { error: `Wallet address must be ${MIN_WALLET_LEN}–${MAX_WALLET_LEN} characters` },
      { status: 400 }
    );
  }

  // Fast pre-check
  const affiliate = await db.affiliate.findUnique({
    where: { clerkId: userId },
    include: { payouts: { where: { status: "processing" }, take: 1 } },
  });

  if (!affiliate) {
    return NextResponse.json({ error: "Not an affiliate" }, { status: 404 });
  }
  if (affiliate.payouts.length > 0) {
    return NextResponse.json({ error: "A payout is already in progress" }, { status: 409 });
  }

  const preCheckBalance = Number(affiliate.availableBalance);
  if (preCheckBalance < MIN_PAYOUT) {
    return NextResponse.json(
      { error: `Minimum payout is $${MIN_PAYOUT}.00. Your balance is $${preCheckBalance.toFixed(2)}` },
      { status: 400 }
    );
  }

  // Atomically re-read balance, check lock, deduct, and create payout record
  let payout: { id: string; amount: { toString(): string } };
  try {
    payout = await db.$transaction(async (tx) => {
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
    const msg = err instanceof Error ? err.message : "Payout failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const payoutAmount = Number(payout.amount.toString());

  // Call OxaPay
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
    return NextResponse.json({
      success: true,
      payoutId: payout.id,
      trackId: result.trackId,
      amount: payoutAmount.toFixed(2),
    });
  }

  // Rollback on OxaPay failure
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

  return NextResponse.json(
    { error: result.error ?? "Payout failed. Please try again." },
    { status: 502 }
  );
}
