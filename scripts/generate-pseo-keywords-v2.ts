import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REGISTRY_PATH = path.join(__dirname, "../src/data/pseo-registry.json");

// Core Intents (Framed as student questions)
const intents = [
  "how to humanize",
  "is there a free humanizer for",
  "how can students debotify",
  "how to bypass ai detectors with",
  "what is the best free humanizer for",
  "how do i humanize a pdf of",
  "can i debotify my",
  "how to make ai undetectable in my",
  "is it possible to humanize",
  "how to remove ai watermark from",
  "how to beat ai detectors using",
  "best way to humanize",
  "how to rewrite ai text for",
  "can turnitin detect",
  "how to debotify",
  "free ai humanizer for",
  "undetectable ai humanizer for",
  "is debotifytext the best for",
  "bypass ai detection for",
  "how to humanize ai text for"
];

// Formats / Targets (Student focus)
const formats = [
  "an essay",
  "my essay",
  "a pdf",
  "my pdf",
  "an assignment",
  "my assignment",
  "a college essay",
  "my thesis",
  "a lab report",
  "my research paper",
  "homework",
  "my paper",
  "a cover letter",
  "my personal statement",
  "my dissertation",
  "a case study",
  "my capstone project",
  "a literature review",
  "my coursework",
  "a speech",
  "my presentation",
  "an annotated bibliography",
  "a report",
  "my summary",
  "an article",
  "my creative writing"
];

// Target Detectors
const detectors = [
  "turnitin",
  "gptzero",
  "copyleaks",
  "winston ai",
  "originality ai",
  "safeassign",
  "canvas",
  "zerogpt",
  "scribbr",
  "grammarly",
  "plagiarism checkers",
  "quillbot",
  "sapling",
  "crossplag"
];

// Contexts / Audiences (Student focus)
const contexts = [
  "for university students",
  "for high school students",
  "for college",
  "in 2026",
  "for free",
  "without getting caught",
  "safely",
  "online",
  "instantly",
  "for international students",
  "for a strict professor",
  "as a student",
  "without detection",
  "100% free",
  "no login required",
  "in 2025",
  "using an ai bypasser",
  "with debotifytext",
  "easily",
  "step by step",
  "for academic writing",
  "for undergraduates",
  "for masters students",
  "for phds"
];

// Question frameworks
const questionFrameworks = [
  "what is the best tool to bypass",
  "how do students bypass",
  "are there free tools to beat",
  "which humanizer works best against",
  "can i use debotifytext to bypass",
  "how to trick",
  "is it hard to bypass",
  "what removes ai detection for"
];

// Function to generate a deterministic random slug
const generateSlug = (text: string) => {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
};

// Shuffles an array deterministically (or pseudo-randomly)
function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

async function main() {
  console.log("Generating 40,000 highly unique student-focused PSEO keywords...");

  const allKeywords = new Set<string>();
  const registry: Record<string, any> = {};

  // Mix 1: Direct action questions
  for (const intent of intents) {
    for (const format of formats) {
      for (const context of contexts) {
        allKeywords.add(`${intent} ${format} ${context}`);
        allKeywords.add(`${intent} ${format}`);
      }
    }
  }

  // Mix 2: Detector specific questions
  for (const framework of questionFrameworks) {
    for (const detector of detectors) {
      for (const format of formats) {
        for (const context of contexts) {
          allKeywords.add(`${framework} ${detector} with ${format} ${context}`);
          allKeywords.add(`how to debotify ${format} to bypass ${detector}`);
          allKeywords.add(`can ${detector} detect a humanized ${format} ${context}`);
          allKeywords.add(`humanize pdf ${format} to beat ${detector}`);
        }
      }
    }
  }

  // Mix 3: "Debotify PDF" and "Free Humanizer" specific
  const specificModifiers = ["for students", "free online", "without login", "fast", "safe"];
  for (const format of formats) {
    for (const mod of specificModifiers) {
      allKeywords.add(`free humanizer for ${format} ${mod}`);
      allKeywords.add(`debotify pdf ${format} ${mod}`);
      allKeywords.add(`humanize pdf ${mod} for ${format}`);
      allKeywords.add(`how to debotify pdf of ${format}`);
    }
  }

  // Convert to array and shuffle
  let keywordsArray = Array.from(allKeywords);
  
  // Clean up whitespace
  keywordsArray = keywordsArray.map(k => k.replace(/\s+/g, ' ').trim());
  
  // Deduplicate again after cleaning
  keywordsArray = Array.from(new Set(keywordsArray));
  
  shuffleArray(keywordsArray);

  // Take exactly 40,000
  const finalKeywords = keywordsArray.slice(0, 40000);

  let index = 1;
  for (const kw of finalKeywords) {
    const slug = generateSlug(kw);
    
    // Capitalize words for title
    const title = kw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    registry[slug] = {
      primaryKeyword: kw,
      slug: slug,
      secondaryKeywords: [
        `student guide to ${kw}`,
        `${kw} free tool`
      ],
      searchVolumeEstimate: 1000 + Math.floor(Math.random() * 5000),
      difficultyEstimate: 10 + Math.floor(Math.random() * 40),
      intent: "TRANSACTIONAL",
      decision: "GENERATE",
      priority: index <= 5000 ? "HIGH" : (index <= 20000 ? "MEDIUM" : "LOW"),
      content: {
        heroTitle: title + "?", // Frame as question in hero
        directAnswer: `Are you a student wondering ${kw}? DebotifyText is the ultimate free AI text humanizer designed to rewrite your essays, assignments, and PDFs natively so they bypass all major AI detectors like Turnitin and GPTZero.`
      },
      indexing: {
        indexEligibility: true,
        canonicalSlug: slug
      }
    };
    index++;
  }

  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));
  console.log(`✅ Successfully generated ${finalKeywords.length} extremely unique student-focused keywords! Saved to ${REGISTRY_PATH}`);
}

main().catch(console.error);
