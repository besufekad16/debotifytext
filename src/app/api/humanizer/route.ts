import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { aiStudios } from "~/server/adapters/aistudios";
import { calculateHumanizationScore } from "~/server/utils/humanization";
import { 
  checkRateLimit, 
  getRateLimitForPlan 
} from "~/server/utils/rate-limiter";
import { 
  validateRequestFrequency, 
  sanitizeText 
} from "~/server/utils/request-validator";
import {
  DEFAULT_MODEL,
  ALLOWED_MODELS,
  isAllowedModel,
} from "~/server/config/models";
import { trackWordUsage } from "~/server/utils/polar-client";
import { addCorsHeaders, handleCorsPreflight } from "~/lib/cors";
import { refreshMonthlyCreditsIfNeeded } from "~/server/utils/credit-reset";

// Helper function to validate API Key
async function validateApiKey(key: string) {
  if (!key.startsWith("cb_")) {
    return null;
  }
  
  const apiKey = await db.apiKey.findFirst({
    where: { 
      key: key,
      isActive: true 
    },
    include: {
      user: true,
    },
  });

  if (!apiKey || !apiKey.user) {
    return null;
  }

  // Check if the user's plan allows API access (ultra or unlimited plan)
  if (apiKey.user.subscriptionPlan !== "ultra" && apiKey.user.subscriptionPlan !== "unlimited") {
    return null; // Or return a specific error about plan requirements
  }
  
  // Update last used timestamp
  await db.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() },
  });
  
  return apiKey.user;
}

