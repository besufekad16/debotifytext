/**
 * Admin-only endpoint to manually credit an affiliate commission.
 * Use this for purchases that happened before the affiliate tracking was working.
 *
 * POST /api/affiliate/backfill
 * Body: {
 *   adminSecret: string,       // must match CRON_SECRET env var
 *   referralCode: string,      // e.g. "humanify-004"
 *   buyerClerkId: string,      // Clerk ID of the user who purchased
 *   orderId: string,           // any unique string (e.g. "manual-2026-04-14")
 *   priceAmountCents: number,  // e.g. 699 for $6.99
 * }
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { env } from "~/env";

export async function POST(request: NextRequest) {
  const body = await request.json() as {
    adminSecret?: string;
    referralCode?: string;
    buyerClerkId?: string;
    orderId?: string;
    priceAmountCents?: number;
  };

  // Auth check — use CRON_SECRET as admin secret
  if (!body.adminSecret || body.adminSecret !== env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { referralCode, buyerClerkId, orderId, priceAmountCents } = body;

  if (!referralCode || !buyerClerkId || !orderId || priceAmountCents === undefined) {
    return NextResponse.json({ error: "Missing required fields: referralCode, buyerClerkId, orderId, priceAmountCents" }, { status: 400 });
  }

  const affiliate = await db.affiliate.findUnique({ where: { referralCode } });
  if (!affiliate) {
    return NextResponse.json({ error: `No affiliate found for code: ${referralCode}` }, { status: 404 });
  }

  if (affiliate.clerkId === buyerClerkId) {
    return NextResponse.json({ error: "Self-referral — cannot credit commission" }, { status: 400 });
  }

  const commissionAmount = Math.round((priceAmountCents / 100) * 0.10 * 100) / 100;
  const availableAt = new Date();
  availableAt.setDate(availableAt.getDate() + 7);

  try {
    await db.$transaction(async (tx) => {
      await tx.affiliateConversion.create({
        data: {
          affiliateId: affiliate.id,
          referredClerkId: buyerClerkId,
          orderId,
          commission: commissionAmount,
          status: "pending",
          availableAt,
        },
      });
      await tx.affiliate.update({
        where: { id: affiliate.id },
        data: { pendingBalance: { increment: commissionAmount } },
      });
    });

    return NextResponse.json({
      success: true,
      commission: commissionAmount,
      affiliate: referralCode,
      availableAt: availableAt.toISOString(),
      message: `Commission $${commissionAmount} credited to ${referralCode}. Available after 7 days.`,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("Unique constraint") || msg.includes("unique constraint")) {
      return NextResponse.json({ error: "This order has already been credited" }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
