import { type NextRequest, NextResponse } from "next/server";
import { env } from "~/env";

export const dynamic = "force-dynamic";

/**
 * TEMPORARY DEBUG ENDPOINT
 * This endpoint helps verify your webhook secret is configured correctly
 * 
 * Access: https://www.humanifylab.com/api/webhooks/polar/debug
 * 
 * DELETE THIS FILE after you've verified the webhook secret!
 */
export async function GET(req: NextRequest) {
  const webhookSecret = env.POLAR_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({
      error: "POLAR_WEBHOOK_SECRET not configured",
      configured: false,
    });
  }

  return NextResponse.json({
    configured: true,
    secretLength: webhookSecret.length,
    secretPrefix: webhookSecret.substring(0, 15),
    secretSuffix: webhookSecret.substring(webhookSecret.length - 10),
    startsWithPolarWhs: webhookSecret.startsWith("polar_whs_"),
    hasSpaces: webhookSecret.includes(" "),
    hasQuotes: webhookSecret.includes('"') || webhookSecret.includes("'"),
    message: "If this shows correct values, the secret is configured in Vercel. Check Polar dashboard to ensure it matches.",
  });
}
