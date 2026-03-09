/**
 * Model Configuration Constants
 * Centralized configuration for AI models used throughout the application
 */

// Primary model - Gemini 3 Flash Preview (latest, fastest)
// This is the newest Gemini model with Pro-level intelligence at Flash speeds
// Model ID: gemini-3-flash-preview (preview phase)
export const DEFAULT_MODEL = "gemini-3-flash-preview";

// Fallback model - Gemini 2.5 Flash (stable, lightweight)
// If Gemini 3 fails, fall back to stable 2.5 Flash
export const FALLBACK_MODEL = "gemini-2.5-flash";

// Allowed models for humanization (Gemini only - no OpenAI to reduce CPU usage)
// Using verified model names from Google AI Studio
export const ALLOWED_MODELS = [
  "gemini-3-flash-preview",  // Latest Gemini 3 (PRIMARY)
  "gemini-2.5-flash",        // Stable Gemini 2.5 (FALLBACK)
  "gemini-2.5-flash-lite",   // Lighter variant
  "gemini-2.5-pro",          // Heavier, more capable
] as const;

// Model pricing information (per 1M tokens)
// Source: Google AI Studio pricing (2026) - Gemini only
export const MODEL_PRICING = {
  "gemini-3-flash-preview": {
    input: 0.50,
    output: 3.00,
    description: "Latest Gemini 3 with Pro-level intelligence at Flash speeds (PRIMARY)",
  },
  "gemini-2.5-flash": {
    input: 0.075,
    output: 0.30,
    description: "Stable Gemini 2.5, lightweight and fast (FALLBACK)",
  },
  "gemini-2.5-flash-lite": {
    input: 0.05,
    output: 0.20,
    description: "Lightest Gemini model, ultra-fast, lowest CPU usage",
  },
  "gemini-2.5-pro": {
    input: 1.25,
    output: 5.00,
    description: "Most capable Gemini model, heavier and more expensive",
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
 * Always returns gemini-3-flash-preview (latest) for all users and word counts
 * This is the newest Gemini model with Pro-level intelligence at Flash speeds
 * 
 * @param wordCount - Number of words in the text (unused, kept for compatibility)
 * @param subscriptionPlan - User's subscription plan (unused, kept for compatibility)
 * @returns The model to use (always gemini-3-flash-preview)
 */
export function selectModelByComplexity(
  wordCount: number,
  subscriptionPlan?: string | null
): string {
  // Always use gemini-3-flash-preview (latest Gemini 3) for all requests
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

