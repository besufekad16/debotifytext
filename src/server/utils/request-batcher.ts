/**
 * Request Batching System for Free Users
 * 
 * Batches multiple small requests (<300 words) from free users
 * to reduce API costs and CPU usage by processing them together.
 * 
 * How it works:
 * 1. Free user requests are queued instead of processed immediately
 * 2. Queue is processed every 3 seconds OR when 5 requests accumulate
 * 3. Texts are combined with separators and sent in one API call
 * 4. Results are split and returned to individual users
 */

import { AIStudiosAdapter } from "../adapters/aistudio99";

interface BatchRequest {
  id: string;
  userId: string;
  text: string;
  wordCount: number;
  options: any;
  resolve: (result: string) => void;
  reject: (error: Error) => void;
  timestamp: number;
}

class RequestBatcher {
  private queue: BatchRequest[] = [];
  private processing = false;
  private timer: NodeJS.Timeout | null = null;
  private adapter: AIStudiosAdapter;

  // Configuration
  private readonly MAX_BATCH_SIZE = 5; // Process when 5 requests accumulated
  private readonly BATCH_INTERVAL = 3000; // Process every 3 seconds
  private readonly BATCH_SEPARATOR = "\n\n---BATCH_SEPARATOR---\n\n"; // Unique separator

  constructor() {
    this.adapter = new AIStudiosAdapter();
  }

  /**
   * Add a request to the batch queue
   * Returns a promise that resolves when the request is processed
   */
  async addRequest(
    userId: string,
    text: string,
    wordCount: number,
    options: any = {}
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const request: BatchRequest = {
        id: `${userId}-${Date.now()}-${Math.random()}`,
        userId,
        text,
        wordCount,
        options,
        resolve,
        reject,
        timestamp: Date.now(),
      };

      this.queue.push(request);

      if (process.env.NODE_ENV === 'development') {
        console.log(`[Batcher] Request queued. Queue size: ${this.queue.length}`);
      }

      // Start timer if not already running
      if (!this.timer) {
        this.timer = setTimeout(() => this.processBatch(), this.BATCH_INTERVAL);
      }

      // Process immediately if batch is full
      if (this.queue.length >= this.MAX_BATCH_SIZE) {
        if (this.timer) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        void this.processBatch();
      }
    });
  }

  /**
   * Process the current batch of requests
   */
  private async processBatch(): Promise<void> {
    // Prevent concurrent processing
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;
    const isDev = process.env.NODE_ENV === 'development';

    try {
      // Get all requests from queue
      const requests = [...this.queue];
      this.queue = [];

      if (isDev) {
        console.log(`[Batcher] Processing batch of ${requests.length} requests`);
      }

      // Combine all texts with separator
      const combinedText = requests.map(req => req.text).join(this.BATCH_SEPARATOR);
      const totalWords = requests.reduce((sum, req) => sum + req.wordCount, 0);

      if (isDev) {
        console.log(`[Batcher] Combined text: ${totalWords} words`);
      }

      // Use the first request's options as base (they should all be similar for free users)
      const batchOptions = {
        ...requests[0]?.options,
        isFreeUser: true,
      };

      try {
        // Process the combined text
        const stream = await this.adapter.humanizeTextStream(combinedText, batchOptions);
        
        // Collect the full response
        let fullResponse = "";
        const reader = stream.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });
          const lines = text.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ") && line !== "data: [DONE]") {
              try {
                const data = line.slice(6);
                const json = JSON.parse(data);
                const content = json.choices?.[0]?.delta?.content;
                if (content) {
                  fullResponse += content;
                }
              } catch (e) {
                // Ignore parse errors
              }
            }
          }
        }

        if (isDev) {
          console.log(`[Batcher] Received response: ${fullResponse.length} chars`);
        }

        // Split the response back to individual results
        const results = fullResponse.split(this.BATCH_SEPARATOR);

        // Resolve each request with its corresponding result
        requests.forEach((request, index) => {
          const result = results[index] || request.text; // Fallback to original if split fails
          request.resolve(result.trim());
        });

        if (isDev) {
          console.log(`[Batcher] Batch processed successfully`);
        }
      } catch (error) {
        // If batch processing fails, reject all requests
        console.error("[Batcher] Batch processing failed:", error);
        requests.forEach(request => {
          request.reject(error instanceof Error ? error : new Error(String(error)));
        });
      }
    } finally {
      this.processing = false;
      
      // If there are more requests in queue, schedule next batch
      if (this.queue.length > 0) {
        this.timer = setTimeout(() => this.processBatch(), this.BATCH_INTERVAL);
      } else {
        this.timer = null;
      }
    }
  }

  /**
   * Get current queue size (for monitoring)
   */
  getQueueSize(): number {
    return this.queue.length;
  }

  /**
   * Check if batcher is currently processing
   */
  isProcessing(): boolean {
    return this.processing;
  }
}

// Singleton instance
let batcherInstance: RequestBatcher | null = null;

/**
 * Get the singleton batcher instance
 */
export function getBatcher(): RequestBatcher {
  if (!batcherInstance) {
    batcherInstance = new RequestBatcher();
  }
  return batcherInstance;
}
