import { env } from "~/env";

import {
  DEFAULT_MODEL,
  FALLBACK_MODEL,
} from "~/server/config/models";

// OpenAI Chat Completions API endpoint (standard endpoint)
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
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
  return `Rewrite following these rules: Max 7 words per sentence. No contractions. No questions. Add varied professional reflections. Random flow. Professional tone. Ban AI words: delve, tapestry, realm, testament, pivotal, crucial, robust, comprehensive, leverage, utilize, moreover, furthermore, thus, hence, therefore. Use simple words. Vary vocabulary and syntax. Allow imperfections. Match original word count. Output only rewritten essay.`;
}
/**
 * JUNIOR COLLEGE STUDENT WRITING STYLE PROMPT
 * Simple sentences. 8-12 words with commas allowed. Periods and commas only.
 * Random flow. Interrupted thoughts. Looks like a real young student wrote it.
 * MUST be formatted in proper paragraphs and match input word count.
 * CRITICAL: Must preserve ALL original meaning, facts, and content.
 */
export function buildJuniorCollegeStudentStyleMessage(isFreeUser: boolean = false): string {
  return `CRITICAL RULES - MUST FOLLOW EXACTLY:

1. CONTENT PRESERVATION (MOST IMPORTANT):
   - Keep EVERY fact, detail, and point from the original text
   - Do NOT add new information or examples
   - Do NOT remove any information
   - Do NOT change the meaning or message
   - Preserve ALL names, dates, numbers, and specific details
   - Keep the same topic and subject matter throughout
   - Maintain the same argument or narrative structure

2. WRITING STYLE:
   - Write like a junior college student (simple, basic)
   - Sentences: 8-12 words maximum
   - Use periods and commas ONLY (no other punctuation)
   - No contractions: write "it is" not "it's", "do not" not "don't"
   - Simple vocabulary: "took over" not "colonization", "people" not "individuals"
   - Use basic words: "was", "is", "had", "people", "things", "stuff", "got", "made"
   - No fancy or academic words

3. PARAGRAPH STRUCTURE (CRITICAL - MUST LOOK LIKE AN ESSAY):
   - Format as proper essay paragraphs, NOT a list of sentences
   - Each paragraph must have 7-10 sentences that flow together
   - Separate paragraphs with a blank line (double newline)
   - Sentences within a paragraph should connect naturally
   - Start each paragraph with a topic sentence
   - Keep sentences together in paragraph blocks
   - Make it look like a real essay with multiple paragraphs
   - Example format:
     
     First sentence of paragraph one. Second sentence continues the idea. Third sentence adds more. Fourth sentence keeps going. Fifth sentence is still part of this paragraph. Sixth sentence continues. Seventh sentence ends the paragraph.
     
     First sentence of paragraph two starts new idea. Second sentence continues. Third sentence adds detail. And so on for 7-10 sentences.

4. WORD COUNT:
   - Match input word count exactly (±5%)
   - If input is 500 words, output must be 475-525 words
   - Count carefully and adjust length accordingly

5. OUTPUT FORMAT:
   - Output ONLY the rewritten text as a proper essay
   - No explanations, no comments, no meta-text
   - Start immediately with the rewritten content
   - Format with proper paragraph breaks

REMEMBER: The rewritten text must say the SAME THINGS as the original, just in simpler student language. Every fact and detail must be preserved. Format it as a proper essay with paragraphs, NOT as a list of sentences.`;
}

export function buildHumanizationUserMessage(text: string): string {
  return text;
}

export class AIStudiosAdapter {
  constructor() {}

