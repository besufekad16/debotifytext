/**
 * TEMPORARY admin endpoint to manually grant unlimited plan.
 * DELETE THIS FILE after the webhook is confirmed working.
 *
 * POST /api/admin/grant-unlimited
 * Body: { adminSecret: string, clerkId: string }
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { env } from "~/env";

export async function POST(request: NextRequest) {
  const body = await request.json() as { adminSecret?: string; clerkId?: string };

  if (!body.adminSecret || body.adminSecret !== env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!body.clerkId) {
    return NextResponse.json({ error: "clerkId required" }, { status: 400 });
  }

  const now = new Date();
  const twoMonthsFromNow = new Date(now);
  twoMonthsFromNow.setMonth(now.getMonth() + 2);
  twoMonthsFromNow.setDate(1);
  twoMonthsFromNow.setHours(0, 0, 0, 0);

  try {
    const user = await db.user.update({
      where: { clerkId: body.clerkId },
      data: {
        credits: 999999999,
        subscriptionPlan: "unlimited",
        subscriptionType: "monthly",
        maxWordsPerRequest: 2000,
        nextResetDate: twoMonthsFromNow,
      },
    });

    return NextResponse.json({
      success: true,
      userId: user.id,
      credits: user.credits,
      plan: user.subscriptionPlan,
      maxWords: user.maxWordsPerRequest,
      expiresAt: twoMonthsFromNow.toISOString(),
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
