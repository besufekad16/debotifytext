import { type NextRequest, NextResponse } from "next/server";
import { db } from "~/server/db";
import { env } from "~/env";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // Validate cron secret
  const authHeader = request.headers.get("Authorization");
  const cronSecret = env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  // Find all pending conversions whose hold period has passed
  const dueConversions = await db.affiliateConversion.findMany({
    where: {
      status: "pending",
      availableAt: { lte: now },
    },
    select: {
      id: true,
      affiliateId: true,
      commission: true,
    },
  });

  if (dueConversions.length === 0) {
    return NextResponse.json({ released: 0 });
  }

  let released = 0;
  const errors: string[] = [];

  // Process each conversion individually so one failure doesn't block others
  for (const conversion of dueConversions) {
    try {
      await db.$transaction(async (tx) => {
        await tx.affiliateConversion.update({
          where: { id: conversion.id },
          data: { status: "available" },
        });

        await tx.affiliate.update({
          where: { id: conversion.affiliateId },
          data: {
            pendingBalance: { decrement: conversion.commission },
            availableBalance: { increment: conversion.commission },
          },
        });
      });

      released++;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`[Cron] Failed to release conversion ${conversion.id}:`, msg);
      errors.push(`${conversion.id}: ${msg}`);
    }
  }

  console.log(`[Cron] affiliate-release: released ${released}/${dueConversions.length} conversions`);

  return NextResponse.json({
    released,
    total: dueConversions.length,
    errors: errors.length > 0 ? errors : undefined,
  });
}
