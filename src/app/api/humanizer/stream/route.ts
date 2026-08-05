import { type NextRequest } from "next/server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { 
  checkRateLimit, 
  getRateLimitForPlan 
} from "~/server/utils/rate-limiter";
import { 
  validateRequestFrequency, 
  sanitizeText 
} from "~/server/utils/request-validator";
import { aiStudios } from "~/server/adapters/aistudios";
import { DEFAULT_MODEL } from "~/server/config/models";
import { trackWordUsage } from "~/server/utils/polar-client";
import { refreshMonthlyCreditsIfNeeded } from "~/server/utils/credit-reset";
import { GoogleGenAI } from "@google/genai";

// Local structural types for the Vertex detector calls. The @google/genai
// type exports (SafetySetting, GenerateContentConfig, …) resolve as
// namespaces under this tsconfig's module resolution, so importing them as
// types breaks the typecheck. These mirror the SDK shapes exactly.
type SafetySetting = {
  category: string;
  threshold: string;
};

type VertexDetectorGenerationConfig = {
  maxOutputTokens: number;
  temperature: number;
  topP: number;
  thinkingConfig?: { thinkingBudget: number };
  safetySettings: SafetySetting[];
  tools?: Array<Record<string, unknown>>;
};

type GoogleGenAIClient = InstanceType<typeof GoogleGenAI>;

/**
 * Using the original humanization prompt from aistudios.ts
 * The prompt uses the original format with <role>, <task>, <instructions>, <input>, <output_format> tags
 * We use proper system/user message separation for OpenAI best practices:
 * - System message: Simple role definition
 * - User message: Contains the original prompt format with all rules and the text to humanize
 */

/**
 * Calculates max tokens based on word count (same tiers as adapter getMaxOutputTokensForWordCount).
 * Adapter will cap by model (e.g. Gemini Flash → 8192).
 */
function calculateMaxTokens(wordCount: number): number {
  if (wordCount < 500) return 16384;
  if (wordCount < 1000) return 16384;
  if (wordCount < 3000) return 32768;
  return 65536;
}

/**
 * Chunks text for streaming while preserving paragraph structure
 * Splits text into chunks that preserve newlines and paragraph breaks (\n\n)
 * This ensures the frontend can properly display paragraphs
 */
function chunkTextPreservingParagraphs(text: string): string[] {
  // If text is very short, return as single chunk
  if (text.length <= 150) {
    return [text];
  }

  const chunks: string[] = [];
  const minChunkSize = 50;
  const maxChunkSize = 200;

  // Split text while preserving paragraph breaks
  // We'll split by sentences to avoid breaking in the middle of words
  // but ensure we never break \n\n sequences

  let remaining = text;

  while (remaining.length > 0) {
    // If remaining text is small enough, add it as the last chunk
    if (remaining.length <= maxChunkSize) {
      chunks.push(remaining);
      break;
    }

    // Find a good split point - prefer sentence endings, but preserve \n\n
    let splitIndex = maxChunkSize;

    // Look for sentence endings near the target size
    const searchStart = Math.max(minChunkSize, maxChunkSize - 50);
    const searchEnd = Math.min(remaining.length, maxChunkSize + 50);
    const searchText = remaining.substring(searchStart, searchEnd);

    // Try to find sentence ending (period, exclamation, question mark followed by space)
    const sentenceMatch = searchText.match(/[.!?]\s+/);
    if (sentenceMatch) {
      splitIndex = searchStart + (sentenceMatch.index || 0) + sentenceMatch[0].length;
    } else {
      // No sentence ending found, try to find a word boundary (space)
      const spaceMatch = searchText.match(/\s+/);
      if (spaceMatch) {
        splitIndex = searchStart + (spaceMatch.index || 0) + spaceMatch[0].length;
      }
      // If no space found either, just split at maxChunkSize
    }

    // Make sure we don't break in the middle of \n\n
    const chunk = remaining.substring(0, splitIndex);
    const nextChars = remaining.substring(splitIndex, splitIndex + 3);

    // If we're about to break a \n\n, adjust the split
    if (chunk.endsWith('\n') && nextChars.startsWith('\n')) {
      // Include the \n\n in this chunk
      splitIndex += 2;
    } else if (chunk.endsWith('\n') && !nextChars.startsWith('\n')) {
      // We have a single \n at the end, which is fine
    }

    // Extract chunk
    const chunkText = remaining.substring(0, splitIndex);
    chunks.push(chunkText);
    remaining = remaining.substring(splitIndex);
  }

  return chunks.length > 0 ? chunks : [text];
}

