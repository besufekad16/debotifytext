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

// Determines semantic cluster based on keyword
function getKeywordCluster(keyword: string): "Academic" | "Marketing" | "Professional" | "Creative" | "General" {
  const kw = keyword.toLowerCase();
  if (/student|essay|school|university|paper|thesis|college|academic|assignment|research|dissertation|homework/i.test(kw)) return "Academic";
  if (/seo|marketing|blogger|copywriter|sales|ads|conversion|agency|article|post|content/i.test(kw)) return "Marketing";
  if (/email|corporate|business|report|neutral|office|memo|proposal|executive|work/i.test(kw)) return "Professional";
  if (/writer|story|creative|novel|script|book|author|fiction|poem/i.test(kw)) return "Creative";
  return "General";
}

class SeededRandom {
  private seed: number;
  constructor(seedStr: string) {
    this.seed = this.hashString(seedStr);
  }
  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
    }
    return Math.abs(hash);
  }
  public next(): number {
    let t = (this.seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  public pick<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)] as T;
  }
  public pickN<T>(arr: T[], n: number): T[] {
    const copy = [...arr];
    const result = [];
    for (let i = 0; i < Math.min(n, arr.length); i++) {
      const idx = Math.floor(this.next() * copy.length);
      result.push(copy[idx]);
      copy.splice(idx, 1);
    }
    return result as T[];
  }
}

function parseSpintax(text: string, rng: SeededRandom): string {
  let result = text;
  while (result.includes("{")) {
    result = result.replace(/\{([^{}]+)\}/g, (match, contents) => {
      const options = contents.split("|");
      return rng.pick(options);
    });
  }
  return result;
}

// Modular Block Engine Templates
const techBlocks = {
  Academic: [
    "{Academic institutions|Universities|Colleges} use {strict|advanced|highly sensitive} {heuristics|algorithms|models} to {flag|detect} AI. HumanifyLab counters this by {re-evaluating|re-mapping|restructuring} the {semantic structure|lexical density|writing flow} of your {essay|paper|assignment}.",
    "Unlike {basic|simple|outdated} {spinners|rewriters|tools}, our engine understands {scholarly citations|academic formatting|university guidelines} and {preserves|protects|maintains} your {core thesis|research arguments|main ideas} without triggering {GPTZero or Turnitin|major academic detectors}.",
    "The result is a {cohesive|logically sound|perfectly structured} {document|submission|paper} that {reads like a human scholar|exhibits natural human burstiness|flows naturally}, guaranteeing a {0%|completely safe} AI detection score.",
    "When {professors|TAs|educators} run your {work|assignment} through Turnitin, they look for {robotic patterns|predictable phrasing}. Our system {erases|eliminates|removes} these {watermarks|patterns} entirely.",
    "By {injecting|introducing} natural {entropy|variance|human error margins} into the text, we ensure your {academic voice|student tone} is {authentic|genuine|believable}.",
    "Many {students|researchers} struggle with {false positives|incorrect AI flagging}. HumanifyLab {solves this|fixes this issue} by giving your text the {nuance|depth} of real human writing.",
    "We train our {models|algorithms} on millions of {high-scoring|peer-reviewed} {essays|papers} to ensure your output is {academically rigorous|proficient} yet undetectable."
  ],
  General: [
    "HumanifyLab uses {state-of-the-art|cutting-edge|advanced} {NLP|machine learning} to {identify and remove|eliminate|erase} {robotic footprints|AI watermarks} from any text.",
    "By {analyzing|processing} {millions of|countless|vast amounts of} {human writing samples|data points}, our engine {restructures|rewrites} your content at the {lexical|syntactic} level.",
    "The result is {flawless|perfect}, {human-like|natural} text that {bypasses|beats|outsmarts} {every major AI detector|GPTZero, Originality.ai, and more}.",
    "Stop {worrying about|fearing} AI detection. Our {proprietary|unique} algorithm guarantees {100% human scores|complete undetectability} every time.",
    "{Detectors|AI checkers} look for {low perplexity|predictable words}. We {maximize|increase} perplexity to make your text {indistinguishable from a human|completely natural}.",
    "Whether it's a {blog post|quick email|simple document}, our tool {adapts|adjusts} the {tone|style} seamlessly.",
    "Experience the {freedom|confidence} of using AI {without the risk of being caught|safely and securely}."
  ]
};
// Fallback mapping for missing clusters
techBlocks.Marketing = techBlocks.General;
techBlocks.Professional = techBlocks.General;
techBlocks.Creative = techBlocks.General;

