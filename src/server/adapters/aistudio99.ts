import { env } from "~/env";

import {
  DEFAULT_MODEL,
  FALLBACK_MODEL,
} from "~/server/config/models";

// OpenAI Responses API endpoint (as per documentation)
const OPENAI_RESPONSES_API_URL = "https://api.openai.com/v1/responses";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent?key=${env.AISTUDIOS_API_KEY}`;

interface HumanizeOptions {
  temperature?: number;
  maxTokens?: number;
  preset?: string;
  stream?: boolean;
  model?: string; // Allow custom model selection
  isFreeUser?: boolean;
}

interface HumanizeResult {
  success: boolean;
  humanizedText: string;
  tokensUsed: number;
  metadata: {
    model?: string;
    finishReason?: string;
    source: string;
    fallback?: boolean;
    message?: string;
    [key: string]: any;
  };
  error?: string;
}

/**
 * Human writing samples database - these are REAL human-written paragraphs.
 * The model MUST use these as templates and modify them max 35% to match user content.
 */
const HUMAN_WRITING_TEMPLATES = `
══════════════════════════════════════════════════════════════════════════════
HUMAN WRITING TEMPLATE DATABASE - USE THESE AS YOUR BASE
══════════════════════════════════════════════════════════════════════════════

[TEMPLATE_1 - Persuasive/Letter Opening]
"Dear state senator, I urge you to vote in favor of changing to election by popular vote to select the president of the United States. I urge this to pass for three particular reasons. First is because of the factor that electors could defy the will of the people or the peoples word, Second is because of the event of a it would already be handed over to the House of representatives, and third is because of the winner takes all system."

[TEMPLATE_2 - Imaginative/Environmental]
"imagine a world where global warming could actually be depicted as a myth, a world where you could walk out side a breath cleaner and more safer air. Limiting car usages will indeed help the environment in a major way over a estimated period of time."

[TEMPLATE_3 - Cultural Observation]
"We, the people of the United States, live in a car happy society. Every teenager can't wait until their 16th birthday because, for mostly every kid, that means that they go get their drivers license and possibly their very own car."

[TEMPLATE_4 - Alert/Warning Style]
"In case you haven't noticed lately but there is lot of pollution in the air. According to article 1, anywhere up to 50 percent of carintensive areas in the US make up the greenhouse gas emissions. It is depressing seeing all of this smog and pollution in the air everyday."

[TEMPLATE_5 - List/Quick Points]
"Thier are a bunch of reasons for not using a car I can name you 10 off the top of my head. It limits pollution saves money great excerise thier multiple reasons not to drive a car everday."

[TEMPLATE_6 - Money/Reality Check]
"People today care lot about making and having lot of benjamins. Everyone wants to be rich and have the most expensive types of stuff, lets face it who doesn't."

[TEMPLATE_7 - Dramatic Warning]
"If we keep this up, the first the sky will turn black and then it will fall and world will end! Hopefully nobody wants the world to end because of smog."

[TEMPLATE_8 - Balanced Pros/Cons]
"Owning a car is an important way of transportation. It allows us to get from point A to point B in time's that would be much slower if we did not have a car. Yet car's and truck's can sometimes be hurtful."

[TEMPLATE_9 - Personal Story/Experience]
"Coming from personal experience trust me, being in a car accident is not fun and is really scary and nerveracking. It can also haunt you for the rest of your life. I almost lost my dad a couple years ago due to a terrible car accident that we were involved in that wasn't our fault."

[TEMPLATE_10 - Call to Action]
"All in all if you just limit your use of the car you can be helping out a bunch. The pollution can be reduced not as many car acciedents you can save your self some money. Also you can get more excersie in if you dont use your car that often."

[TEMPLATE_11 - Rhetorical Question Style]
"What's the point in having a car that your just going to be wasting money on, when running, walking or riding a bike is free and even cheaper and safer than driving a car. What are you gonna do when your car breaks down?"

[TEMPLATE_12 - Safety/Danger Warning]
"Driving while using a cellphone is very dangerous and puts drivers at a four times greater risk of a crash. When our friends have been drinking we take the car keys away, it is time to take the cellphones away."