const DEFAULT_VERTEX_PROJECT = "1031810389074";
const DEFAULT_VERTEX_LOCATION = "us-central1";

const DEFAULT_GPTZERO_VERTEX_ENDPOINT_MODEL =
  `projects/${DEFAULT_VERTEX_PROJECT}/locations/${DEFAULT_VERTEX_LOCATION}/endpoints/1799478871960059904`;
const DEFAULT_TURNITIN_VERTEX_ENDPOINT_MODEL =
  `projects/${DEFAULT_VERTEX_PROJECT}/locations/${DEFAULT_VERTEX_LOCATION}/endpoints/5968633450440163328`;

const VERTEX_DETECTOR_SAFETY_SETTINGS: SafetySetting[] = [
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "OFF" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "OFF" },
  { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "OFF" },
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "OFF" },
];

const VERTEX_DETECTOR_GENERATION_CONFIG: VertexDetectorGenerationConfig = {
  maxOutputTokens: 65535,
  temperature: 1,
  topP: 0.95,
  thinkingConfig: {
    thinkingBudget: 0,
  },
  safetySettings: VERTEX_DETECTOR_SAFETY_SETTINGS,
  tools: [{ googleSearch: {} }],
};

/** Tunings often reject tools / thinking — use this for …/models/...@ paths. */
const VERTEX_DETECTOR_TUNED_MODEL_GENERATION_CONFIG: VertexDetectorGenerationConfig = {
  maxOutputTokens: 65535,
  temperature: 1,
  topP: 0.95,
  safetySettings: VERTEX_DETECTOR_SAFETY_SETTINGS,
};

function vertexDetectorConfigForModel(model: string) {
  return model.includes("/locations/") && model.includes("/models/")
    ? VERTEX_DETECTOR_TUNED_MODEL_GENERATION_CONFIG
    : VERTEX_DETECTOR_GENERATION_CONFIG;
}

const VERTEX_DETECTOR_SYSTEM_PROMPT = `Rewrite the following text so it sounds natural and human-written. Avoid overly formal or polished language. Use varied sentence length and conversational phrasing. Keep the meaning. don't search from online`;

type VertexDetectorStreamConfig = {
  label: string;
  defaultEndpointModel: string;
  endpointModelEnvKey: string;
  projectEnvKey: string;
  locationEnvKey: string;
};

const GPTZERO_VERTEX_CONFIG: VertexDetectorStreamConfig = {
  label: "GPTZERO",
  defaultEndpointModel: DEFAULT_GPTZERO_VERTEX_ENDPOINT_MODEL,
  endpointModelEnvKey: "GPTZERO_VERTEX_ENDPOINT_MODEL",
  projectEnvKey: "GPTZERO_VERTEX_PROJECT",
  locationEnvKey: "GPTZERO_VERTEX_LOCATION",
};

const TURNITIN_VERTEX_CONFIG: VertexDetectorStreamConfig = {
  label: "TURNITIN",
  defaultEndpointModel: DEFAULT_TURNITIN_VERTEX_ENDPOINT_MODEL,
  endpointModelEnvKey: "TURNITIN_VERTEX_ENDPOINT_MODEL",
  projectEnvKey: "TURNITIN_VERTEX_PROJECT",
  locationEnvKey: "TURNITIN_VERTEX_LOCATION",
};

