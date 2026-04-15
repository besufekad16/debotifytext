/**
 * Adapter Selector Utility
 * 
 * Selects the appropriate humanization adapter based on user subscription plan.
 * - Free users  → aistudio99% adapter (template-based human writing)
 * - Paid users  → aistudios adapter (advanced Gemini with junior college style)
 */

import { aiStudios } from "~/server/adapters/aistudios";
import { aiStudios99 } from "~/server/adapters/aistudio99";

/**
 * Supported subscription plans
 */
export type SubscriptionPlan = 'free' | 'basic' | 'pro' | 'ultra' | 'unlimited' | null | undefined;

/**
 * Humanization adapter interface
 * Both adapters must implement these methods
 */
export interface HumanizationAdapter {
  humanizeText(text: string, options?: any): Promise<any>;
  humanizeTextStream(text: string, options?: any): Promise<ReadableStream>;
}

/**
 * Selects the appropriate humanization adapter based on subscription plan
 * 
 * - free / null / undefined → aiStudios99 (template-based, aistudio99%.ts)
 * - basic / pro / ultra     → aiStudios   (advanced AI, aistudios.ts)
 */
export function getHumanizationAdapter(
  subscriptionPlan: SubscriptionPlan
): HumanizationAdapter {
  if (isPremiumUser(subscriptionPlan)) {
    console.log(`[Adapter Selection] Plan "${subscriptionPlan}" → aiStudios (premium adapter)`);
    return aiStudios;
  }
  console.log(`[Adapter Selection] Plan "${subscriptionPlan ?? 'free'}" → aiStudios99 (free adapter)`);
  return aiStudios99;
}

/**
 * Returns true if the user has an active paid plan (basic, pro, or ultra).
 */
export function isPremiumUser(subscriptionPlan: SubscriptionPlan): boolean {
  const plan = subscriptionPlan?.toLowerCase();
  return plan === 'basic' || plan === 'pro' || plan === 'ultra' || plan === 'unlimited';
}

/**
 * Get adapter name for logging purposes
 */
export function getAdapterName(subscriptionPlan: SubscriptionPlan): string {
  return isPremiumUser(subscriptionPlan) ? 'aiStudios' : 'aiStudios99';
}