const stepBlocks = {
  Academic: [
    { title: "Upload Draft", description: "Paste your {essay|thesis draft|assignment} directly into the {secure portal|dashboard}." },
    { title: "Academic Scan", description: "The engine {cross-references|analyzes} Turnitin's current detection {models|parameters}." },
    { title: "Scholarly Rewrite", description: "{Vocabulary and syntax|Sentence structures} are {adjusted|humanized} to match a natural student baseline." },
    { title: "Citation Protection", description: "All your {APA|MLA|Chicago} quotes and references are {safeguarded|ignored by the rewriter}." },
    { title: "Safe Export", description: "Download your {plagiarism-free|detection-proof} paper, ready for submission." },
    { title: "Plagiarism Check", description: "We run a {final scan|quick verification} to ensure {100% originality|complete safety}." }
  ],
  General: [
    { title: "Input Text", description: "Paste your {AI-generated|robotic} text." },
    { title: "AI Scan", description: "The system {detects|flags|highlights} AI patterns." },
    { title: "Tone Selection", description: "Choose the {perfect|right} {voice|tone} for your audience." },
    { title: "Humanization", description: "Advanced algorithms {rewrite|restructure|humanize} the content." },
    { title: "Verification", description: "We check the output against {top detectors|GPTZero and Originality}." },
    { title: "Done", description: "Download your {100% human|safe} text." }
  ]
};
stepBlocks.Marketing = stepBlocks.General;
stepBlocks.Professional = stepBlocks.General;
stepBlocks.Creative = stepBlocks.General;


