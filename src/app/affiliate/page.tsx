import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "~/server/db";
import AffiliateDashboard from "./AffiliateDashboard";

export default async function AffiliatePage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/affiliate");

  // Fetch directly from DB — no internal HTTP call needed in server components
  const affiliate = await db.affiliate.findUnique({
    where: { clerkId: userId },
    include: {
      payouts: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          amount: true,
          status: true,
          cryptomusId: true,
          createdAt: true,
        },
      },
      conversions: {
        where: { status: "available" },
        select: { id: true },
      },
    },
  });

  const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://humanifylab.com";

  const affiliateData = affiliate
    ? {
        referralCode: affiliate.referralCode,
        referralUrl: `${BASE_URL}/?ref=${affiliate.referralCode}`,
        conversionCount: affiliate.conversions.length,
        pendingBalance: affiliate.pendingBalance.toString(),
        availableBalance: affiliate.availableBalance.toString(),
        payouts: affiliate.payouts.map((p) => ({
          id: p.id,
          amount: p.amount.toString(),
          status: p.status,
          cryptomusId: p.cryptomusId ?? null,
          createdAt: p.createdAt.toISOString(),
        })),
      }
    : null;

  return <AffiliateDashboard affiliate={affiliateData} />;
}
