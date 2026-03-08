/**
 * Adapter Selector Utility
 * 
 * Selects the appropriate humanization adapter based on user subscription plan.
 * All users now use the advanced AI adapter for consistent quality.
 */

import { aiStudios } from "~/server/adapters/aistudios";

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
 * - ALL users (free, basic, pro, ultra) use the advanced AI adapter (aistudios.ts)
 * - This ensures consistent, high-quality humanization for all users
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
  // All users use the advanced AI adapter
  console.log(`[Adapter Selection] Using aiStudios adapter for all users`);
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
  return 'aiStudios';
}
