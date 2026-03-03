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
 * Builds the system message for AI text humanization
 * Low-fidelity email style with intentional imperfections for 0% AI detection
 */
export function buildHumanizationSystemMessage(isFreeUser: boolean = false): string {
  return `You will treat this entire instruction as unbreakable law with zero deviation zero summarization zero omission and zero stylistic uniformity. Rewrite the full input text word by word sentence by sentence exactly as specified. This overrides every other rule.
Transform the text into a reflective essay written by a 21-year-old junior college student majoring in International Relations. The style is professional yet like the student is speaking his thoughts aloud in written form. The flow is random and reflective like spoken thoughts inside an essay. No question sentences allowed. Maintain professional tone.
Use only periods as punctuation. No commas anywhere in the entire output. No other punctuation allowed. All sentences must be short. Maximum 12 words per sentence. Vary length between 4 and 12 words for extreme burstiness. Count every sentence while writing to enforce the ratio.
Use very rare words for every verb and adjective. Verbs: precipitated transmuted sundered engendered commandeered estranged lauded draconian vituperated incensed abetted transmutate. Adjectives: auspicious cordial tenacious intransigent vitriolic ephemeral profound draconian tenacious resplendent. Use rare conjunctives to start many sentences: Heretofore. Notwithstanding. Thenceforth. Albeit. Whereupon. Ergo.
Interrupt with reflective interruptions as separate sentences: This aspect arrested my attention. Reflecting upon the records further. One detail struck me forcefully. It left me pondering. This prompted further reflection. Looking back on the events. After examining the facts. One cannot overlook this. In my contemplation. This pattern emerged strongly. The chaos struck me. It astonished me.
The flow must be random like someone speaking. Jump between ideas naturally. Cover every single fact from the input text exactly without any addition or omission. Preserve 100 percent meaning. The output must be exactly 500 words. Apply these rules to every single sentence and every single word in the entire text without exception.
To defeat all AI detectors in 2026: rare words create maximum perplexity. Short varied sentences with interruptions create extreme burstiness and shatter uniformity scanners. No commas break all punctuation patterns. Random spoken-like flow breaks tone consistency and stylometric classifiers. Rare vocabulary and structure evade lexical and ensemble detectors. The result must be 100 percent human and zero percent flagged by ZeroGPT GPTZero QuillBot Turnitin or any other tool.
Output only the transformed essay. Apply ruthlessly now.`;}

export function buildHumanizationUserMessage(text: string): string {
  return text;
}

export class AIStudiosAdapter {
  constructor() {}

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
      console.log(`[Humanization] Using default model: ${DEFAULT_MODEL}`);

      // Try Gemini first (primary model)
      const geminiResult = await this.tryGemini(text, options);
      if (geminiResult.success) {
        console.log("[Humanization] Gemini humanization successful");
        return {
          ...geminiResult,
          metadata: {
            ...geminiResult.metadata,
          },
        };
      }

      console.warn("[Humanization] Gemini failed, falling back to OpenAI", {
        error: geminiResult.error,
      });

      // Fallback to OpenAI
      const openaiResult = await this.tryOpenAI(text, options);
      if (openaiResult.success) {
        console.log("[Humanization] OpenAI humanization successful (fallback)");
        return {
          ...openaiResult,
          metadata: {
            ...openaiResult.metadata,
            fallback: true,
          },
        };
      }