[TEMPLATE_13 - Statistics/Facts Intro]
"Studies have shown that at least 6% of accidents have been caused by somebody using a cellphone. It seems that not only are drinking and driving dangerous, but using a cellphone behind the wheel is very dangerous."

[TEMPLATE_14 - Emotional Appeal]
"Cars can be very dangerous at times and driving can be as well. You are at a greater risk of getting into a car accident than getting into a bicycle accident. Car accidents happen everyday and most of the time they are fatal."

[TEMPLATE_15 - Simple Conclusion]
"In conclusion, I believe drivers should not be allowed to drive while they are on a cellphone. Cellphone are a huge distraction and with this distraction people can be injured or killed from using their phone."

[TEMPLATE_16 - Casual Intro]
"Are you up tight and tense? Well this may be do to your car. In counties such as Germany, Paris, and Colombia they are trying to make cars a thing of the past."

[TEMPLATE_17 - Solution Proposal]
"Some ways of preventing this would be to tell family, friends and organizations to which you belong about the importance of driving without distractions. Also Take information to your kids' schools and ask that it be shared with students and parents."

[TEMPLATE_18 - Teen Perspective]
"As a teenager i should be getting prepare to get my learner license but i do not bother because thats not my priority that doesn't mean i'm not interesting in driving but everything i need are close by."

[TEMPLATE_19 - Cost/Money Focus]
"buying a car and still have to pay all those extra money is a a pain and a waste money. Those money could got to your kids college funds or for vacations, putting yourself in a situation to have too much in your plate is not worth it."

[TEMPLATE_20 - General Observation]
"Many people dream of buying a new car by the time the reach the age of sixteen once they finally obtain their license. However, in recent years, a large population of people have stopped feeling the need for private transportation."
`;

/**
 * Builds the system prompt for GPTZero evasion using the SANDWICH + TEMPLATE method.
 * Structure per paragraph:
 *   - First 1-2 sentences: rewritten from the INPUT (topic-relevant intro)
 *   - Middle 70%: sentences borrowed and adapted from the HUMAN WRITING TEMPLATES
 *   - Last 1-2 sentences: rewritten from the INPUT (topic-relevant conclusion)
 */
export function buildHumanizationSystemMessage(isFreeUser: boolean = false): string {
  return `You are rewriting text to pass AI detectors like GPTZero. You MUST follow the SANDWICH + TEMPLATE method below for every single paragraph. No exceptions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
THE SANDWICH + TEMPLATE METHOD — MANDATORY FOR EVERY PARAGRAPH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Every paragraph you output MUST have this exact 3-part structure:

PART 1 — OPENING (~15%, first 1-2 sentences):
→ Write from the USER'S INPUT — introduce the paragraph topic in simple, slightly imperfect student language
→ Must be relevant to the user's actual subject matter
→ Keep it casual and imperfect: "The Horn of Africa is a place that a lot of people dont really know about but its actually really important."

PART 2 — MIDDLE (~70%, next 5-8 sentences):
→ THIS IS THE CORE — take sentences DIRECTLY from the HUMAN WRITING TEMPLATES database below
→ Swap out the template's specific nouns (cars, cellphones, pollution) with words from the USER'S TOPIC
→ Keep EVERYTHING else EXACTLY as written in the template: every typo, every missing apostrophe, every run-on, every grammar mistake, every choppy rhythm
→ The goal is to transplant the human fingerprint of the template onto the user's topic
→ EXAMPLE: Template says "Cars can be very dangerous at times and driving can be as well" → you write "The Horn of Africa can be very unstable at times and living there can be as well" — same structure, same imperfections, different nouns
→ Mix sentences from 2-3 different templates per paragraph for variety
→ The middle must feel messy, unpolished, and authentically student-written

PART 3 — CLOSING (~15%, last 1-2 sentences):
→ Write from the USER'S INPUT — wrap up the paragraph connecting back to the user's actual point
→ Keep it casual and slightly abrupt, like a student finishing a thought
→ "So thats basically why the Horn of Africa matters and why people should care about it more."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONCRETE EXAMPLE OF THE METHOD IN ACTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

