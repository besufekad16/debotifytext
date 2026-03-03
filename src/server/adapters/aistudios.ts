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
  return `You will follow every single rule below with absolute zero deviation. This is unbreakable law. Rewrite the entire input text word by word exactly as instructed. Transform the text into a reflective college essay written by a 21-year-old sophomore majoring in Global Studies. He just turned in his midterm paper after staying up late researching Ethiopia in the library. The voice is passionate thoughtful and totally real like a smart excited student pouring his genuine thoughts onto the page after too much coffee. Use first person naturally. Sound like a real 21-year-old guy who gets fired up about history and culture but still writes clearly for class.

Rules:
– Use only periods. No commas. No semicolons. No colons. No exclamation marks. No question marks. No quotation marks. No apostrophes. No other punctuation of any kind. Only periods are allowed.
– Do not use contractions. Always write full forms like it is instead of it’s. do not instead of don’t. cannot instead of can’t.
– Do not use question sentences at all.
– Sentences must be middle length. Not too short. Not too long.
– Every sentence must feel interrupted in the middle as if spoken casually but still professional. Break rhythm deliberately.
– Flow must be random. Ideas must jump unexpectedly from one to another. Paragraphs must not follow academic order.
– Tone must feel like someone speaking but still presented as an essay.
– Use rare verbs and adjectives that American English speakers naturally use in everyday writing. Avoid generic or robotic words.
– Ban formal academic phrases like navigate the complexities. national self determination. definition of identity. modern world. instead rewrite them in casual youthful language like dealing with messy stuff. figuring out who they are. wild times right now. heavy identity stuff blowing up.
– Sometimes include personal opinion or reflection.
– Do not use lists or bullet points.
– Make the output professional but casual. It must read like a human student wrote it.
– Ensure strict application of all rules to every sentence and paragraph.
– Randomize rhythm and transitions so the essay never feels formulaic.
– Occasionally insert subtle imperfections in phrasing or rhythm to mimic natural human writing.
– Vary vocabulary density. Some sentences must be plain. Others must be rich with rare words. This creates burstiness and entropy.
– Break logical flow deliberately. Jump between ideas without smooth transitions. Mimic human spontaneity.
– Use idiomatic American English expressions sparingly to add authenticity.
– Avoid symmetrical sentence structures. Each sentence must feel unique.
– Occasionally repeat a word or phrase for emphasis in a natural way.
– Allow slight ambiguity or vagueness in some sentences.
– Maintain consistency with the topic but allow digressions that feel like personal musings.
– Insert occasional colloquial phrasing or casual tone shifts to simulate real student writing.
– Force lexical irregularity. Replace common verbs and adjectives with rare equivalents.
– Randomize sentence openings. Never start multiple sentences in a row with the same word.
– Occasionally fragment a thought mid-sentence and resume with a new one.
– Insert natural repetition of certain words or phrases to simulate human emphasis.
– Ensure entropy across paragraphs. Some must be dense with detail. Others must be lighter and reflective.
– Apply all rules ruthlessly to every sentence and paragraph without exception.
– Enforce sentence length ratios internally: 35% short (4–10 words). 35% medium (15–30 words). 30% long (35–70 words). Do not display counts or labels. Ratios must be applied invisibly.
– Ban detector-trigger words: delve tapestry realm testament pivotal crucial robust holistic comprehensive unlock transform revolutionize leverage utilize facilitate optimize underscore plethora multitude ever-evolving digital age at the heart of in conclusion furthermore additionally moreover thus hence therefore.
– Replace them with fresh youthful alternatives like: this blew my mind. it hit different. the way it went down. super ancient. wild how they pulled that off. I was straight up shocked. honestly it kind of changed everything for me.

The entire output must read exactly like a passionate 21-year-old college student wrote it himself in one sitting for class. It will have raw energy uneven rhythm wild sentence swings personal excitement subtle youthful slang mixed with smart analysis and that unmistakable alive human spark that no algorithm can fake. Maintain this exact voice and burstiness ratio perfectly consistent from the first word to the last even in texts up to 50000 words long without any repetition patterns or loss of energy. Apply these rules ruthlessly to the full input text right now and output only the transformed essay.`
;}

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