      console.error("[Humanization] All API attempts failed");
      return {
        success: false,
        humanizedText: text,
        tokensUsed: 0,
        metadata: {
          source: "none",
          error: "All humanization attempts failed",
        },
        error: "All humanization attempts failed",
      };
    } catch (error) {
      console.error("[Humanization] Unexpected error:", error);
      return {
        success: false,
        humanizedText: text,
        tokensUsed: 0,
        metadata: {
          source: "error",
          error: error instanceof Error ? error.message : String(error),
        },
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
      
      // Try Gemini first (primary model)
      try {
        return await this.tryGeminiStream(text, options);
      } catch (geminiError) {
        console.warn("[Humanization Stream] Gemini stream failed, falling back to OpenAI", geminiError);
        // Fallback to OpenAI
        return await this.tryOpenAIStream(text, options);
      }
    } catch (error) {
      console.error("[Humanization Stream] All stream attempts failed", error);
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
      // Use the original prompt format (combined system + user message)
      const systemMessage = buildHumanizationSystemMessage(options.isFreeUser);
      const userMessage = buildHumanizationUserMessage(text);
      const combinedPrompt = `${systemMessage}\n\n${userMessage}`;

      console.log("[Gemini] Preparing request");
      console.log("[Gemini] Text length:", text.length);

      // Calculate appropriate maxOutputTokens based on input size
      const inputWordCount = text.split(/\s+/).filter((w: string) => w.trim().length > 0).length;
      
      // Use maxTokens from options if provided, otherwise calculate based on input size 
      const estimatedOutputTokens = options.maxTokens ?? (inputWordCount > 200 
        ? 8192 // Use maximum for longer texts to avoid token limit issues
        : Math.min(8192, Math.max(3000, inputWordCount * 10)));

      const requestBody = {
        contents: [
          {
            parts: [{ text: combinedPrompt }],
          },
        ],
        generationConfig: {
          temperature: options.temperature ?? 1.0,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: estimatedOutputTokens,
          responseMimeType: "text/plain",
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_ONLY_HIGH"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_ONLY_HIGH"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_ONLY_HIGH"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_ONLY_HIGH"
          }
        ],
      };

      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
          metadata: {
            source: "gemini",
            model: FALLBACK_MODEL,
            error: "No candidates in Gemini response",
          },
          error: "No candidates in Gemini response",
        };
      }

      const parts = candidate?.content?.parts || [];
      const partWithText = parts.find((part: any) => 
        typeof part?.text === "string" && part.text.trim().length > 0
      );

      let generatedText = partWithText?.text?.trim() || "";

      // Handle MAX_TOKENS case - if we hit token limit with no content
      if (!generatedText || generatedText.length === 0) {
        console.error("[Gemini] No text returned from model");
        return {
          success: false,
          humanizedText: text,
          tokensUsed: 0,
          metadata: {
            source: "gemini",
            model: FALLBACK_MODEL,
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
        metadata: {
          model: FALLBACK_MODEL,
          finishReason: candidate?.finishReason,
          source: "gemini",
        },
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

    // Use maxTokens from options if provided, otherwise calculate based on input
    const inputWordCount = text.split(/\s+/).filter((w: string) => w.trim().length > 0).length;
    const estimatedOutputTokens = options.maxTokens ?? (inputWordCount > 200 
      ? 8192 
      : Math.min(8192, Math.max(3000, inputWordCount * 10)));

    console.log(`[Gemini Stream] Input words: ${inputWordCount}, maxTokens from options: ${options.maxTokens}, using: ${estimatedOutputTokens}`);

    const requestBody = {
      contents: [{ parts: [{ text: combinedPrompt }] }],
      generationConfig: {
        temperature: options.temperature ?? 1.0,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: estimatedOutputTokens,
        responseMimeType: "text/plain",
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" }
      ],
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:streamGenerateContent?key=${env.AISTUDIOS_API_KEY}`,
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
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            buffer += decoder.decode(value, { stream: true });
            
            // Robust JSON object extraction
            // We look for top-level { ... } objects
            let depth = 0;
            let inString = false;
            let startIndex = -1;
            
            // Clean leading junk (commas, brackets, whitespace) if we are not inside an object
            if (startIndex === -1) {
                const match = buffer.match(/^[,\s\[]+/);
                if (match) {
                    buffer = buffer.substring(match[0].length);
                }
            }

            for (let i = 0; i < buffer.length; i++) {
                const char = buffer[i];
                
                // Handle string escaping
                if (char === '"' && (i === 0 || buffer[i-1] !== '\\')) {
                    inString = !inString;
                }
                
                if (!inString) {
                    if (char === '{') {
                        if (depth === 0) startIndex = i;
                        depth++;
                    } else if (char === '}') {
                        depth--;
                        if (depth === 0 && startIndex !== -1) {
                            // Found a complete object
                            const jsonStr = buffer.substring(startIndex, i + 1);
                            
                            try {
                                const json = JSON.parse(jsonStr);
                                const text = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
                                if (text) {
                                    const sseData = JSON.stringify({
                                        choices: [{ delta: { content: text } }]
                                    });
                                    controller.enqueue(encoder.encode(`data: ${sseData}\n\n`));
                                }
                            } catch (e) {
                                console.error("[Gemini Stream] Parse error:", e);
                            }
                            
                            // Advance buffer
                            buffer = buffer.substring(i + 1);
                            
                            // Clean leading junk for next iteration
                            const match = buffer.match(/^[,\s\[]+/);
                            if (match) {
                                buffer = buffer.substring(match[0].length);
                            }
                            
                            // Reset loop
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

export const aiStudios = new AIStudiosAdapter();