async function* vertexStreamGenerateContentWithApiKey(args: {
  model: string;
  location: string;
  systemPrompt: string;
  userText: string;
  generationConfig: VertexDetectorGenerationConfig;
  apiKey: string;
}): AsyncIterable<string> {
  // Use API-key auth (matches python genai.Client(vertexai=True, api_key=...)).
  // NOTE: Vertex "streamGenerateContent" HTTP responses are not always SSE-formatted.
  // To keep this reliable, we prefer a direct non-stream request and then chunk it ourselves.

  const makeUrl = (version: "v1" | "v1beta1") =>
    `https://${args.location}-aiplatform.googleapis.com/${version}/${args.model}:generateContent?key=${encodeURIComponent(args.apiKey)}`;

  const body = {
    contents: [
      {
        role: "user",
        parts: [{ text: args.userText }],
      },
    ],
    systemInstruction: {
      parts: [{ text: args.systemPrompt }],
    },
    generationConfig: {
      maxOutputTokens: args.generationConfig.maxOutputTokens,
      temperature: args.generationConfig.temperature,
      topP: args.generationConfig.topP,
    },
    safetySettings: args.generationConfig.safetySettings,
  };

  const call = async (version: "v1" | "v1beta1") => {
    const res = await fetch(makeUrl(version), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      const err = new Error(
        `Vertex generateContent failed (${version}) (${res.status}): ${text || res.statusText}`,
      );
      (err as any).status = res.status;
      throw err;
    }

    const json = (await res.json().catch(() => null)) as any;
    const parts: Array<{ text?: string }> | undefined =
      json?.candidates?.[0]?.content?.parts;
    const text = parts?.map((p) => p.text).filter(Boolean).join("") ?? "";
    return { text };
  };

  let out: { text: string };
  try {
    out = await call("v1");
  } catch (e) {
    const status = typeof e === "object" && e !== null && "status" in e ? (e as any).status : undefined;
    if (status === 404) {
      out = await call("v1beta1");
    } else {
      throw e;
    }
  }

  const text = out.text.trim();
  if (!text) return;

  // Stream it out in small chunks for the existing SSE frontend.
  for (const chunk of chunkTextPreservingParagraphs(text)) {
    yield chunk;
  }
}

