/**
 * Model Configuration Constants
 * Centralized configuration for AI models used throughout the application
 */

// Single model for all requests - Gemini Flash (lightest, fastest)
// This is the lightest Gemini model to avoid hitting rate limits
// "gemini-flash-latest" always points to the latest stable flash model
export const DEFAULT_MODEL = "gemini-flash-latest";

// Fallback model used when Gemini fails (OpenAI gpt-4o-mini - lighter than gpt-5-mini)
// gpt-4o-mini is faster and cheaper while maintaining good quality
export const FALLBACK_MODEL = "gpt-4o-mini";

// Allowed models for humanization (both Gemini and OpenAI)
export const ALLOWED_MODELS = [
  "gemini-2.0-flash-exp",
  "gemini-2.5-flash",
  "gemini-2.0-flash-thinking-exp-01-21",
  "gemini-flash-latest",
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
    description: "Lightest OpenAI option, fast and cost-effective",
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
  "gemini-flash-latest": {
    input: 0.075,
    output: 0.30,
    description: "Lightest Gemini model, extremely fast and cheap",
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
 * Always returns gemini-flash-latest for all users and word counts
 * This is the lightest model to avoid rate limits and reduce costs
 * 
 * @param wordCount - Number of words in the text (unused, kept for compatibility)
 * @param subscriptionPlan - User's subscription plan (unused, kept for compatibility)
 * @returns The model to use (always gemini-flash-latest)
 */
export function selectModelByComplexity(
  wordCount: number,
  subscriptionPlan?: string | null
): string {
  // Always use gemini-flash-latest (lightest model) for all requests
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

