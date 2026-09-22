import { GoogleGenAI, Type } from "@google/genai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure we load environment variables if run independently
import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("Missing GEMINI_API_KEY in .env");
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const REGISTRY_PATH = path.join(__dirname, "../src/data/pseo-registry.json");
const CONTENT_DIR = path.join(__dirname, "../src/content/pseo");

if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateContentForKeyword(keyword: string, slug: string, retries = 3) {
  const targetFile = path.join(CONTENT_DIR, `${slug}.json`);
  if (fs.existsSync(targetFile)) {
    console.log(`Skipping ${keyword} - already generated.`);
    return;
  }

  console.log(`Generating content for: ${keyword}...`);

  const prompt = `You are a world-class AI researcher and programmatic SEO expert.
Write a deep, factual, and incredibly unique guide for the keyword: "${keyword}".
Do NOT use generic templates. Write as if you are a PhD researcher explaining the exact methodology.
Be specific to the keyword.
Generate output as structured JSON.`;

  const schema = {
    type: Type.OBJECT,
    properties: {
      metrics: {
        type: Type.OBJECT,
        properties: {
          initialDetectionRisk: { type: Type.INTEGER, description: "e.g. 98" },
          postHumanizationOriginality: { type: Type.INTEGER, description: "e.g. 100" },
          semanticPreservationScore: { type: Type.INTEGER, description: "e.g. 99" },
          tokensProcessedAvg: { type: Type.INTEGER, description: "e.g. 45000" },
        },
      },
      persona: {
        type: Type.OBJECT,
        properties: {
          idealUser: { type: Type.STRING, description: "Who benefits from this specifically?" },
          coreIntent: { type: Type.STRING, description: "What is their exact intent?" },
        },
      },
      technicalDeepDive: { type: Type.STRING, description: "A highly expert, 3-paragraph explanation of the technology specific to this keyword." },
      stepByStep: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
          }
        },
        description: "3-4 steps specific to the keyword.",
      },
      glossary: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            term: { type: Type.STRING },
            definition: { type: Type.STRING },
          }
        },
        description: "3 specific technical terms related to the keyword.",
      },
      faqs: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            answer: { type: Type.STRING },
          }
        },
        description: "3 unique frequently asked questions and detailed answers.",
      }
    },
    required: ["metrics", "persona", "technicalDeepDive", "stepByStep", "glossary", "faqs"],
  };

  for (let i = 0; i < retries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
          temperature: 0.7,
        },
      });

      const text = response.text;
      if (!text) throw new Error("Empty response");

      // Attempt to parse to ensure it's valid JSON
      const parsed = JSON.parse(text);
      fs.writeFileSync(targetFile, JSON.stringify(parsed, null, 2));
      console.log(`✅ Success: ${keyword}`);
      return;
    } catch (error: any) {
      console.warn(`⚠️ Attempt ${i + 1} failed for ${keyword}: ${error.message}`);
      if (error.status === 429) {
        console.log("Rate limited. Waiting 10 seconds...");
        await sleep(10000);
      } else {
        await sleep(2000);
      }
    }
  }
  console.error(`❌ Failed to generate content for ${keyword} after ${retries} retries.`);
}

async function main() {
  const registryRaw = fs.readFileSync(REGISTRY_PATH, "utf-8");
  const registry = JSON.parse(registryRaw);
  
  const args = process.argv.slice(2);
  const limitArg = args.findIndex(arg => arg === "--limit");
  const limit = limitArg !== -1 ? parseInt(args[limitArg + 1], 10) : registry.length;

  const toProcess = Object.values(registry).filter((item: any) => item.decision === "GENERATE" && item.indexing.indexEligibility).slice(0, limit);
  
  console.log(`Starting LLM Generation for ${toProcess.length} pages...`);

  // Simple concurrency implementation
  const concurrency = 5;
  for (let i = 0; i < toProcess.length; i += concurrency) {
    const chunk = toProcess.slice(i, i + concurrency);
    await Promise.all(chunk.map((item: any) => generateContentForKeyword(item.primaryKeyword, item.slug)));
    // Small delay between batches to respect rate limits
    await sleep(1000);
  }

  console.log("Generation complete.");
}

main().catch(console.error);
