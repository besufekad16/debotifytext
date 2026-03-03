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
 * - ALL users (free, basic, pro, ultra) → Advanced AI adapter (aistudios.ts)
 * - This ensures consistent quality across all user tiers
 * 
 * **Rationale:**
 * - Single adapter simplifies maintenance and debugging
 * - All users get the same high-quality humanization
 * - Differentiation happens through credit limits, not quality
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
  // ALL users now use the advanced AI adapter (aistudios.ts)
  console.log(`[Adapter Selection] Using advanced AI adapter for ${subscriptionPlan || 'free'} user`);
  return aiStudios;
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
  return 'advanced-ai'; // All users now use the same adapter
}
