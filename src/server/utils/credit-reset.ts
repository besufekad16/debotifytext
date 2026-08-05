import { db } from "~/server/db";

/**
 * Centralized monthly credit-reset logic.
 *
 * Shared by:
 *   - src/app/api/webhooks/polar/route.ts   (reset-date computation)
 *   - src/app/api/cron/reset-credits/route.ts (scheduled reset)
 *   - src/app/api/humanizer/route.ts          (lazy reset on request)
 *   - src/app/api/humanizer/stream/route.ts   (lazy reset on request)
 *   - src/app/api/humanize/route.ts           (lazy reset on API-key request)
 *   - src/app/api/user/credits/route.ts       (lazy reset on balance fetch)
 *
 * CRITICAL: These allotments MUST stay in sync with getPlanConfig() in the
 * Polar webhook — they are exactly what paying subscribers receive monthly.
 * Basic = 7,000 | Pro = 25,000 | Ultra = 50,000 | Lifetime = 20,000.
 * Do NOT change these values.
 */
export function getPlanMonthlyCredits(plan: string | null | undefined): number {
  switch (plan) {
    case "basic":
      return 7000; // 7,000 words / mo
    case "pro":
      return 25000; // 25,000 words / mo
    case "ultra":
      return 50000; // 50,000 words / mo
    case "lifetime":
      return 20000; // Lifetime deal refreshes 20,000 words / mo
    default:
      return 7000;
  }
}

/** First day of next month, 00:00:00 local time. */
export function getNextMonthlyResetDate(): Date {
  const now = new Date();
  const nextMonth = new Date(now);
  nextMonth.setMonth(now.getMonth() + 1);
  nextMonth.setDate(1);
  nextMonth.setHours(0, 0, 0, 0);
  return nextMonth;
}

export interface MonthlyResetUser {
  id: string;
  credits: number;
  subscriptionPlan: string | null;
  subscriptionType: string | null;
  nextResetDate: Date | null;
}

/**
 * Lazily refreshes monthly credits for subscription types that are billed
 * up-front but receive monthly word allotments (annual + lifetime).
 * Monthly (and the 2-month unlimited) subscriptions are refreshed by the
 * Polar renewal webhook instead, so they are intentionally NOT reset here.
 *
 * Returns the (possibly updated) user object plus whether a reset ran, so
 * callers can keep using fresh credit balances without a refetch.
 */
export async function refreshMonthlyCreditsIfNeeded<T extends MonthlyResetUser>(
  user: T,
): Promise<{ user: T; resetApplied: boolean }> {
  const needsMonthlyRefresh =
    user.subscriptionType === "annual" || user.subscriptionType === "lifetime";

  if (!needsMonthlyRefresh || !user.nextResetDate || new Date() < user.nextResetDate) {
    return { user, resetApplied: false };
  }

  const planCredits = getPlanMonthlyCredits(user.subscriptionPlan);
  const nextReset = getNextMonthlyResetDate();

  await db.user.update({
    where: { id: user.id },
    data: {
      credits: planCredits,
      nextResetDate: nextReset,
    },
  });

  return {
    user: { ...user, credits: planCredits, nextResetDate: nextReset },
    resetApplied: true,
  };
}