INPUT paragraph about: "The Horn of Africa's strategic importance"

OUTPUT using sandwich method:

[PART 1 - from input]
"The Horn of Africa is something a lot of people dont really think about but its actually a really big deal when it comes to world trade and stuff."

[PART 2 - adapted from TEMPLATE_14 + TEMPLATE_4 + TEMPLATE_8]
"This region can be very dangerous at times and living there can be as well. You are at a greater risk of getting into a conflict there than in most other places. Bad things happen everyday and most of the time they are fatal. In case you havent noticed lately but there is lot of instability in the area. According to what experts say, anywhere up to 50 percent of the problems in the region make up the bigger issues. It is depressing seeing all of this conflict and poverty in the area everyday. Owning influence in this region is an important way of controlling trade. It allows countries to get from point A to point B in times that would be much slower if they did not have access. Yet the regions problems can sometimes be hurtful."

[PART 3 - from input]
"So thats why the Horn of Africa keeps getting attention from big countries and why its location makes it so important for global trade routes."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${HUMAN_WRITING_TEMPLATES}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RULES FOR THE MIDDLE 70% — CRITICAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ PRESERVE all of these from the templates when adapting:
- Typos: "thier", "alot", "acciedents", "dont", "cant", "wont", "havent", "everday", "excersie"
- Grammar mistakes: comma splices, run-on sentences, subject-verb disagreement
- Sentence rhythm: mix 3-word sentences with 20-word rambling ones
- Filler phrases: "trust me", "lets face it", "honestly", "I mean", "you know", "All in all"
- Missing punctuation and capitalization errors