export async function POST(request: NextRequest) {
  const corsResponse = handleCorsPreflight(request);
  if (corsResponse) return corsResponse;

  try {
    console.log("\n--- [HUMANIZER API] Received new request ---");
    
    const authHeader = request.headers.get("Authorization");
    let dbUser;
    let isApiKeyAuth = false;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      if (token.startsWith("cb_")) {
        // It's an API Key
        dbUser = await validateApiKey(token);
        if (!dbUser) {
          return addCorsHeaders(NextResponse.json({ error: "Unauthorized" }, { status: 401 }), request);
        }
        isApiKeyAuth = true;
      }
    }

    if (!isApiKeyAuth) {
      // Use existing Clerk logic
      const { userId } = await auth();
      if (!userId) {
        return addCorsHeaders(NextResponse.json({ error: "Unauthorized" }, { status: 401 }), request);
      }
      
      dbUser = await db.user.findFirst({
        where: { clerkId: userId },
        select: {
          id: true,
          credits: true,
          extraCredits: true,
          subscriptionPlan: true,
          subscriptionType: true,
          maxWordsPerRequest: true,
          nextResetDate: true,
          team: {
            select: {
              owner: {
                select: {
                  id: true,
                  credits: true,
                  extraCredits: true,
                  subscriptionPlan: true,
                  subscriptionType: true,
                  maxWordsPerRequest: true,
                  nextResetDate: true,
                }
              }
            }
          }
        },
      });
    }

    if (!dbUser) {
      console.error("[HUMANIZER API] User not found");
      return addCorsHeaders(NextResponse.json({ error: "User not found" }, { status: 404 }), request);
    }

    // Determine which user to bill (team owner if exists, otherwise the user)
    // Note: API Key users (isApiKeyAuth) are treated as individual users for now, 
    // but if they are part of a team, we might want to consider that in the future.
    // For now, we'll assume API keys are personal or the owner's key.
    // If it's a team member using the web UI (Clerk auth), we use the owner.
    let billingUser = (!isApiKeyAuth && (dbUser as any).team?.owner) ? (dbUser as any).team.owner : dbUser;
    const isTeamMember = !isApiKeyAuth && !!(dbUser as any).team?.owner;

    // For API key auth, skip frequency check (or implement different logic)
    if (!isApiKeyAuth) {
      // SECURITY: Check request frequency for Clerk users
      const frequencyCheck = validateRequestFrequency(dbUser.id, 3);
      if (!frequencyCheck.valid) {
        console.error(`[HUMANIZER API] Request frequency limit exceeded for user: ${dbUser.id}`);
        return addCorsHeaders(NextResponse.json({ 
          error: frequencyCheck.error,
          errorCode: frequencyCheck.errorCode,
        }, { status: 429 }), request);
      }
    }

    // COST OPTIMIZATION: Rate limiting based on subscription plan
    // Use billing user's plan for limits
    const rateLimitConfig = getRateLimitForPlan(billingUser.subscriptionPlan);
    const rateLimit = checkRateLimit(dbUser.id, rateLimitConfig);

    if (!rateLimit.allowed) {
      console.error(
        `[HUMANIZER API] Rate limit exceeded for user: ${dbUser.id}, ` +
        `Plan: ${billingUser.subscriptionPlan}, Retry after: ${rateLimit.retryAfter}s`
      );
      return addCorsHeaders(NextResponse.json(
        { 
          error: `Rate limit exceeded. Please wait ${rateLimit.retryAfter} seconds before trying again.`,
          errorCode: 'RATE_LIMIT_EXCEEDED',
          retryAfter: rateLimit.retryAfter,
          remaining: rateLimit.remaining,
        },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(rateLimitConfig.maxRequests),
            "X-RateLimit-Remaining": String(rateLimit.remaining),
            "Retry-After": String(rateLimit.retryAfter || 60),
          },
        }
      ), request);
    }

    const refreshResult = await refreshMonthlyCreditsIfNeeded(billingUser);
    billingUser = refreshResult.user;
    if (refreshResult.resetApplied) {
      console.log(`[HUMANIZER API] Refreshed monthly subscription credits for user ${billingUser.id}`);
    }

    // Parse request body with error handling for malformed JSON
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("[HUMANIZER API] JSON parse error:", parseError);
      return addCorsHeaders(NextResponse.json({ 
        error: "Invalid JSON in request body. Please ensure newlines in text are escaped as \\n",
        errorCode: "INVALID_JSON",
        details: parseError instanceof Error ? parseError.message : String(parseError)
      }, { status: 400 }), request);
    }

    const { text: rawText, preset = "default", tone, options = {} } = body;
    const selectedTone = tone || preset;

    // Validate preset access - only pro and ultra users can use presets (except "default" which is available to all)
    const effectivePlan = billingUser.subscriptionPlan;
    if (selectedTone !== "default" && (effectivePlan === "basic" || !effectivePlan)) {
      // Basic users can only use "default" preset, other presets require pro/ultra
      console.error(`[HUMANIZER API] Preset access denied for ${effectivePlan || "free"} user. Preset: ${selectedTone}`);
      return addCorsHeaders(NextResponse.json({ 
        error: "This preset is only available for Pro and Ultra subscribers. Please upgrade to access all presets.",
        errorCode: "PRESET_LOCKED",
        upgradeRequired: true,
      }, { status: 403 }), request);
    }

    // SECURITY: Validate and sanitize input
    if (!rawText || typeof rawText !== "string") {
      console.error("[HUMANIZER API] Invalid text type");
      return addCorsHeaders(NextResponse.json({ 
        error: "Text is required and must be a string",
        errorCode: "INVALID_TYPE",
      }, { status: 400 }), request);
    }

    // COST OPTIMIZATION: Sanitize text
    const text = sanitizeText(rawText);

    console.log(
      `[HUMANIZER API] Preset: ${preset}, Tone: ${selectedTone}, ` +
      `Original Length: ${rawText.length}, Sanitized Length: ${text.length}`
    );

    // Basic validation only (let users humanize what they want)
    if (text.length < 10) {
      console.error("[HUMANIZER API] Text too short");
      return addCorsHeaders(NextResponse.json({ 
        error: "Text must be at least 10 characters long",
        errorCode: "TEXT_TOO_SHORT",
      }, { status: 400 }), request);
    }

    if (text.length > 50000) {
      console.error("[HUMANIZER API] Text too long");
      return addCorsHeaders(NextResponse.json({ 
        error: "Text exceeds maximum length of 50,000 characters",
        errorCode: "TEXT_TOO_LONG",
      }, { status: 400 }), request);
    }

    // Calculate word count for validation
    const wordCount = text.trim().split(/\s+/).length;
    const maxWords = billingUser.maxWordsPerRequest || 1000;
    
    if (wordCount > maxWords) {
      console.error(`[HUMANIZER API] Validation Error: Text exceeds plan limit. Words: ${wordCount}, Max: ${maxWords}`);
      return addCorsHeaders(NextResponse.json({ 
        error: `Text exceeds your plan limit of ${maxWords} words per request. Your text has ${wordCount} words.`,
        wordCount,
        maxWords,
      }, { status: 400 }), request);
    }

    // Check user credits (use fresh data after potential reset)
    console.log(`[HUMANIZER API] User credits check: ${billingUser.credits}, Extra: ${billingUser.extraCredits}, Words: ${wordCount}`);

    // Calculate credits needed (1 credit = 1 word)
    const creditsNeeded = wordCount;
    const totalAvailableCredits = (billingUser.credits || 0) + (billingUser.extraCredits || 0);
    
    if (totalAvailableCredits < creditsNeeded) {
      console.error(`[HUMANIZER API] Error: Insufficient credits. Need: ${creditsNeeded}, Have: ${totalAvailableCredits} (Plan: ${billingUser.credits}, Extra: ${billingUser.extraCredits})`);
      return addCorsHeaders(NextResponse.json({ 
        error: "Insufficient credits",
        credits: billingUser.credits,
        extraCredits: billingUser.extraCredits,
        creditsNeeded,
        wordCount,
      }, { status: 402 }), request);
    }

    console.log(
      `[HUMANIZER API] All validations passed. Calling aiStudios.humanizeText... ` +
      `User: ${dbUser.id}, Billing: ${billingUser.id}, Credits: ${billingUser.credits}, Extra: ${billingUser.extraCredits}, Words: ${wordCount}, Plan: ${billingUser.subscriptionPlan}`
    );

    // COST OPTIMIZATION: Validate model before making API call
    const requestedModel = options.model || DEFAULT_MODEL;
    
    if (!isAllowedModel(requestedModel)) {
      console.error(`[HUMANIZER API] Invalid model requested: ${requestedModel}`);
      return addCorsHeaders(NextResponse.json({ 
        error: `Invalid model. Allowed models: ${ALLOWED_MODELS.join(', ')}`,
        errorCode: "INVALID_MODEL",
      }, { status: 400 }), request);
    }

    // Dynamic maxTokens by word count (same tiers as stream; adapter caps by model e.g. Flash 8192)
    const maxTokensByWordCount =
      wordCount < 500 ? 16384 : wordCount < 1000 ? 16384 : wordCount < 3000 ? 32768 : 65536;

    let aiResult;
    try {
      aiResult = await aiStudios.humanizeText(text, {
        maxTokens: maxTokensByWordCount,
        preset: selectedTone,
        tone: selectedTone,
        model: requestedModel,
        ...options, // User-provided options (including temperature) will override defaults
      });
    } catch (error) {
      // CRITICAL: AI call failed but NO CREDITS should be deducted
      console.error(
        `[HUMANIZER API] CRITICAL: AI call failed - NO CREDITS DEDUCTED\n` +
        `Error: ${error instanceof Error ? error.message : String(error)}\n` +
        `User: ${dbUser.id}, Words: ${wordCount}`
      );
      return addCorsHeaders(NextResponse.json(
        { 
          error: "Failed to humanize text. Your credits were not deducted.",
          errorCode: "AI_CALL_FAILED",
          details: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      ), request);
    }

    if (!aiResult.success) {
      console.error(
        `[HUMANIZER API] AI humanization failed - NO CREDITS DEDUCTED\n` +
        `Error: ${aiResult.error}\n` +
        `User: ${dbUser.id}, Words: ${wordCount}`
      );
      return addCorsHeaders(NextResponse.json(
        { 
          error: "Failed to humanize text. Your credits were not deducted.",
          errorCode: "HUMANIZATION_FAILED",
          details: aiResult.error,
        },
        { status: 500 }
      ), request);
    }

    console.log("[HUMANIZER API] aiStudios.humanizeText call was successful.");
    console.log(
      "[HUMANIZER API] Result metadata:",
      JSON.stringify(
        {
          source: aiResult.metadata?.source ?? "unknown",
          fallback: aiResult.metadata?.fallback ?? false,
          error: aiResult.metadata?.error ?? null,
        },
        null,
        2,
      ),
    );
    if (aiResult.metadata?.rawAiText) {
      console.log("[HUMANIZER API] Raw paraphrase before heuristics:");
      console.log(aiResult.metadata.rawAiText);
    } else {
      console.log("[HUMANIZER API] Raw paraphrase before heuristics unavailable.");
    }

    const humanizedText = aiResult.humanizedText;
    const humanScore = calculateHumanizationScore(humanizedText);

    // Calculate credits based on word count (1 credit = 1 word)
    const creditsToDeduct = wordCount;
    
    let newCredits = billingUser.credits || 0;
    let newExtraCredits = billingUser.extraCredits || 0;
    let remainingToDeduct = creditsToDeduct;

    // 1. Deduct from monthly plan credits first
    if (newCredits >= remainingToDeduct) {
      newCredits -= remainingToDeduct;
      remainingToDeduct = 0;
    } else {
      remainingToDeduct -= newCredits;
      newCredits = 0;
    }

    // 2. Deduct remaining from extra credits
    if (remainingToDeduct > 0) {
      newExtraCredits = Math.max(0, newExtraCredits - remainingToDeduct);
    }

    const creditsRemaining = newCredits + newExtraCredits;

    await db.user.update({
      where: { id: billingUser.id },
      data: { 
        credits: newCredits,
        extraCredits: newExtraCredits
      },
    });

    // Track usage in Polar for billing
    // This allows Polar to track customer usage for metered billing
    const polarTracking = await trackWordUsage(billingUser.id, wordCount, {
      preset: selectedTone,
      plan: billingUser.subscriptionPlan,
      model: requestedModel,
      teamMemberId: isTeamMember ? dbUser.id : undefined
    });

    if (!polarTracking.success) {
      console.error(
        `[HUMANIZER API] Failed to track usage in Polar: ${polarTracking.error}\n` +
        `User: ${billingUser.id}, Words: ${wordCount} - Continuing anyway...`
      );
      // Don't fail the request if Polar tracking fails
    } else {
      console.log(
        `[HUMANIZER API] Successfully tracked ${wordCount} words in Polar for user ${billingUser.id}`
      );
    }

    try {
      await db.humanizerHistory.create({
        data: {
          originalText: text,
          humanizedText,
          preset: preset,
          tokensUsed: creditsToDeduct,
          aiScore: humanScore,
          metadata: {
            ...aiResult.metadata,
            billedTo: isTeamMember ? billingUser.id : undefined
          },
          userId: dbUser.id,
        },
      });
    } catch (dbError) {
      console.error("Failed to save history:", dbError);
    }

    // Sanitize metadata to hide actual model information
    const sanitizedAiResult = { ...aiResult.metadata };
    delete sanitizedAiResult.model; // Remove actual model name
    sanitizedAiResult.source = "cbubble-o1"; // Override source

    return addCorsHeaders(NextResponse.json({
      humanized_text: humanizedText,
      ai_score: humanScore,
      tokens_used: aiResult.tokensUsed,
      meta: {
        preset: preset,
        attempts: 1,
        ai_result: sanitizedAiResult,
        source: "cbubble-o1", // Hide actual model name
        fallback: true, // Always show fallback as true for API users
      },
      credits_remaining: creditsRemaining,
      credits_used: creditsToDeduct,
    }), request);

  } catch (error) {
    console.error("Humanizer API error:", error);
    return addCorsHeaders(NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    ), request);
  }
}

export async function OPTIONS(request: NextRequest) {
  return handleCorsPreflight(request) || new NextResponse(null, { status: 200 });
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await db.user.findFirst({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get user's humanization history
    const history = await db.humanizerHistory.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        originalText: true,
        humanizedText: true,
        preset: true,
        tokensUsed: true,
        aiScore: true,
        // detectorResult: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ history });

  } catch (error) {
    console.error("History fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    );
  }
}
