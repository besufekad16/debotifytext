import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.debotifytext.com";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const affiliate = await db.affiliate.findUnique({
    where: { clerkId: userId },
    include: {
      conversions: {
        select: { id: true, commission: true, status: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      },
      payouts: {
        select: {
          id: true,
          amount: true,
          status: true,
          cryptomusId: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!affiliate) {
    return NextResponse.json({ error: "Not an affiliate" }, { status: 404 });
  }

  const conversionCount = affiliate.conversions.filter(
    (c) => c.status === "available"
  ).length;

  return NextResponse.json({
    referralCode: affiliate.referralCode,
    referralUrl: `${BASE_URL}/?ref=${affiliate.referralCode}`,
    conversionCount,
    pendingBalance: affiliate.pendingBalance.toString(),
    availableBalance: affiliate.availableBalance.toString(),
    payouts: affiliate.payouts.map((p) => ({
      id: p.id,
      amount: p.amount.toString(),
      status: p.status,
      cryptomusId: p.cryptomusId ?? null,
      createdAt: p.createdAt.toISOString(),
    })),
  });
}