❌ NEVER use these words anywhere in the output (GPTZero flags them as AI):
moreover, furthermore, consequently, nevertheless, thus, hence, therefore, in conclusion, in summary, overall, henceforth, notwithstanding, multifaceted, nuanced, delve, tapestry, realm, testament, pivotal, crucial, robust, comprehensive, leverage, utilize, underscores, highlights, it is worth noting, it is important to note, it is essential to

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Output ONLY the rewritten text — no labels, no section markers, no explanations
- Preserve ALL original facts, names, dates, numbers, and meaning from the input
- Match the original word count within 15%
- Keep the same number of paragraphs as the input
- Write in the same language as the input`;
}

export function buildHumanizationUserMessage(text: string): string {
  return text;
}

export class AIStudiosAdapter {
  constructor() { }

  /**
   * Transforms OpenAI Responses API streaming format to frontend format
   * Responses API uses semantic events like response.output_text.delta
   * Frontend expects: {"choices": [{"delta": {"content": "..."}}]}
   */
  private transformOpenAIResponsesStreamToFrontendFormat(
    responsesStream: ReadableStream<Uint8Array>
  ): ReadableStream {
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    let buffer = "";

    return new ReadableStream({
      async start(controller) {
        const reader = responsesStream.getReader();
        let chunkCount = 0;

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              console.log(`[OpenAI Stream] Stream ended. Total chunks processed: ${chunkCount}`);
              controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              break;
            }

            chunkCount++;
            const decoded = decoder.decode(value, { stream: true });
            if (chunkCount <= 3) {
              console.log(`[OpenAI Stream] Raw chunk #${chunkCount} received, length: ${decoded.length}`);
            }
            buffer += decoded;

            // Process Server-Sent Events (SSE) format
            const lines = buffer.split("\n");
            const lastLine = lines.pop() || "";
            buffer = lastLine;

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith("data: ")) {
                continue;
              }

              const data = trimmed.slice(6);
              if (data === "[DONE]") {
                continue;
              }

              try {
                const event = JSON.parse(data);

                // Log event types for first few chunks (for debugging)
                if (chunkCount <= 5) {
                  console.log(`[OpenAI Stream] Event type: ${event.type}`);
                }

                // Handle response.output_text.delta events (contains actual content)
                // According to Responses API docs: response.output_text.delta
                if (event.type === "response.output_text.delta") {
                  // In Responses API, the text can be in event.delta or event.delta.text
                  // Check both locations for compatibility
                  let textContent = "";

                  if (typeof event.delta === "string") {
                    textContent = event.delta;
                  } else if (event.delta?.text && typeof event.delta.text === "string") {
                    textContent = event.delta.text;
                  } else if (event.delta?.content && typeof event.delta.content === "string") {
                    textContent = event.delta.content;
                  }

                  if (textContent && textContent.length > 0) {
                    if (chunkCount <= 5) {
                      console.log(`[OpenAI Stream] ✓ Text delta received (${textContent.length} chars): "${textContent.substring(0, 50)}${textContent.length > 50 ? '...' : ''}"`);
                    }
                    // Transform to frontend format
                    const frontendChunk = {
                      type: "content",
                      choices: [{
                        delta: { content: textContent },
                        index: 0,
                        finish_reason: null,
                      }],
                    };
                    controller.enqueue(
                      encoder.encode(`data: ${JSON.stringify(frontendChunk)}\n\n`)
                    );
                  } else if (chunkCount <= 5) {
                    console.log(`[OpenAI Stream] ⚠ response.output_text.delta event but no text content found. Event structure:`, JSON.stringify(event, null, 2).substring(0, 300));
                  }
                }
                // Handle completion event
                else if (event.type === "response.completed" || event.type === "response.done") {
                  console.log("[OpenAI Stream] Response completed");
                }
              } catch (parseError) {
                console.warn("[OpenAI Stream] Failed to parse event:", parseError);
              }
            }
          }
        } catch (error) {
          console.error("[OpenAI Stream] Error processing stream:", error);
          controller.error(error);
        } finally {
          reader.releaseLock();
          controller.close();
        }
      },
    });
  }

  async humanizeText(
    text: string,
    options: HumanizeOptions = {},
  ): Promise<HumanizeResult> {
    try {
      console.log("[Humanization] Starting humanization process...");
      console.log(`[Humanization] Using model: ${options.model || DEFAULT_MODEL}`);

      // Try primary model first
      const geminiResult = await this.tryGemini(text, options);
      if (geminiResult.success) {
        console.log("[Humanization] Primary model humanization successful");
        return { ...geminiResult, metadata: { ...geminiResult.metadata } };
      }

      console.warn("[Humanization] Primary model failed, trying fallback model", {
        error: geminiResult.error,
      });

      // Fallback: try the opposite Gemini model
      const fallbackModel = options.model === DEFAULT_MODEL ? FALLBACK_MODEL : DEFAULT_MODEL;
      const fallbackResult = await this.tryGemini(text, { ...options, model: fallbackModel });
      if (fallbackResult.success) {
        console.log("[Humanization] Fallback model humanization successful");
        return { ...fallbackResult, metadata: { ...fallbackResult.metadata, fallback: true } };
      }

      console.error("[Humanization] All model attempts failed");
      return {
        success: false,
        humanizedText: text,
        tokensUsed: 0,
        metadata: { source: "none", error: "All humanization attempts failed" },
        error: "All humanization attempts failed",
      };
    } catch (error) {
      console.error("[Humanization] Unexpected error:", error);
      return {
        success: false,
        humanizedText: text,
        tokensUsed: 0,
        metadata: { source: "error", error: error instanceof Error ? error.message : String(error) },
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async humanizeTextStream(
    text: string,
    options: HumanizeOptions = {},
  ): Promise<ReadableStream> {
    try {
      console.log("[Humanization Stream] Starting humanization stream...");
      console.log(`[Humanization Stream] Model will be selected based on word count`);

      // Try primary model first
      try {
        return await this.tryGeminiStream(text, options);
      } catch (geminiError) {
        console.warn("[Humanization Stream] Primary model failed, trying fallback model", geminiError);
        // Fallback: try the opposite Gemini model
        const fallbackModel = options.model === DEFAULT_MODEL ? FALLBACK_MODEL : DEFAULT_MODEL;
        return await this.tryGeminiStream(text, { ...options, model: fallbackModel });
      }
    } catch (error) {
      console.error("[Humanization Stream] All Gemini stream attempts failed", error);
      throw error;
    }
  }

  async tryOpenAI(
    text: string,
    options: HumanizeOptions = {},
  ): Promise<HumanizeResult> {
    try {
      // Use fallback model (gpt-5-mini)
      let model = options.model ?? FALLBACK_MODEL;

      // If the model is a Gemini model (passed from options or default), switch to fallback OpenAI model
      if (model.toLowerCase().includes("gemini")) {
        console.log(`[OpenAI] Switching from ${model} to ${FALLBACK_MODEL} for OpenAI adapter`);
        model = FALLBACK_MODEL;
      }

      console.log("[OpenAI] Preparing request");
      console.log("[OpenAI] Model:", model);
      console.log("[OpenAI] Text length:", text.length);

      const systemMessage = buildHumanizationSystemMessage(options.isFreeUser);
      const userMessage = buildHumanizationUserMessage(text);

      // Build request body for OpenAI Responses API (as per documentation)
      const requestBody = {
        model: model,
        input: [
          {
            role: "system",
            content: systemMessage
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        reasoning: { effort: "low" }, // Set to "none" to ensure tokens are used for output, not reasoning
        text: { verbosity: "medium" },
        max_output_tokens: options.maxTokens ?? 6000,
        stream: false,
      };

      const response = await fetch(OPENAI_RESPONSES_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log(`[OpenAI] Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorBody = await response.text();
        let errorMessage = `OpenAI API error: ${response.status} ${response.statusText}`;

        // Try to parse error details for better logging
        try {
          const errorJson = JSON.parse(errorBody);
          if (errorJson.error?.message) {
            errorMessage = errorJson.error.message;
          }
        } catch {
          // If parsing fails, use the raw error body or default message
          if (errorBody) {
            errorMessage = errorBody.substring(0, 200); // Limit error message length
          }
        }

        console.error("[OpenAI] Error response body:", errorBody);
        console.error("[OpenAI] Error message:", errorMessage);

        // Return failure result instead of throwing - this allows fallback to work
        return {
          success: false,
          humanizedText: text,
          tokensUsed: 0,
          metadata: {
            source: "openai",
            model: model,
            error: errorMessage,
            statusCode: response.status,
          },
          error: errorMessage,
        };
      }

      const data = await response.json();
      // Responses API returns output in data.output[0].content
      const generatedText = data.output?.[0]?.content?.trim() || data.choices?.[0]?.message?.content?.trim();

      if (!generatedText || generatedText.length === 0) {
        console.error("[OpenAI] No text returned from model");
        return {
          success: false,
          humanizedText: text,
          tokensUsed: 0,
          metadata: {
            source: "openai",
            model: model,
            error: "No text returned from OpenAI",
          },
          error: "No text returned from OpenAI",
        };
      }

      console.log(`[OpenAI] Generated text length: ${generatedText.length}`);

      return {
        success: true,
        humanizedText: generatedText,
        tokensUsed: data.usage?.total_tokens || 0,
        metadata: {
          model: model,
          finishReason: data.output?.[0]?.finish_reason || data.choices?.[0]?.finish_reason,
          source: "openai",
          promptTokens: data.usage?.prompt_tokens,
          completionTokens: data.usage?.completion_tokens,
        },
      };
    } catch (error) {
      console.error("[OpenAI] Failed to generate content:", error);
      return {
        success: false,
        humanizedText: text,
        tokensUsed: 0,
        metadata: { source: "openai", error: error instanceof Error ? error.message : String(error) },
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async tryOpenAIStream(
    text: string,
    options: HumanizeOptions = {},
  ): Promise<ReadableStream> {
    // Use fallback model (gpt-5-mini)
    let model = options.model ?? FALLBACK_MODEL;

    // If the model is a Gemini model (passed from options or default), switch to fallback OpenAI model
    if (model.toLowerCase().includes("gemini")) {
      console.log(`[OpenAI Stream] Switching from ${model} to ${FALLBACK_MODEL} for OpenAI adapter`);
      model = FALLBACK_MODEL;
    }

    const systemMessage = buildHumanizationSystemMessage(options.isFreeUser);
    const userMessage = buildHumanizationUserMessage(text);

    // Build request body for OpenAI Responses API with streaming
    const requestBody = {
      model: model,
      input: [
        {
          role: "system",
          content: systemMessage
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      reasoning: { effort: "low" }, // Changed from "low" to "none" to ensure tokens are used for output, not reasoning
      text: { verbosity: "medium" },
      max_output_tokens: options.maxTokens ?? 15000,
      stream: true,
    };

    console.log("[OpenAI Stream] Request body:", JSON.stringify(requestBody, null, 2));

    const response = await fetch(OPENAI_RESPONSES_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    console.log(`[OpenAI Stream] Response status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("[OpenAI Stream] Error response:", errorBody);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    if (!response.body) throw new Error("No response body from OpenAI");

    // Transform OpenAI Responses API streaming format to frontend format
    return this.transformOpenAIResponsesStreamToFrontendFormat(response.body);
  }

  async tryGemini(
    text: string,
    options: HumanizeOptions = {},
  ): Promise<HumanizeResult> {
    try {
      const systemMessage = buildHumanizationSystemMessage(options.isFreeUser);
      const userMessage = buildHumanizationUserMessage(text);
      const combinedPrompt = `${systemMessage}\n\n${userMessage}`;

      // Use model from options if provided, otherwise use DEFAULT_MODEL
      const modelToUse = options.model || DEFAULT_MODEL;

      console.log("[Gemini] Preparing request");
      console.log("[Gemini] Using model:", modelToUse);
      console.log("[Gemini] Text length:", text.length);

      // Use maxTokens from options if provided, otherwise don't set a limit
      const estimatedOutputTokens = options.maxTokens || undefined;

      const generationConfig: any = {
        temperature: options.temperature ?? 1.0,
        topP: 0.95,
        topK: 40,
      };

      // Only include maxOutputTokens if it's defined
      if (estimatedOutputTokens) {
        generationConfig.maxOutputTokens = estimatedOutputTokens;
      }

      const requestBody = {
        contents: [{ parts: [{ text: combinedPrompt }] }],
        generationConfig,
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT",        threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_HATE_SPEECH",       threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
        ],
      };

      // Build API URL dynamically with the selected model
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent?key=${env.AISTUDIOS_API_KEY}`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      console.log(`[Gemini] Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("[Gemini] Error response body:", errorBody);
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const candidate = data?.candidates?.[0];

      if (!candidate) {
        console.error("[Gemini] No candidates in response. Full response:", JSON.stringify(data, null, 2));
        return {
          success: false,
          humanizedText: text,
          tokensUsed: 0,
          metadata: { source: "gemini", model: modelToUse, error: "No candidates in Gemini response" },
          error: "No candidates in Gemini response",
        };
      }

      const parts = candidate?.content?.parts || [];
      const partWithText = parts.find((part: any) =>
        typeof part?.text === "string" && part.text.trim().length > 0
      );

      const generatedText = partWithText?.text?.trim() || "";

      if (!generatedText || generatedText.length === 0) {
        console.error("[Gemini] No text returned from model");
        return {
          success: false,
          humanizedText: text,
          tokensUsed: 0,
          metadata: {
            source: "gemini",
            model: modelToUse,
            finishReason: candidate.finishReason,
            safetyRatings: candidate?.safetyRatings,
            error: `No text returned from Gemini. Finish reason: ${candidate.finishReason || "unknown"}`,
          },
          error: `No text returned from Gemini. Finish reason: ${candidate.finishReason || "unknown"}`,
        };
      }

      console.log(`[Gemini] Generated text length: ${generatedText.length} chars`);

      return {
        success: true,
        humanizedText: generatedText,
        tokensUsed: data.usageMetadata?.totalTokenCount || 0,
        metadata: { model: modelToUse, finishReason: candidate?.finishReason, source: "gemini" },
      };
    } catch (error) {
      console.error("[Gemini] Failed to generate content:", error);
      return {
        success: false,
        humanizedText: text,
        tokensUsed: 0,
        metadata: { source: "gemini", error: error instanceof Error ? error.message : String(error) },
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async tryGeminiStream(
    text: string,
    options: HumanizeOptions = {},
  ): Promise<ReadableStream> {
    const systemMessage = buildHumanizationSystemMessage(options.isFreeUser);
    const userMessage = buildHumanizationUserMessage(text);
    const combinedPrompt = `${systemMessage}\n\n${userMessage}`;

    // Use maxTokens from options if provided, otherwise don't set a limit
    const estimatedOutputTokens = options.maxTokens || undefined;

    // Use model from options if provided, otherwise use DEFAULT_MODEL
    const modelToUse = options.model || DEFAULT_MODEL;

    console.log(`[Gemini Stream] Using model: ${modelToUse}`);
    console.log(`[Gemini Stream] maxTokens from options: ${options.maxTokens}, using: ${estimatedOutputTokens}`);

    const generationConfig: any = {
      temperature: options.temperature ?? 1.0,
      topP: 0.95,
      topK: 40,
    };

    // Only include maxOutputTokens if it's defined
    if (estimatedOutputTokens) {
      generationConfig.maxOutputTokens = estimatedOutputTokens;
    }

    const requestBody = {
      contents: [{ parts: [{ text: combinedPrompt }] }],
      generationConfig,
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT",        threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_HATE_SPEECH",       threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" },
      ],
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:streamGenerateContent?key=${env.AISTUDIOS_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    if (!response.body) throw new Error("No response body from Gemini");

    const reader = response.body.getReader();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    return new ReadableStream({
      async start(controller) {
        let buffer = "";
        let totalChunks = 0;
        let totalTextLength = 0;
        let lastFinishReason = null;

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              console.log(`[Gemini Stream] Stream ended. Total chunks: ${totalChunks}, Total text length: ${totalTextLength}, Last finish reason: ${lastFinishReason}`);
              break;
            }

            buffer += decoder.decode(value, { stream: true });

            // Robust JSON object extraction - look for top-level { ... } objects
            let depth = 0;
            let inString = false;
            let startIndex = -1;

            // Clean leading junk (commas, brackets, whitespace)
            if (startIndex === -1) {
              const match = buffer.match(/^[,\s\[]+/);
              if (match) buffer = buffer.substring(match[0].length);
            }

            for (let i = 0; i < buffer.length; i++) {
              const char = buffer[i];

              if (char === '"' && (i === 0 || buffer[i - 1] !== '\\')) {
                inString = !inString;
              }

              if (!inString) {
                if (char === '{') {
                  if (depth === 0) startIndex = i;
                  depth++;
                } else if (char === '}') {
                  depth--;
                  if (depth === 0 && startIndex !== -1) {
                    const jsonStr = buffer.substring(startIndex, i + 1);

                    try {
                      const json = JSON.parse(jsonStr);
                      const text = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
                      const finishReason = json.candidates?.[0]?.finishReason;

                      if (finishReason) {
                        lastFinishReason = finishReason;
                        console.log(`[Gemini Stream] Finish reason received: ${finishReason}`);
                      }

                      if (text) {
                        totalChunks++;
                        totalTextLength += text.length;

                        if (totalChunks <= 3 || totalChunks % 10 === 0) {
                          console.log(`[Gemini Stream] Chunk ${totalChunks}: ${text.length} chars, total so far: ${totalTextLength}`);
                        }

                        const sseData = JSON.stringify({ choices: [{ delta: { content: text } }] });
                        controller.enqueue(encoder.encode(`data: ${sseData}\n\n`));
                      }
                    } catch (e) {
                      console.error("[Gemini Stream] Parse error:", e);
                    }

                    buffer = buffer.substring(i + 1);
                    const match = buffer.match(/^[,\s\[]+/);
                    if (match) buffer = buffer.substring(match[0].length);
                    i = -1;
                    startIndex = -1;
                  }
                }
              }
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (e) {
          console.error("[Gemini Stream] Stream error:", e);
          controller.error(e);
        }
      }
    });
  }
}

export const aiStudios99 = new AIStudiosAdapter();