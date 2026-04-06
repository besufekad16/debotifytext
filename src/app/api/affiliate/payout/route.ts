import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { sendPayout } from "~/server/utils/cryptomus-client";

const MIN_PAYOUT = 15;
const MIN_WALLET_LEN = 26;
const MAX_WALLET_LEN = 62;

export async function POST(request: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json() as { walletAddress?: string };
  const { walletAddress } = body;

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

  const affiliate = await db.affiliate.findUnique({
    where: { clerkId: userId },
    include: {
      payouts: {
        where: { status: "processing" },
        take: 1,
      },
    },
  });

  if (!affiliate) {
    return NextResponse.json({ error: "Not an affiliate" }, { status: 404 });
  }

  // Block concurrent payouts
  if (affiliate.payouts.length > 0) {
    return NextResponse.json(
      { error: "A payout is already in progress" },
      { status: 409 }
    );
  }

  const available = Number(affiliate.availableBalance);

  // Enforce minimum threshold
  if (available < MIN_PAYOUT) {
    return NextResponse.json(
      { error: `Minimum payout is $${MIN_PAYOUT}.00. Your balance is $${available.toFixed(2)}` },
      { status: 400 }
    );
  }

  // Create payout record and deduct balance atomically
  const payout = await db.$transaction(async (tx) => {
    await tx.affiliate.update({
      where: { id: affiliate.id },
      data: { availableBalance: { decrement: available } },
    });
    return tx.affiliatePayout.create({
      data: {
        affiliateId: affiliate.id,
        amount: available,
        walletAddress,
        status: "processing",
      },
    });
  });

  // Call Cryptomus
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
    return NextResponse.json({
      success: true,
      payoutId: payout.id,
      cryptomusId: result.cryptomusId,
      amount: available.toFixed(2),
    });
  }

  // Rollback on failure
  await db.$transaction(async (tx) => {
    await tx.affiliatePayout.update({
      where: { id: payout.id },
      data: { status: "failed" },
    });
    await tx.affiliate.update({
      where: { id: affiliate.id },
      data: { availableBalance: { increment: available } },
    });
  });

  return NextResponse.json(
    { error: result.error ?? "Payout failed. Please try again." },
    { status: 502 }
  );
}
