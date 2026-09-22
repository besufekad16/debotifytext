import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

  const schemaStr = `
{
  "metrics": {
    "initialDetectionRisk": 98,
    "postHumanizationOriginality": 100,
    "semanticPreservationScore": 99,
    "tokensProcessedAvg": 45000
  },
  "persona": {
    "idealUser": "Who benefits from this specifically?",
    "coreIntent": "What is their exact intent?"
  },
  "technicalDeepDive": "A highly expert, 3-paragraph explanation of the technology specific to this keyword.",
  "stepByStep": [
    { "title": "...", "description": "..." }
  ],
  "glossary": [
    { "term": "...", "definition": "..." }
  ],
  "faqs": [
    { "question": "...", "answer": "..." }
  ]
}`;

  const prompt = `You are a world-class AI researcher and programmatic SEO expert.
Write a deep, factual, and incredibly unique guide for the keyword: "${keyword}".
Do NOT use generic templates. Write as if you are a PhD researcher explaining the exact methodology.
Be specific to the keyword.
Output valid JSON strictly adhering to this structure:
${schemaStr}`;

  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch("http://127.0.0.1:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3.1",
          prompt: prompt,
          format: "json",
          stream: false,
          options: {
            temperature: 0.7
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const text = data.response;
      
      if (!text) throw new Error("Empty response");

      // Attempt to parse to ensure it's valid JSON
      const parsed = JSON.parse(text);
      
      // Basic validation
      if (!parsed.metrics || !parsed.persona || !parsed.technicalDeepDive || !parsed.stepByStep || !parsed.glossary || !parsed.faqs) {
         throw new Error("Missing required JSON fields");
      }

      fs.writeFileSync(targetFile, JSON.stringify(parsed, null, 2));
      console.log(`✅ Success: ${keyword}`);
      return;
    } catch (error: any) {
      console.warn(`⚠️ Attempt ${i + 1} failed for ${keyword}: ${error.message}`);
      await sleep(2000);
    }
  }
  console.error(`❌ Failed to generate content for ${keyword} after ${retries} retries.`);
}

async function main() {
  const registryRaw = fs.readFileSync(REGISTRY_PATH, "utf-8");
  const registry = JSON.parse(registryRaw);
  
  const args = process.argv.slice(2);
  const limitArg = args.findIndex(arg => arg === "--limit");
  
  const keys = Object.keys(registry);
  const limit = limitArg !== -1 ? parseInt(args[limitArg + 1], 10) : keys.length;

  const toProcess = Object.values(registry).filter((item: any) => item.decision === "GENERATE" && item.indexing.indexEligibility).slice(0, limit);
  
  console.log(`Starting Local Ollama Generation for ${toProcess.length} pages...`);

  // For local Ollama, we should run sequentially or with very low concurrency to avoid crashing the GPU/RAM
  const concurrency = 2; 
  for (let i = 0; i < toProcess.length; i += concurrency) {
    const chunk = toProcess.slice(i, i + concurrency);
    await Promise.all(chunk.map((item: any) => generateContentForKeyword(item.primaryKeyword, item.slug)));
  }

  console.log("Generation complete.");
}

main().catch(console.error);
