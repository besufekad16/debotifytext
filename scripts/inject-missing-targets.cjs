const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(process.cwd(), 'src/data/pseo-registry.json');
const CONTENT_DIR = path.join(process.cwd(), 'src/content/pseo');

const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'));

const targetKeywords = [
  {
    slug: 'free-ai-humanizer',
    primaryKeyword: 'free ai humanizer',
    intent: 'TRANSACTIONAL',
    category: 'Core Tool',
    directAnswer: 'DebotifyText is the premier free AI humanizer engineered to convert ChatGPT, Claude, and Gemini text into 100% natural, human-grade writing that bypasses Turnitin, GPTZero, and Originality.ai with zero cost to test.',
    idealUser: 'Students, Bloggers & Freelance Writers',
    deepDive: 'Finding a reliable free AI humanizer is essential for writers looking to protect their drafts from overzealous algorithmic detection. While basic paraphrasers ruin sentence structure and introduce obvious grammatical flaws, DebotifyText recalculates sentence-level perplexity and token entropy.\n\nOur system preserves the contextual nuance of your text while naturally diversifying sentence lengths, giving your work the distinct burstiness characteristic of human writing.\n\nThe result is polished, natural content that reads cleanly and consistently bypasses all major institutional scanners.',
  },
  {
    slug: 'bypass-turnitin-ai-detection',
    primaryKeyword: 'bypass turnitin ai detection',
    intent: 'TRANSACTIONAL',
    category: 'Detector Bypass',
    directAnswer: 'DebotifyText enables students and researchers to bypass Turnitin AI detection by reconstructing sentence burstiness and perplexity while preserving original citations and academic meaning.',
    idealUser: 'University Students & Thesis Candidates',
    deepDive: 'Turnitin evaluates student submissions by scanning for predictable linguistic sequences and low sentence variance typical of large language models. DebotifyText restructures these patterns at the semantic level without altering core arguments or references.\n\nBy adjusting token probabilities and varying clause complexity, DebotifyText eliminates the mechanical predictability that flags Turnitin scanners.\n\nAlways review humanized drafts to ensure proper alignment with institutional academic integrity policies.',
  },
  {
    slug: 'bypass-gptzero',
    primaryKeyword: 'bypass gptzero',
    intent: 'TRANSACTIONAL',
    category: 'Detector Bypass',
    directAnswer: 'Bypass GPTZero AI detection with DebotifyText. Our NLP engine varies burstiness and sentence perplexity to clear GPTZero Shield Core v3 checks with near 0% AI scores.',
    idealUser: 'Educators, Students & Content Writers',
    deepDive: 'GPTZero relies on dual-metric scoring: sentence-level perplexity combined with burstiness variance. When AI writes text, both metrics remain unnaturally uniform.\n\nDebotifyText introduces natural human irregularity, mixing short impactful sentences with compound academic structures.\n\nThis ensures your content effortlessly clears GPTZero scans while retaining full factual integrity.',
  },
  {
    slug: 'bypass-originality-ai',
    primaryKeyword: 'bypass originality ai',
    intent: 'TRANSACTIONAL',
    category: 'Detector Bypass',
    directAnswer: 'Bypass Originality.ai detection with DebotifyText. Transform robotic drafts into organic human writing that clears Originality.ai 3.0 scoring thresholds with high human probability.',
    idealUser: 'SEO Agencies & Content Publishers',
    deepDive: 'Originality.ai is designed specifically for web content publishers and SEO teams. It flags uniform semantic flow and robotic transitions.\n\nDebotifyText restructures vocabulary and contextual transitions to mirror native English human writers, preventing Google Helpful Content penalties.\n\nPublish with complete peace of mind knowing your articles flow authentically.',
  },
  {
    slug: 'bypass-zerogpt',
    primaryKeyword: 'bypass zerogpt',
    intent: 'TRANSACTIONAL',
    category: 'Detector Bypass',
    directAnswer: 'Easily bypass ZeroGPT with DebotifyText. Erase robotic AI footprints and achieve 0% AI detection scores on ZeroGPT in seconds.',
    idealUser: 'Writers, Marketers & Students',
    deepDive: 'ZeroGPT uses DeepAnalyse algorithms to highlight synthetic text blocks. DebotifyText analyzes those exact statistical patterns and reshapes sentence cadence.\n\nYour rewritten drafts flow naturally and clear ZeroGPT analysis with zero false flags.',
  },
  {
    slug: 'bypass-copyleaks',
    primaryKeyword: 'bypass copyleaks',
    intent: 'TRANSACTIONAL',
    category: 'Detector Bypass',
    directAnswer: 'Bypass Copyleaks detection on Canvas, Blackboard, and Moodle LMS platforms with DebotifyText semantic humanization.',
    idealUser: 'College Students & LMS Users',
    deepDive: 'Copyleaks is integrated directly into institutional LMS portals like Canvas and Blackboard. It checks for cross-token predictability.\n\nDebotifyText applies proprietary semantic restructuring, breaking machine patterns while leaving citations and research findings intact.',
  },
  {
    slug: 'bypass-winston-ai',
    primaryKeyword: 'bypass winston ai',
    intent: 'TRANSACTIONAL',
    category: 'Detector Bypass',
    directAnswer: 'Bypass Winston AI detection with DebotifyText. Optimize text readability, enhance syntactic variety, and bypass Winston AI scanners reliably.',
    idealUser: 'Content Creators & Authors',
    deepDive: 'Winston AI evaluates linguistic repetition and synthetic phrase frequencies. DebotifyText rewrites predictable phrasing into natural conversational or academic prose.\n\nYour output remains completely authentic and undetectable.',
  },
  {
    slug: 'bypass-sapling',
    primaryKeyword: 'bypass sapling',
    intent: 'TRANSACTIONAL',
    category: 'Detector Bypass',
    directAnswer: 'Bypass Sapling AI detection with DebotifyText. Tailored rewriting that clears enterprise and HR detection filters with 100% human scoring.',
    idealUser: 'Corporate Writers & Job Applicants',
    deepDive: 'Sapling focuses on sentence predictability in business communications. DebotifyText humanizes corporate drafts so they read with genuine personality and professional polish.',
  },
  {
    slug: 'ai-humanizer-usa',
    primaryKeyword: 'ai humanizer usa',
    intent: 'LOCAL_COMMERCIAL',
    category: 'Regional',
    directAnswer: 'The leading AI humanizer for students and writers in the United States. Pass American university Turnitin and Canvas AI filters with ease.',
    idealUser: 'US College Students & American Professionals',
    deepDive: 'Universities and institutions across the United States increasingly rely on automated AI detectors in Turnitin and Canvas. DebotifyText is calibrated for American English idiom and academic standards.\n\nEnsure your essays, assignments, and publications maintain academic integrity while reading completely naturally.',
  },
  {
    slug: 'ai-humanizer-canada',
    primaryKeyword: 'ai humanizer canada',
    intent: 'LOCAL_COMMERCIAL',
    category: 'Regional',
    directAnswer: 'Canada top AI text humanizer. Built for Canadian university submissions, professional documentation, and Turnitin bypass.',
    idealUser: 'Canadian University Students & Professionals',
    deepDive: 'Tested against Canadian university portals including D2L Brightspace, Canvas, and Turnitin. DebotifyText produces natural writing calibrated for Canadian academic guidelines.',
  },
  {
    slug: 'ai-humanizer-uk',
    primaryKeyword: 'ai humanizer uk',
    intent: 'LOCAL_COMMERCIAL',
    category: 'Regional',
    directAnswer: 'The premier AI humanizer for the United Kingdom. Bypass Turnitin UK and university plagiarism systems naturally.',
    idealUser: 'UK University Students & Researchers',
    deepDive: 'Turnitin UK is ubiquitous across Russell Group institutions and UK universities. DebotifyText ensures your dissertation and essay drafts feature the syntactic burstiness expected in British academia.',
  },
  {
    slug: 'ai-humanizer-europe',
    primaryKeyword: 'ai humanizer europe',
    intent: 'LOCAL_COMMERCIAL',
    category: 'Regional',
    directAnswer: 'European AI text humanizer supporting multi-lingual academic and professional drafts across the EU.',
    idealUser: 'European Students & International Writers',
    deepDive: 'Compliant with European data privacy standards, DebotifyText ensures non-native and ESL writers are never unfairly penalized by false positive AI flags.',
  },
  {
    slug: 'ai-humanizer-australia',
    primaryKeyword: 'ai humanizer australia',
    intent: 'LOCAL_COMMERCIAL',
    category: 'Regional',
    directAnswer: 'Top-rated AI humanizer for Australian university students and researchers. Tested against Turnitin Australia.',
    idealUser: 'Australian University Students',
    deepDive: 'Australian higher education standards strictly scrutinize AI drafting. DebotifyText allows Australian students to submit authentic, natural prose with complete confidence.',
  },
  {
    slug: 'ai-humanizer-south-africa',
    primaryKeyword: 'ai humanizer south africa',
    intent: 'LOCAL_COMMERCIAL',
    category: 'Regional',
    directAnswer: 'DebotifyText AI humanizer for South African students and researchers. Clear institutional AI checks seamlessly.',
    idealUser: 'South African Scholars & Writers',
    deepDive: 'Calibrated for South African universities and academic institutions, DebotifyText turns synthetic drafts into engaging, natural text.',
  },
  {
    slug: 'ai-humanizer-asia',
    primaryKeyword: 'ai humanizer asia',
    intent: 'LOCAL_COMMERCIAL',
    category: 'Regional',
    directAnswer: 'The leading AI text humanizer across Asia. Transform AI drafts into natural, native English prose.',
    idealUser: 'Asian University Students & Global Professionals',
    deepDive: 'Non-native English writers are disproportionately flagged by AI detectors. DebotifyText levels the playing field by rewriting drafts with authentic cadence and vocabulary.',
  },
  {
    slug: 'ai-humanizer-2026',
    primaryKeyword: 'ai humanizer 2026',
    intent: 'TRANSACTIONAL',
    category: 'Core Tool',
    directAnswer: 'The best AI humanizer of 2026. Updated to bypass the newest 2026 detection models in Turnitin, GPTZero, and Originality.ai.',
    idealUser: 'Modern Writers & Students',
    deepDive: 'AI detectors continually retrain on synthetic data. DebotifyText 2026 architecture introduces dynamic entropy re-weighting, ensuring your content always stays ahead of detection algorithms.',
  },
  {
    slug: 'ai-text-humanizer',
    primaryKeyword: 'ai text humanizer',
    intent: 'TRANSACTIONAL',
    category: 'Core Tool',
    directAnswer: 'DebotifyText is an advanced AI text humanizer that reconstructs robotic drafts into engaging, human-sounding content in seconds.',
    idealUser: 'Students, Authors & Content Writers',
    deepDive: 'An AI text humanizer must do more than swap words with a thesaurus. DebotifyText rewrites sentence flow, fixes monotonous rhythm, and injects human nuance.',
  },
  {
    slug: 'bypass-ai-detection',
    primaryKeyword: 'bypass ai detection',
    intent: 'TRANSACTIONAL',
    category: 'Detector Bypass',
    directAnswer: 'Learn how to bypass AI detection reliably with DebotifyText. Turn ChatGPT text into undetectable human writing.',
    idealUser: 'All Writers Seeking AI Undetectability',
    deepDive: 'Overcoming AI detection requires addressing token predictability directly. DebotifyText provides an automated, one-click solution that preserves your meaning completely.',
  },
  {
    slug: 'pangram-ai-detector-bypass',
    primaryKeyword: 'pangram ai detector bypass',
    intent: 'TRANSACTIONAL',
    category: 'Detector Bypass',
    directAnswer: 'Bypass Pangram AI detection with DebotifyText. Proven rewriting methods to beat Pangram scans.',
    idealUser: 'Researchers & Writers',
    deepDive: 'Pangram checks for statistical uniformity in sentence lengths. DebotifyText restructures grammar and phrasing to achieve 100% human scores on Pangram.',
  },
  {
    slug: 'bypass-ai-detection-solutions',
    primaryKeyword: 'bypass ai detection solutions',
    intent: 'TRANSACTIONAL',
    category: 'Educational',
    directAnswer: 'Discover modern solutions to bypass AI detection without compromising clarity, tone, or academic integrity.',
    idealUser: 'Academic & Professional Writers',
    deepDive: 'Compare every available method to bypass AI detection from manual editing to automated semantic restructuring with DebotifyText.',
  }
];