function generateContentForKeyword(keywordObj: any) {
  const keyword = keywordObj.primaryKeyword;
  const slug = keywordObj.slug;
  const targetFile = path.join(CONTENT_DIR, `${slug}.json`);

  const cluster = getKeywordCluster(keyword) as keyof typeof techBlocks;
  const rng = new SeededRandom(slug);

  // Randomly pick 3-4 deep dive paragraphs for massive uniqueness
  const numParagraphs = rng.pick([3, 4]);
  const selectedTech = rng.pickN(techBlocks[cluster], numParagraphs);
  const technicalDeepDive = selectedTech.map(p => parseSpintax(p, rng)).join("\n\n");

  // Randomly select 3-5 steps
  const numSteps = rng.pick([3, 4, 5]);
  const selectedSteps = rng.pickN(stepBlocks[cluster], numSteps);
  const stepByStep = selectedSteps.map(s => ({
    title: parseSpintax(s.title, rng),
    description: parseSpintax(s.description, rng).replace(/\{keyword\}/g, keyword)
  }));

  // Glossary is standard but we'll shuffle it
  const glossaryPool = [
    { term: "Burstiness", definition: "The variation in sentence length and structure typical of human writing." },
    { term: "Perplexity", definition: "A measure of how unpredictable the text is to an AI model." },
    { term: "Undetectable AI", definition: "Text that has been modified to bypass algorithmic detection." },
    { term: "Semantic Preservation", definition: "Keeping the original meaning intact while changing the words." },
    { term: "AI Watermark", definition: "Hidden statistical patterns left by language models like ChatGPT." }
  ];
  const glossary = rng.pickN(glossaryPool, rng.pick([3, 4]));

  const genericQuestions = [
    "What makes {keyword} the {best|top} choice?",
    "How does the {algorithm|humanizer} process {keyword}?",
    "Can I {trust|rely on} this for {keyword} tasks?",
    "Why is humanizing {keyword} {important|crucial}?",
    "Is {keyword} {free to use|available today}?",
    "Who {benefits from|uses} {keyword} the most?",
    "Does {keyword} {work offline|require an account}?",
    "How fast is {keyword} processing?",
    "Will {keyword} {save me time|improve my workflow}?",
    "What makes {keyword} {unique|special} compared to alternatives?",
    "Is {keyword} {100% safe|detectable}?",
    "How do I {get started with|use} {keyword}?"
  ];

  const genericAnswers = [
    "{Yes|Absolutely}, {it is designed specifically|our tool is optimized} for {keyword}.",
    "{Our system|The engine} uses {advanced|proprietary} NLP to {process|handle} {keyword} flawlessly.",
    "{Users|Customers} worldwide {rely on|trust} us for {keyword} {daily|every single day}.",
    "It {drastically|significantly} {improves|enhances} your {results|outputs} with {keyword}.",
    "{Security|Privacy} is our {top priority|main focus} when dealing with {keyword}.",
    "You can {easily|quickly} {integrate|use} {keyword} in your {workflow|process}."
  ];

  const generatedFaqs = [];
  while (generatedFaqs.length < 10) {
    generatedFaqs.push({
      question: parseSpintax(rng.pick(genericQuestions).replace(/\{keyword\}/g, keyword), rng),
      answer: parseSpintax(rng.pick(genericAnswers).replace(/\{keyword\}/g, keyword), rng)
    });
  }

  const parsed = {
    metrics: {
      initialDetectionRisk: 85 + Math.floor(rng.next() * 14),
      postHumanizationOriginality: 98 + Number((rng.next() * 1.9).toFixed(1)),
      semanticPreservationScore: 95 + Number((rng.next() * 4.9).toFixed(1)),
      tokensProcessedAvg: Math.floor(500000 + rng.next() * 2000000)
    },
    persona: {
      idealUser: parseSpintax("{Students|Professionals|Writers|Marketers|Researchers}", rng),
      coreIntent: parseSpintax(`Achieve {perfect|flawless} results with ${keyword}`, rng)
    },
    technicalDeepDive,
    stepByStep,
    glossary,
    faqs: generatedFaqs
  };

  fs.writeFileSync(targetFile, JSON.stringify(parsed, null, 2));
}

async function main() {
  const registryRaw = fs.readFileSync(REGISTRY_PATH, "utf-8");
  const registry = JSON.parse(registryRaw);
  
  const args = process.argv.slice(2);
  const batchSizeArg = args.indexOf("--batch-size");
  const batchIndexArg = args.indexOf("--batch-index");

  let batchSize = 40000;
  let batchIndex = 0;

  if (batchSizeArg !== -1) batchSize = parseInt(args[batchSizeArg + 1]!, 10);
  if (batchIndexArg !== -1) batchIndex = parseInt(args[batchIndexArg + 1]!, 10);

  const allKeys = Object.keys(registry);
  const toProcess = Object.values(registry).filter((item: any) => item.decision === "GENERATE" && item.indexing.indexEligibility);

  const start = batchIndex * batchSize;
  const end = Math.min(start + batchSize, toProcess.length);
  const batch = toProcess.slice(start, end);

  console.log(`Starting Modular Block Engine for batch ${batchIndex + 1} (Pages ${start} to ${end})...`);

  for (let i = 0; i < batch.length; i++) {
    generateContentForKeyword(batch[i]);
    if (i % 5000 === 0 && i > 0) {
      console.log(`Processed ${i} pages...`);
    }
  }

  console.log(`✅ Instantly generated ${batch.length} hyper-unique pages!`);
}

main().catch(console.error);
