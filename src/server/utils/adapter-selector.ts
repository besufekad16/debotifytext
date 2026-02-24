/**
 * Adapter Selector Utility
 * 
 * Selects the appropriate humanization adapter based on user subscription plan.
 * This enables different quality levels for free vs. paid users.
 */

import { aiStudios } from "~/server/adapters/aistudios";
import { aiStudios99 } from "~/server/adapters/aistudio99%";

/**
 * Supported subscription plans
 */
export type SubscriptionPlan = 'free' | 'basic' | 'pro' | 'ultra' | null | undefined;

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
 * @param subscriptionPlan - User's subscription plan
 * @returns Adapter instance to use for humanization
 * 
 * **Selection Logic:**
 * - `null`, `undefined`, `'free'` → Template-based adapter (99% human detection)
 * - `'basic'`, `'pro'`, `'ultra'` → Advanced AI adapter (better quality)
 * 
 * **Rationale:**
 * - Free users get good quality with template-based approach
 * - Basic/Pro/Ultra users get premium quality with advanced AI
 * - This incentivizes upgrades from free to paid tiers
 * 
 * @example
 * ```typescript
 * const adapter = getHumanizationAdapter(user.subscriptionPlan);
 * const result = await adapter.humanizeText(text, options);
 * ```
 */
export function getHumanizationAdapter(
  subscriptionPlan: SubscriptionPlan
): HumanizationAdapter {
  // Normalize plan to lowercase for comparison
  const plan = subscriptionPlan?.toLowerCase();
  
  // Basic, Pro, and Ultra users get advanced AI adapter
  if (plan === 'basic' || plan === 'pro' || plan === 'ultra') {
    console.log(`[Adapter Selection] Using advanced AI adapter for ${plan} user`);
    return aiStudios;
  }
  
  // Free, null, undefined users get template-based adapter
  console.log(`[Adapter Selection] Using template-based adapter for free user`);
  return aiStudios99;
}

/**
 * Helper to determine if user should use premium adapter
 * 
 * @param subscriptionPlan - User's subscription plan
 * @returns true if user has basic, pro, or ultra plan
 * 
 * @example
 * ```typescript
 * const isFreeUser = !isPremiumUser(user.subscriptionPlan);
 * ```
 */
export function isPremiumUser(subscriptionPlan: SubscriptionPlan): boolean {
  const plan = subscriptionPlan?.toLowerCase();
  return plan === 'basic' || plan === 'pro' || plan === 'ultra';
}

/**
 * Get adapter name for logging purposes
 * 
 * @param subscriptionPlan - User's subscription plan
 * @returns Human-readable adapter name
 */
export function getAdapterName(subscriptionPlan: SubscriptionPlan): string {
  return isPremiumUser(subscriptionPlan) ? 'advanced-ai' : 'template-based';
}
