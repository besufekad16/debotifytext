/**
 * Model Configuration Constants
 * Centralized configuration for AI models used throughout the application
 */

// Primary model - Gemini 3 Flash Preview (for longer texts >1800 words)
// Best quality for longer content, premium model
// Model ID: gemini-3-flash-preview
export const DEFAULT_MODEL = "gemini-3-flash-preview";

// Fallback model - Gemini 2.5 Flash-Lite (for shorter texts ≤1800 words)
// Faster and more cost-effective for shorter content
export const FALLBACK_MODEL = "gemini-2.5-flash-lite";

// Word count threshold for model selection
export const MODEL_SELECTION_THRESHOLD = 1800;

// Allowed models for humanization (Gemini only)
// Smart model selection based on word count
export const ALLOWED_MODELS = [
  "gemini-3-flash-preview",  // Premium model for longer texts (>1800 words)
  "gemini-2.5-flash-lite",   // Lighter model for shorter texts (≤1800 words)
  "gemini-2.5-flash",        // Backup option
  "gemini-1.5-flash",        // Legacy fallback
] as const;

// Model pricing information (per 1M tokens)
// Source: Google AI Studio pricing (2026)
export const MODEL_PRICING = {
  "gemini-3-flash-preview": {
    input: 0.50,
    output: 3.00,
    description: "Premium Gemini 3 for longer texts (>1800 words) - Best quality",
  },
  "gemini-2.5-flash-lite": {
    input: 0.05,
    output: 0.20,
    description: "Lighter model for shorter texts (≤1800 words) - Fast and cost-effective",
  },
  "gemini-2.5-flash": {
    input: 0.075,
    output: 0.30,
    description: "Backup option - Balanced performance",
  },
  "gemini-1.5-flash": {
    input: 0.075,
    output: 0.30,
    description: "Legacy fallback - Stable and reliable",
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
 * Get the model to use for humanization based on word count
 * Smart selection: lighter model for short texts, premium model for longer texts
 * 
 * STRATEGY:
 * - Word count ≤ 1800: Use gemini-2.5-flash-lite (faster, cheaper, sufficient quality)
 * - Word count > 1800: Use gemini-3-flash-preview (best quality for longer content)ontent)
 * 
 * This approach:
 * 1. Saves costs on short texts (most common use case)
 * 2. Provides best quality for longer texts (where quality matters most)
 * 3. Faster response times for short texts
 * 4. Better user experience overall
 * 
 * @param wordCount - Number of words in the text
 * @param subscriptionPlan - User's subscription plan (unused, kept for compatibility)
 * @returns The model to use based on word count
 */
export function selectModelByComplexity(
  wordCount: number,
  subscriptionPlan?: string | null
): string {
  // Smart selection based on word count
  if (wordCount <= MODEL_SELECTION_THRESHOLD) {
    // Short/Medium texts: Use lighter, faster model
    console.log(`[Model Selection] Using ${FALLBACK_MODEL} for ${wordCount} words (≤ ${MODEL_SELECTION_THRESHOLD})`);
    return FALLBACK_MODEL; // gemini-2.5-flash-lite
  } else {
    // Longer texts: Use premium model for best quality
    console.log(`[Model Selection] Using ${DEFAULT_MODEL} for ${wordCount} words (> ${MODEL_SELECTION_THRESHOLD})`);
    return DEFAULT_MODEL; // gemini-3-flash-preview
  }
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

