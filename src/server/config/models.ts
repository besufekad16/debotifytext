/**
 * Model Configuration Constants
 * Centralized configuration for AI models used throughout the application
 */

// Single model for all requests - Gemini 2.5 Flash (stable, lightest)
// Using the stable model name (not alias) as recommended by Google for production
// This is the lightest production-ready Gemini model to avoid hitting rate limits
export const DEFAULT_MODEL = "gemini-2.5-flash";

// Fallback model used when Gemini fails (OpenAI gpt-4o-mini - lighter and faster)
// gpt-4o-mini is the lightest OpenAI model, perfect for fallback
export const FALLBACK_MODEL = "gpt-4o-mini";

// Allowed models for humanization (both Gemini and OpenAI)
// Using stable model names as recommended by Google (not aliases like gemini-flash-latest)
export const ALLOWED_MODELS = [
  "gemini-2.5-flash",        // Stable, lightest Gemini (RECOMMENDED)
  "gemini-2.5-flash-lite",   // Even lighter variant
  "gemini-2.5-pro",          // Heavier, more capable
  "gemini-2.0-flash-exp",    // Experimental 2.0
  "gpt-4o-mini",             // Lightest OpenAI (RECOMMENDED for fallback)
  "gpt-4o",
  "gpt-4-turbo",
  "gpt-3.5-turbo",
] as const;

// Model pricing information (per 1M tokens)
// Source: Google AI Studio and OpenAI pricing pages (2025)
export const MODEL_PRICING = {
  "gemini-2.5-flash": {
    input: 0.075,
    output: 0.30,
    description: "Lightest stable Gemini model, extremely fast and cheap (RECOMMENDED)",
  },
  "gemini-2.5-flash-lite": {
    input: 0.05,
    output: 0.20,
    description: "Even lighter variant, ultra-fast",
  },
  "gemini-2.5-pro": {
    input: 1.25,
    output: 5.00,
    description: "Most capable Gemini model, heavier and more expensive",
  },
  "gpt-4o-mini": {
    input: 0.15,
    output: 0.60,
    description: "Lightest OpenAI model, fast and cost-effective (RECOMMENDED for fallback)",
  },
  "gpt-4o": {
    input: 2.50,
    output: 10.00,
    description: "Higher quality OpenAI model, more expensive",
  },
  "gpt-4-turbo": {
    input: 10.00,
    output: 30.00,
    description: "Premium OpenAI option",
  },
  "gpt-3.5-turbo": {
    input: 0.50,
    output: 1.50,
    description: "Older OpenAI model, still cost-effective",
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
 * Always returns gemini-2.5-flash (stable) for all users and word counts
 * This is the lightest production-ready model to avoid rate limits and reduce costs
 * 
 * @param wordCount - Number of words in the text (unused, kept for compatibility)
 * @param subscriptionPlan - User's subscription plan (unused, kept for compatibility)
 * @returns The model to use (always gemini-2.5-flash)
 */
export function selectModelByComplexity(
  wordCount: number,
  subscriptionPlan?: string | null
): string {
  // Always use gemini-2.5-flash (stable, lightest) for all requests
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