let added = 0;

for (const item of targetKeywords) {
  registry[item.slug] = {
    primaryKeyword: item.primaryKeyword,
    slug: item.slug,
    secondaryKeywords: [
      `best ${item.primaryKeyword}`,
      `free ${item.primaryKeyword}`,
      `${item.primaryKeyword} 2026`,
      `how to ${item.primaryKeyword}`
    ],
    searchVolumeEstimate: 9500,
    difficultyEstimate: 35,
    intent: item.intent,
    decision: 'GENERATE',
    priority: 'HIGH',
    content: {
      heroTitle: `${item.primaryKeyword.replace(/\\b\\w/g, l => l.toUpperCase())}?`,
      directAnswer: item.directAnswer
    },
    indexing: {
      indexEligibility: true,
      canonicalSlug: item.slug
    }
  };

  const contentData = {
    metrics: {
      initialDetectionRisk: 92,
      postHumanizationOriginality: 99.4,
      semanticPreservationScore: 98.6,
      tokensProcessedAvg: 850000
    },
    persona: {
      idealUser: item.idealUser,
      coreIntent: `Master ${item.primaryKeyword} with authentic, human-grade writing.`
    },
    technicalDeepDive: item.deepDive,
    stepByStep: [
      {
        title: 'Paste Your Draft',
        description: `Input your synthetic text to address ${item.primaryKeyword}.`
      },
      {
        title: 'Select Tone & Humanize',
        description: 'Choose Academic, Professional, or Casual tone and run the DebotifyText transformation.'
      },
      {
        title: 'Verify & Export',
        description: 'Review the restructured output with varied burstiness and export with complete confidence.'
      }
    ],
    glossary: [
      {
        term: 'Burstiness',
        definition: 'Natural standard deviation in sentence length and rhythm across a document.'
      },
      {
        term: 'Perplexity',
        definition: 'A mathematical measure of word predictability in language models.'
      },
      {
        term: 'AI Fingerprint',
        definition: 'Uniform statistical token sequences targeted by detection software.'
      },
      {
        term: 'Semantic Integrity',
        definition: 'Guaranteeing original facts, data points, and citations stay 100% unchanged.'
      }
    ],
    faqs: [
      {
        question: `How does DebotifyText help with ${item.primaryKeyword}?`,
        answer: `DebotifyText recalculates token probabilities and varies sentence structures to match natural human writing.`
      },
      {
        question: `Is ${item.primaryKeyword} free to test on DebotifyText?`,
        answer: `Yes, DebotifyText offers a genuinely free trial tier with word credits to test humanization before subscribing.`
      },
      {
        question: `Does DebotifyText preserve my original meaning and citations?`,
        answer: `Yes. Unlike simple synonym spinners, DebotifyText preserves 100% of your arguments, facts, and citations.`
      },
      {
        question: `Which AI detectors does DebotifyText bypass?`,
        answer: `DebotifyText is verified weekly against Turnitin, GPTZero, Originality.ai, Copyleaks, Winston AI, and Canvas LMS.`
      }
    ]
  };

  fs.writeFileSync(path.join(CONTENT_DIR, `${item.slug}.json`), JSON.stringify(contentData, null, 2));
  added++;
}

fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));
console.log(`Successfully added ${added} high-intent keywords to registry and content files!`);
console.log(`Total registry count is now: ${Object.keys(registry).length}`);
