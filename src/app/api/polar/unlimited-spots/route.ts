import { NextResponse } from "next/server";
import { db } from "~/server/db";

export const dynamic = "force-dynamic";
export const revalidate = 60; // cache for 60 seconds

const MAX_SPOTS = 200;
const BASE_COUNT = 186; // pre-seeded count — starts as if 186 already purchased

export async function GET() {
  try {
    const realCount = await db.user.count({
      where: { subscriptionPlan: "unlimited" },
    });
    const taken = BASE_COUNT + realCount;
    return NextResponse.json({
      taken,
      max: MAX_SPOTS,
      remaining: Math.max(0, MAX_SPOTS - taken),
      isFull: taken >= MAX_SPOTS,
    });
  } catch {
    // Fail gracefully — don't block the pricing page
    return NextResponse.json({
      taken: BASE_COUNT,
      max: MAX_SPOTS,
      remaining: MAX_SPOTS - BASE_COUNT,
      isFull: false,
    });
  }
}