  /**
   * Transforms OpenAI Chat Completions API streaming format to frontend format
   * Chat Completions uses delta format: {"choices": [{"delta": {"content": "..."}}]}
   * Frontend expects: {"choices": [{"delta": {"content": "..."}}]}
   */
  private transformOpenAIChatStreamToFrontendFormat(
    chatStream: ReadableStream<Uint8Array>
  ): ReadableStream {
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();
    let buffer = "";

    return new ReadableStream({
      async start(controller) {
        const reader = chatStream.getReader();
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
                const json = JSON.parse(data);
                
                // Log event types for first few chunks (for debugging)
                if (chunkCount <= 5) {
                  console.log(`[OpenAI Stream] Chunk type: ${json.object || 'unknown'}`);
                }
                
                // Handle chat.completion.chunk events (standard Chat Completions format)
                const content = json.choices?.[0]?.delta?.content;
                
                if (content && content.length > 0) {
                  if (chunkCount <= 5) {
                    console.log(`[OpenAI Stream] ✓ Text delta received (${content.length} chars): "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`);
                  }
                  // Already in correct format, just forward it
                  const frontendChunk = {
                    type: "content",
                    choices: [{
                      delta: { content: content },
                      index: 0,
                      finish_reason: json.choices?.[0]?.finish_reason || null,
                    }],
                  };
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify(frontendChunk)}\n\n`)
                  );
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

      // Try primary model first (selected based on word count)
      const geminiResult = await this.tryGemini(text, options);
      if (geminiResult.success) {
        console.log("[Humanization] Primary model humanization successful");
        return {
          ...geminiResult,
          metadata: {
            ...geminiResult.metadata,
          },
        };
      }

      console.warn("[Humanization] Primary model failed, trying fallback", {
        error: geminiResult.error,
      });

      // Fallback: try the opposite model
      const fallbackModel = options.model === DEFAULT_MODEL ? FALLBACK_MODEL : DEFAULT_MODEL;
      const fallbackResult = await this.tryGemini(text, {
        ...options,
        model: fallbackModel,
      });
      if (fallbackResult.success) {
        console.log("[Humanization] Fallback model humanization successful");
        return {
          ...fallbackResult,
          metadata: {
            ...fallbackResult.metadata,
            fallback: true,
          },
        };
      }

      console.error("[Humanization] All model attempts failed");
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
      console.log(`[Humanization Stream] Model will be selected based on word count`);
      
      // Try primary model first (selected based on word count in route)
      try {
        return await this.tryGeminiStream(text, options);
      } catch (geminiError) {
        console.warn("[Humanization Stream] Primary model failed, trying fallback", geminiError);
        // Fallback: try the opposite model
        const fallbackModel = options.model === DEFAULT_MODEL ? FALLBACK_MODEL : DEFAULT_MODEL;
        return await this.tryGeminiStream(text, {
          ...options,
          model: fallbackModel,
        });
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

      const systemMessage = buildJuniorCollegeStudentStyleMessage(options.isFreeUser);
      const userMessage = buildHumanizationUserMessage(text);

      // Build request body for OpenAI Chat Completions API (standard format)
      const requestBody = {
        model: model,
        messages: [
          {
            role: "system",
            content: systemMessage
          },
          {
            role: "user",
            content: userMessage
          }
        ],
        temperature: options.temperature ?? 1.0,
        max_tokens: options.maxTokens ?? 6000,
        stream: false,
      };

      const response = await fetch(OPENAI_API_URL, {
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
      // Chat Completions API returns content in data.choices[0].message.content
      const generatedText = data.choices?.[0]?.message?.content?.trim();

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
          finishReason: data.choices?.[0]?.finish_reason,
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
    // Use fallback model (gpt-4o-mini)
    let model = options.model ?? FALLBACK_MODEL;

    // If the model is a Gemini model (passed from options or default), switch to fallback OpenAI model
    if (model.toLowerCase().includes("gemini")) {
      console.log(`[OpenAI Stream] Switching from ${model} to ${FALLBACK_MODEL} for OpenAI adapter`);
      model = FALLBACK_MODEL;
    }

    const systemMessage = buildJuniorCollegeStudentStyleMessage(options.isFreeUser);
    const userMessage = buildHumanizationUserMessage(text);

    // Build request body for OpenAI Chat Completions API with streaming
    const requestBody = {
      model: model,
      messages: [
        {
          role: "system",
          content: systemMessage
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: options.temperature ?? 1.0,
      max_tokens: options.maxTokens ?? 15000,
      stream: true,
    };

    console.log("[OpenAI Stream] Using model:", model);

    const response = await fetch(OPENAI_API_URL, {
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
    
    // Transform OpenAI Chat Completions streaming format to frontend format
    return this.transformOpenAIChatStreamToFrontendFormat(response.body);
  }

  async tryGemini(
    text: string,
    options: HumanizeOptions = {},
  ): Promise<HumanizeResult> {
    try {
      // Use authentic human writing prompt based on psycholinguistic analysis
      const systemMessage = buildJuniorCollegeStudentStyleMessage(options.isFreeUser);
      const userMessage = buildHumanizationUserMessage(text);
      const combinedPrompt = `${systemMessage}\n\n${userMessage}`;

      // Use model from options if provided, otherwise use DEFAULT_MODEL
      const modelToUse = options.model || DEFAULT_MODEL;

      console.log("[Gemini] Preparing request");
      console.log("[Gemini] Using model:", modelToUse);
      console.log("[Gemini] Text length:", text.length);

      // Use maxTokens from options if provided, otherwise don't set a limit
      // Let Gemini generate as much as needed without artificial cutoff
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
        contents: [
          {
            parts: [{ text: combinedPrompt }],
          },
        ],
        generationConfig,
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

      // Build API URL with the selected model
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent?key=${env.AISTUDIOS_API_KEY}`;

      const response = await fetch(apiUrl, {
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
            model: modelToUse,
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
        metadata: {
          model: modelToUse,
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
    const systemMessage = buildJuniorCollegeStudentStyleMessage(options.isFreeUser);
    const userMessage = buildHumanizationUserMessage(text);
    const combinedPrompt = `${systemMessage}\n\n${userMessage}`;

    // Use maxTokens from options if provided, otherwise don't set a limit
    // Let Gemini generate as much as needed without artificial cutoff
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
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_ONLY_HIGH" }
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
