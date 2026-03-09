/**
 * Model Configuration Constants
 * Centralized configuration for AI models used throughout the application
 */

// Single model for all requests - Gemini 3 Flash Preview
// This model provides excellent quality with optimal cost/performance
export const DEFAULT_MODEL = "gemini-3-flash-preview";

// Fallback model used when Gemini fails (OpenAI gpt-5-mini)
export const FALLBACK_MODEL = "gpt-5-mini";

// Allowed models for humanization (both Gemini and OpenAI)
export const ALLOWED_MODELS = [
  "gemini-3-flash-preview",
  "gemini-2.5-flash",
  "gemini-2.0-flash-thinking-exp-01-21",
  "gemini-flash-latest",
  "gemini-2.0-flash-exp",
  "gemini-2.5-pro",
  "gpt-5-mini",
  "gpt-4o",
  "gpt-4o-mini",
  "gpt-4-turbo",
  "gpt-3.5-turbo",
] as const;

// Model pricing information (per 1M tokens)
export const MODEL_PRICING = {
  "gpt-4o-mini": {
    input: 0.15,
    output: 0.60,
    description: "Cheapest option, recommended for most use cases",
  },
  "gpt-4o": {
    input: 2.50,
    output: 10.00,
    description: "Higher quality, more expensive",
  },
  "gpt-4-turbo": {
    input: 10.00,
    output: 30.00,
    description: "Premium option",
  },
  "gpt-3.5-turbo": {
    input: 0.50,
    output: 1.50,
    description: "Older model, still cost-effective",
  },
} as const;

/**
 * Validates if a model is allowed for humanization
 */
export function isAllowedModel(model: string): boolean {
  return ALLOWED_MODELS.includes(model as typeof ALLOWED_MODELS[number]);
}

/**
 * Gets the default model to use
 */
export function getDefaultModel(): string {
  return DEFAULT_MODEL;
}

/**
 * Gets the fallback model to use
 */
export function getFallbackModel(): string {
  return FALLBACK_MODEL;
}

/**
 * Get the model to use for humanization
 * Always returns gemini-3-flash-preview for all users and word counts
 * 
 * @param wordCount - Number of words in the text (unused, kept for compatibility)
 * @param subscriptionPlan - User's subscription plan (unused, kept for compatibility)
 * @returns The model to use (always gemini-3-flash-preview)
 */
export function selectModelByComplexity(
  wordCount: number,
  subscriptionPlan?: string | null
): string {
  // Always use gemini-3-flash-preview for all requests
  return DEFAULT_MODEL;
}

/**
 * Determines if a request should be batched
 * Batching is used for free users with small texts to reduce costs
 * 
 * @param wordCount - Number of words in the text
 * @param subscriptionPlan - User's subscription plan
 * @returns true if request should be batched
 */
export function shouldBatchRequest(
  wordCount: number,
  subscriptionPlan?: string | null
): boolean {
  // Only batch for free users with texts under 300 words
  return !subscriptionPlan && wordCount < 300;
}