function createVertexDetectorSseStream(
  detectorConfig: VertexDetectorStreamConfig,
  args: {
    text: string;
    preset: string;
    creditsRemainingBefore: number;
  },
) {
  const apiKey = process.env.GOOGLE_CLOUD_API_KEY ?? process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GOOGLE_CLOUD_API_KEY (or GOOGLE_API_KEY)");
  }

  const endpointModel =
    process.env[detectorConfig.endpointModelEnvKey] ?? detectorConfig.defaultEndpointModel;
  const vertexProject = process.env[detectorConfig.projectEnvKey] ?? DEFAULT_VERTEX_PROJECT;
  const vertexLocation = process.env[detectorConfig.locationEnvKey] ?? DEFAULT_VERTEX_LOCATION;

  const encoder = new TextEncoder();
  const genConfig = vertexDetectorConfigForModel(endpointModel);
  const ai = new GoogleGenAI({ apiKey });
  const vertexAi = new GoogleGenAI({
    apiKey,
    vertexai: { project: vertexProject, location: vertexLocation },
  });

  const errorToString = (err: unknown) => {
    if (err instanceof Error) return err.message;
    try {
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  };

  const getStatusCode = (err: unknown): number | undefined => {
    if (typeof err === "object" && err !== null && "status" in err) {
      const s = (err as { status?: unknown }).status;
      if (typeof s === "number") return s;
    }
    return undefined;
  };

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const run = async (client: GoogleGenAIClient) => {
          const response = await client.models.generateContentStream({
            model: endpointModel,
            contents: [
              { role: "system", parts: [{ text: VERTEX_DETECTOR_SYSTEM_PROMPT }] },
              { role: "user", parts: [{ text: args.text }] },
            ],
            config: genConfig as Record<string, unknown>,
          });

          for await (const chunk of response) {
            const t = chunk.text;
            if (typeof t === "string" && t.length > 0) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    type: "content",
                    choices: [{ delta: { content: t } }],
                  })}\n\n`,
                ),
              );
            }
          }
        };

        try {
          await run(vertexAi);
        } catch (err) {
          const status = getStatusCode(err);
          if (status === 404) {
            // Retry without vertex routing (some setups accept API-key only)
            await run(ai);
          } else {
            throw err;
          }
        }

        controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
        controller.close();
      } catch (err) {
        // If SDK calls fail, try Vertex REST streaming with API key.
        try {
          for await (const t of vertexStreamGenerateContentWithApiKey({
            model: endpointModel,
            location: vertexLocation,
            systemPrompt: VERTEX_DETECTOR_SYSTEM_PROMPT,
            userText: args.text,
            generationConfig: genConfig,
            apiKey,
          })) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "content",
                  choices: [{ delta: { content: t } }],
                })}\n\n`,
              ),
            );
          }

          controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
          controller.close();
          return;
        } catch (oauthErr) {
          // Don't stream raw errors into the output; log server-side only.
          console.error(`[${detectorConfig.label} VERTEX] Stream error:`, errorToString(err));
          console.error(`[${detectorConfig.label} VERTEX] API key REST fallback error:`, errorToString(oauthErr));
        }

        // Tell the client we're "complete" with 0 credits used so UI can stop loading.
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "complete",
              credits_used: 0,
              credits_remaining: args.creditsRemainingBefore,
            })}\n\n`,
          ),
        );
        // IMPORTANT: don't throw/propagate here; end the stream cleanly so Next
        // doesn't turn it into a 500 "failed to pipe response".
        controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
        controller.close();
      }
    },
  });
}

export async function POST(request: NextRequest) {
  const isDev = process.env.NODE_ENV === 'development';
  const { userId } = await auth();

  if (!userId) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  // Frequency check
  const frequencyCheck = validateRequestFrequency(userId, 3);
  if (!frequencyCheck.valid) {
    return new Response(
      JSON.stringify({ error: frequencyCheck.error }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  // Parse body early to calculate word count for parallelization
  const body = await request.json();
  const { text: rawText, preset = "default", tone, targetDetector, options = {} } = body;
  const selectedPreset = preset || tone || "default";

  if (isDev) {
    console.log("\n" + "=".repeat(80));
    console.log("[STREAM API] ========== NEW HUMANIZATION REQUEST ==========");
    console.log("=".repeat(80));
    console.log(`[STREAM API] User ID: ${userId}`);
    console.log(`[STREAM API] Preset selected: ${selectedPreset}`);
    console.log(`[STREAM API] Request body keys: ${Object.keys(body).join(", ")}`);
  }

  if (!rawText || typeof rawText !== "string") {
    console.error("[STREAM API] ERROR: Text is required and must be a string");
    return new Response(
      JSON.stringify({ error: "Text is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const text = sanitizeText(rawText);
  if (isDev) {
    console.log(`[STREAM API] Original text length: ${rawText.length} characters`);
    console.log(`[STREAM API] Sanitized text length: ${text.length} characters`);
  }

  if (text.length < 100 || text.length > 50000) {
    console.error(`[STREAM API] ERROR: Text length ${text.length} is out of range (100-50,000)`);
    return new Response(
      JSON.stringify({ error: "Text must be between 100-50,000 characters" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  // CRITICAL: Check minimum word count (50 words) BEFORE any processing
  if (wordCount < 50) {
    console.error(`[STREAM API] ERROR: Word count ${wordCount} is below minimum of 50 words`);
    return new Response(
      JSON.stringify({ error: "Text must contain at least 50 words to be humanized" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const maxTokens = calculateMaxTokens(wordCount);

  // CRITICAL: Perform ALL validations FIRST before starting stream
  // This prevents API costs when validations fail
  if (isDev) {
    console.log(`[STREAM API] Word count: ${wordCount}`);
    console.log(`[STREAM API] Calculated max tokens: ${maxTokens}`);
  }

  // Get user from database FIRST (before starting stream)
  let dbUser = await db.user.findFirst({
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

  // Fallback: If user not found in DB (webhook delay), try to sync from Clerk
  if (!dbUser) {
    console.log("⚠️ [STREAM API] User not found in DB, attempting to sync from Clerk...");
    try {
      const clerkUser = await currentUser();
      if (clerkUser) {
        const email = clerkUser.emailAddresses[0]?.emailAddress || "";
        const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || clerkUser.username || "User";

        // Create user with default credits (300)
        const newUser = await db.user.create({
          data: {
            clerkId: userId,
            email,
            name,
            image: clerkUser.imageUrl,
            emailVerified: clerkUser.emailAddresses[0]?.verification?.status === 'verified',
            // credits will default to 300 from schema
          }
        });

        console.log(`✅ [STREAM API] Created missing user ${userId} on the fly`);

        // Refetch to get the full object structure with relations
        dbUser = await db.user.findFirst({
          where: { id: newUser.id },
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
    } catch (syncError) {
      console.error("❌ [STREAM API] Failed to sync user from Clerk:", syncError);
    }
  }

  // Validate user exists (before starting stream)
  if (!dbUser) {
    console.error(`[STREAM API] ERROR: User not found for userId: ${userId}`);
    return new Response(
      JSON.stringify({ error: "User not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  // Determine which user to bill (team owner if exists, otherwise the user)
  let billingUser = dbUser.team?.owner || dbUser;
  const isTeamMember = !!dbUser.team?.owner;

  if (isDev && isTeamMember) {
    console.log(`[STREAM API] User is team member. Billing owner: ${billingUser.id}`);
  }

  const refreshResult = await refreshMonthlyCreditsIfNeeded(billingUser);
  billingUser = refreshResult.user;
  if (refreshResult.resetApplied && isDev) {
    console.log(`[STREAM API] Refreshed monthly subscription credits for user ${billingUser.id}`);
  }

  const maxWords = billingUser.maxWordsPerRequest || 1000;
  if (isDev) {
    console.log(`[STREAM API] Max words allowed: ${maxWords}`);
  }

  // Validate word count limit (before starting stream)
  if (wordCount > maxWords) {
    console.error(`[STREAM API] ERROR: Word count ${wordCount} exceeds limit ${maxWords}`);
    return new Response(
      JSON.stringify({ error: `Text exceeds ${maxWords} words limit` }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Validate credits (before starting stream)
  const totalCredits = (billingUser.credits || 0) + (billingUser.extraCredits || 0);
  if (totalCredits < wordCount) {
    console.error(`[STREAM API] ERROR: Insufficient credits. Have: ${totalCredits} (Plan: ${billingUser.credits}, Extra: ${billingUser.extraCredits}), Need: ${wordCount}`);
    return new Response(
      JSON.stringify({ error: "Insufficient credits" }),
      { status: 402, headers: { "Content-Type": "application/json" } }
    );
  }

  // Validate preset access - only pro and ultra users can use presets (except "default" which is available to all)
  const effectivePlan = billingUser.subscriptionPlan;
  if (selectedPreset !== "default" && (effectivePlan === "basic" || !effectivePlan)) {
    // Basic users can only use "default" preset, other presets require pro/ultra
    console.error(`[STREAM API] Preset access denied for ${effectivePlan || "free"} user. Preset: ${selectedPreset}`);
    return new Response(
      JSON.stringify({ 
        error: "This preset is only available for Pro and Ultra subscribers. Please upgrade to access all presets.",
        errorCode: "PRESET_LOCKED",
        upgradeRequired: true,
      }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  // Rate limiting check (before starting stream)
  // Use billing user's plan for limits, but requesting user's ID for tracking
  const rateLimitConfig = getRateLimitForPlan(billingUser.subscriptionPlan);
  const rateLimit = checkRateLimit(userId, rateLimitConfig);

  if (!rateLimit.allowed) {
    console.error(`[STREAM API] ERROR: Rate limit exceeded for user: ${userId}`);
    return new Response(
      JSON.stringify({ 
        error: `Rate limit exceeded. Please wait ${rateLimit.retryAfter} seconds.`,
        retryAfter: rateLimit.retryAfter,
      }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }
  // All validations passed - NOW we can safely start the stream
  if (isDev) {
    console.log(`[STREAM API] ✓ All validations passed`);
    console.log(`[STREAM API] Credits available: ${totalCredits} (Plan: ${billingUser.credits}, Extra: ${billingUser.extraCredits}), Credits needed: ${wordCount}`);
    console.log(`[STREAM API] Starting stream with model: ${options.model || DEFAULT_MODEL}`);
  }

  // Start stream ONLY after all validations pass
  let stream: ReadableStream;
  try {
    if (targetDetector === "gptzero") {
      stream = createVertexDetectorSseStream(GPTZERO_VERTEX_CONFIG, {
        text,
        preset: selectedPreset,
        creditsRemainingBefore: totalCredits,
      });
    } else if (targetDetector === "turnitin") {
      stream = createVertexDetectorSseStream(TURNITIN_VERTEX_CONFIG, {
        text,
        preset: selectedPreset,
        creditsRemainingBefore: totalCredits,
      });
    } else {
      stream = await aiStudios.humanizeTextStream(text, {
        temperature: options.temperature,
        maxTokens: maxTokens,
        preset: selectedPreset,
        tone: selectedPreset,
        targetDetector: targetDetector,
        model: options.model || DEFAULT_MODEL,
        ...options,
      });
    }
  } catch (streamError) {
    // If stream fails to start, return error without charging user
    console.error(`[STREAM API] ERROR: Failed to start stream:`, streamError);
    return new Response(
      JSON.stringify({ 
        error: "Failed to start humanization stream. Please try again.",
        details: streamError instanceof Error ? streamError.message : String(streamError),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Stream is ready, continue with normal processing
    if (isDev) {
      console.log("[STREAM API] Stream started successfully, forwarding response to client...");
    }

    // Track text in background, forward stream immediately
    let fullText = "";
    let chunkBuffer = "";

    const transformedStream = stream.pipeThrough(
      new TransformStream({
        transform(chunk, controller) {
          // CRITICAL: Forward chunk IMMEDIATELY
          controller.enqueue(chunk);

          // Parse in background for tracking
          try {
            const text = new TextDecoder().decode(chunk);
            const lines = text.split("\n");

            for (const line of lines) {
              if (line.startsWith("data: ") && line !== "data: [DONE]") {
                try {
                  const data = line.slice(6);
                  const json = JSON.parse(data);

                  // Handle different chunk types: thought, content, or default (for backward compatibility)
                  // Only track content chunks for fullText (thoughts are separate)
                  let content: string | undefined;

                  if (json.type === "content" || !json.type) {
                    // Content chunks - these go into fullText for tracking
                    content = json.choices?.[0]?.delta?.content;
                  } else if (json.type === "thought") {
                    // Thought chunks - don't add to fullText, but log for debugging
                    const thoughtContent = json.choices?.[0]?.delta?.content;
                    if (isDev && thoughtContent) {
                      console.log(`[STREAM] Thought chunk received (${thoughtContent.length} chars)`);
                    }
                    continue; // Don't track thoughts in fullText
                  } else if (json.type === "thoughts_complete") {
                    if (isDev) {
                      console.log(`[STREAM] Thoughts complete marker received`);
                    }
                    continue; // Don't track markers
                  }

                  if (content) {
                    fullText += content;
                    chunkBuffer += content;

                    // Log every few words to verify streaming (dev only)
                    if (isDev && (chunkBuffer.length > 20 || content.includes(".") || content.includes("!"))) {
                      console.log(`[STREAM] Forwarded content: "${chunkBuffer.substring(0, 50)}..."`);
                      chunkBuffer = "";
                    } else if (!isDev) {
                      chunkBuffer = "";
                    }
                  }
                } catch (e) {
                  // Ignore parse errors
                }
              }
            }
          } catch (e) {
            // Ignore any errors in tracking
          }
        },

        async flush(controller) {
          // Check if we actually generated content
          const generatedWordCount = fullText.trim().split(/\s+/).filter(Boolean).length;

          // If no content was generated (or very little, indicating failure), don't deduct credits
          if (generatedWordCount < 50) {
             if (isDev) {
                console.log(`[STREAM API] Generated content too short (${generatedWordCount} words). Skipping credit deduction.`);
             }

             controller.enqueue(
                new TextEncoder().encode(
                  `data: ${JSON.stringify({
                    type: "complete",
                    credits_used: 0,
                    credits_remaining: (billingUser.credits || 0) + (billingUser.extraCredits || 0),
                  })}\n\n`
                )
              );
              return;
          }

          // Send completion message FIRST (non-blocking)
          if (!dbUser) {
            console.error("[STREAM API] ERROR: dbUser is null in flush");
            return;
          }

          // Calculate deduction
          let newCredits = billingUser.credits || 0;
          let newExtraCredits = billingUser.extraCredits || 0;
          let remainingToDeduct = wordCount;

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

          // Send completion immediately
          controller.enqueue(
            new TextEncoder().encode(
              `data: ${JSON.stringify({
                type: "complete",
                credits_used: wordCount,
                credits_remaining: creditsRemaining,
              })}\n\n`
            )
          );
          // Stream closes automatically when flush completes - user sees completion immediately

          // DB operations - await to ensure process doesn't exit before saving
          // This delays the end of the stream slightly but ensures data consistency
          try {
            if (isDev) {
              console.log("\n" + "=".repeat(80));
              console.log("[STREAM API] ========== STREAM COMPLETED ==========");
              console.log("=".repeat(80));
              console.log(`[STREAM API] Humanized text length: ${fullText.length} characters`);
              console.log(`[STREAM API] Humanized text word count: ${fullText.trim().split(/\s+/).filter(Boolean).length} words`);
              console.log(`[STREAM API] Credits deducted: ${wordCount}`);
              console.log(`[STREAM API] New Balance - Plan: ${newCredits}, Extra: ${newExtraCredits}`);
              console.log(`[STREAM API] Preset used: ${selectedPreset}`);
            }

            // Update credits (on billing user)
            await db.user.update({
              where: { id: billingUser.id },
              data: { 
                credits: newCredits,
                extraCredits: newExtraCredits
              },
            });

            // Create history (associate with requesting user)
            await db.humanizerHistory.create({
              data: {
                originalText: rawText || "", // Ensure not null
                humanizedText: fullText || text || "", // Ensure not null
                preset: selectedPreset,
                tokensUsed: wordCount,
                aiScore: 100,
                metadata: { 
                  source: "gemini-stream", 
                  preset: selectedPreset,
                  originalLength: text.length,
                  humanizedLength: fullText.length,
                  billedTo: isTeamMember ? billingUser.id : undefined
                },
                userId: dbUser.id,
              },
            });

            // Track usage in Polar for billing
            // Track against billing user (owner) so it counts towards their usage
            try {
              const result = await trackWordUsage(billingUser.id, wordCount, {
                preset: selectedPreset,
                plan: billingUser.subscriptionPlan,
                model: "gemini",
                stream: true,
                teamMemberId: isTeamMember ? dbUser.id : undefined
              });

              if (!result.success) {
                console.error(`[STREAM API] Failed to track usage in Polar: ${result.error}`);
              } else if (isDev) {
                console.log(`[STREAM API] Successfully tracked ${wordCount} words in Polar`);
              }
            } catch (polarError) {
              console.error(`[STREAM API] Error tracking usage in Polar:`, polarError);
            }

            if (isDev) {
              console.log(`[STREAM API] Database record saved successfully`);
              console.log("=".repeat(80) + "\n");
            }
          } catch (dbError) {
            console.error("[STREAM API] ERROR: Database save failed");
            console.error("[STREAM API] Error details:", dbError);
          }
        },
      })
    );

    return new Response(transformedStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("\n" + "=".repeat(80));
    console.error("[STREAM API] ========== UNEXPECTED ERROR ==========");
    console.error("=".repeat(80));
    console.error("[STREAM API] Error type:", error instanceof Error ? error.constructor.name : typeof error);
    console.error("[STREAM API] Error message:", error instanceof Error ? error.message : String(error));
    console.error("[STREAM API] Error stack:", error instanceof Error ? error.stack : "No stack trace");
    console.error("=".repeat(80) + "\n");

    return new Response(
      JSON.stringify({ 
        error: "Failed to humanize text. Both Gemini and OpenAI failed.",
        details: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
