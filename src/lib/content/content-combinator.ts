import { uniqueIdx, smartTitleCase } from '~/lib/content/content-utils';

// ── Part pools ────────────────────────────────────────────────────────────────

const TITLE_VERBS = ['Beat', 'Bypass', 'Pass', 'Defeat', 'Eliminate', 'Outsmart', 'Fool', 'Evade', 'Trick', 'Circumvent', 'Remove', 'Fix', 'Crack', 'Escape', 'Neutralize', 'Override', 'Silence', 'Disarm', 'Outrun', 'Conquer'];
const TITLE_ADVERBS = ['Instantly', 'in Seconds', 'for Free', 'in 2026', 'Guaranteed', 'Every Time', 'Permanently', 'Without Effort', 'Right Now', 'Today', 'in Under 10 Seconds', 'with 99.9% Success', 'Without Rewriting', 'in One Click', 'Without Detection', 'Automatically', 'on Any Device', 'Without Sign-up', 'in Real Time', 'with Zero Risk'];
const TITLE_SUFFIXES = ['| HumanifyLab', '— HumanifyLab', '| Free Tool', '| HumanifyLab 2026', '— Free & Instant', '| AI Humanizer', '— No Sign-up', '| Try Free', '| Verified 2026', '— 99.9% Success', '| No Account Needed', '— Instant Results', '| Trusted by 450K+', '— Zero Data Stored', '| Works on Any Device', '— Free Plan Available', '| Academic & Pro Tones', '— Meaning Preserved', '| 50+ Languages', '— Start Free Today'];
const TITLE_FORMATS = [
  '{verb} {keyword} {adverb} {suffix}',
  '{keyword}: {verb} AI Detection {adverb} {suffix}',
  '{keyword} — {verb} Every Detector {adverb} {suffix}',
  'How to {verb} {keyword} {adverb} {suffix}',
  '{keyword}: The {adverb} Solution {suffix}',
  '{verb} {keyword} — {adverb} {suffix}',
  '{keyword} {adverb} — {verb} AI Detection {suffix}',
  '{keyword}: {verb} Turnitin & GPTZero {adverb} {suffix}',
  'Best Way to {verb} {keyword} {adverb} {suffix}',
  '{keyword} — {verb} AI Flags {adverb} {suffix}',
  'The Only Tool to {verb} {keyword} {adverb} {suffix}',
  '{keyword}: Verified {adverb} by 450,000+ Users {suffix}',
  '{verb} {keyword} — No Sign-up, No Card {suffix}',
  '{keyword}: Deep Transformation, {adverb} {suffix}',
  'Stop Getting Flagged — {verb} {keyword} {adverb} {suffix}',
  '{keyword}: 0% AI Score {adverb} {suffix}',
  '{verb} {keyword} with HumanifyLab {adverb} {suffix}',
  '{keyword} — Meaning Preserved, {adverb} {suffix}',
  'Free Tool to {verb} {keyword} {adverb} {suffix}',
  '{keyword}: 99.9% Bypass Rate {adverb} {suffix}',
];

const DESC_OPENERS: ((kw: string) => string)[] = [
  (kw) => `${kw} with HumanifyLab.`,
  (kw) => `Need to ${kw.toLowerCase()}?`,
  (kw) => `${kw}: solved.`,
  (kw) => `Struggling with ${kw.toLowerCase()}?`,
  (kw) => `The best way to ${kw.toLowerCase()} is HumanifyLab.`,
  (kw) => `${kw} — done right.`,
  (kw) => `Fix ${kw.toLowerCase()} in seconds.`,
  (kw) => `${kw}: here's the solution.`,
  (kw) => `Stop worrying about ${kw.toLowerCase()}.`,
  (kw) => `${kw} — we've got you covered.`,
  (kw) => `HumanifyLab makes ${kw.toLowerCase()} effortless.`,
  (kw) => `${kw} is what HumanifyLab was built for.`,
  (kw) => `Thousands of users rely on HumanifyLab for ${kw.toLowerCase()}.`,
  (kw) => `${kw}: the only tool that actually works.`,
  (kw) => `Get 0% AI score when you ${kw.toLowerCase()}.`,
  (kw) => `${kw} — instant, free, and 99.9% effective.`,
  (kw) => `HumanifyLab is the #1 tool for ${kw.toLowerCase()}.`,
  (kw) => `${kw} without rewriting a single word manually.`,
  (kw) => `The fastest way to ${kw.toLowerCase()} is HumanifyLab.`,
  (kw) => `${kw}: verified results, zero data stored.`,
  (kw) => `Use HumanifyLab to ${kw.toLowerCase()} in under 10 seconds.`,
  (kw) => `${kw} — no sign-up, no credit card, instant results.`,
  (kw) => `450,000+ users trust HumanifyLab to ${kw.toLowerCase()}.`,
  (kw) => `${kw}: deep linguistic transformation, not just paraphrasing.`,
  (kw) => `HumanifyLab's 47-dimensional engine handles ${kw.toLowerCase()} perfectly.`,
  (kw) => `${kw} — meaning preserved, AI signature removed.`,
  (kw) => `The permanent solution for ${kw.toLowerCase()} is here.`,
  (kw) => `${kw}: tested weekly against live detectors.`,
  (kw) => `Don't get flagged — use HumanifyLab to ${kw.toLowerCase()}.`,
  (kw) => `${kw} with a 99.9% success rate, every time.`,
];
const DESC_STATS = [
  '99.9% bypass rate.',
  'Trusted by 450,000+ users.',
  'Results in under 10 seconds.',
  'Zero data retention.',
  '50+ languages supported.',
  'Free plan available.',
  'No sign-up required.',
  'Verified weekly against live detectors.',
  'Passes Turnitin, GPTZero, Originality.AI.',
  '0-3% AI score guaranteed.',
  'Beats every major AI detector.',
  'Deep linguistic transformation — not just paraphrasing.',
  '47-dimensional analysis for maximum bypass.',
  'Permanent results — no re-flagging.',
  'Academic, Professional, and Casual tones available.',
  'Bulk processing on paid plans.',
  'API access for developers.',
  'Works on desktop, tablet, and mobile.',
  'Meaning preserved 100%.',
  'Updated weekly as detectors evolve.',
  'Passes Copyleaks, Winston AI, Sapling, and more.',
  'Free plan: 500 words per run, no card needed.',
  'Used by students, writers, and content teams worldwide.',
  'Instant results — no queue, no waiting.',
  'Targets perplexity, burstiness, and semantic entropy.',
  'Verified 0% AI score on Turnitin and GPTZero.',
  'Enterprise plans with unlimited words available.',
  'No watermark, no branding on output.',
  'Supports .txt and .docx file uploads.',
  'Consistent results across all content types.',
];
const DESC_CLOSERS = [
  'Free to try — no sign-up required.',
  'Start free today.',
  'No credit card needed.',
  'Try it now — instant results.',
  'Free plan available.',
  'No account needed.',
  'Get started free.',
  'Instant results, no commitment.',
  'Free, fast, and reliable.',
  'Join 450,000+ users today.',
  'Start in seconds — no registration.',
  'Try free — no card, no catch.',
  'Free plan, instant access.',
  'No watermark. No sign-up. Just results.',
  'Start free, upgrade when you need more.',
  'Works immediately — no setup required.',
  'Free forever plan available.',
  'Try it risk-free today.',
  'No commitment — start free now.',
  'Join the #1 AI humanizer platform.',
  'Trusted by 450K+ users — try free.',
  'Start humanizing in under 30 seconds.',
  'Free plan, no expiry, no card.',
  'Get your first result in under 10 seconds.',
  'No login needed for the free plan.',
  'Start free — results in seconds.',
  'Try HumanifyLab free right now.',
  'Free plan available — no strings attached.',
  'Get started — it takes under a minute.',
  'Join thousands of users — start free.',
];

const H1_FORMATS = [
  '{keyword}: {verb} AI Detection {adverb}',
  '{verb} {keyword} — {adverb}',
  '{keyword} — {verb} Every Detector {adverb}',
  'How to {verb} {keyword} {adverb}',
  '{keyword}: The Fix That Works {adverb}',
  '{verb} {keyword} with 99.9% Success',
  '{keyword} — {verb} AI Flags {adverb}',
  '{keyword}: AI Detection Solved {adverb}',
  'The Best Way to {verb} {keyword}',
  '{verb} {keyword} — Proven Results',
  '{keyword}: Zero AI Score {adverb}',
  '{verb} {keyword} — No Sign-up Needed',
  '{keyword}: Deep Transformation {adverb}',
  '{verb} {keyword} — Meaning Preserved',
  '{keyword}: Verified 99.9% Bypass Rate',
  '{verb} {keyword} — Free & Instant',
  '{keyword}: The Only Tool That Works {adverb}',
  '{verb} {keyword} — Trusted by 450,000+ Users',
  '{keyword}: Permanent Results {adverb}',
  '{verb} {keyword} — Zero Data Stored',
];

// ── Keyword-type-aware formats ────────────────────────────────────────────────
// Keywords come in three grammatical shapes and each needs different phrasing:
//   action   — verb phrases: "bypass turnitin ai detection", "humanize chatgpt text"
//   question — "does turnitin detect chatgpt", "how to humanize ai text"
//   noun     — tool/thing names: "chatgpt humanizer", "humanifylab vs undetectable ai"

const ACTION_FIRST_WORDS = new Set([
  'humanize', 'bypass', 'make', 'get', 'avoid', 'beat', 'pass', 'remove', 'fix',
  'convert', 'rewrite', 'reduce', 'trick', 'fool', 'escape', 'evade', 'defeat',
  'lower', 'clear', 'clean', 'transform', 'turn', 'improve', 'polish', 'disguise',
  'mask', 'hide', 'stop', 'prevent', 'skip', 'cheat', 'outsmart', 'dodge',
]);

const QUESTION_STARTS = [
  'how ', 'what ', 'why ', 'can ', 'does ', 'is ', 'are ', 'do ', 'will ',
  'which ', 'where ', 'when ', 'should ',
];

// First-person declarative keywords ("my professor said...", "i am worried
// my boss will...") read as the searcher describing their own situation.
const STATEMENT_STARTS = ['my ', 'i ', 'our ', 'we '];

export function classifyKeyword(keyword: string): 'action' | 'question' | 'noun' | 'statement' {
  const k = keyword.toLowerCase().trim();
  for (const q of QUESTION_STARTS) {
    if (k.startsWith(q)) return 'question';
  }
  for (const s of STATEMENT_STARTS) {
    if (k.startsWith(s)) return 'statement';
  }
  const first = k.split(' ')[0] ?? '';
  if (ACTION_FIRST_WORDS.has(first)) return 'action';
  return 'noun';
}

// Action keywords ARE the verb — no extra verb is prepended.
const ACTION_TITLE_FORMATS = [
  '{keyword} {adverb} {suffix}',
  'How to {keyword} {adverb} {suffix}',
  '{keyword} — 99.9% Success Rate {suffix}',
  '{keyword}: Works {adverb} {suffix}',
  '{keyword} — Free & Instant {suffix}',
  'The Best Way to {keyword} in 2026 {suffix}',
  '{keyword} — No Sign-up, No Card {suffix}',
  '{keyword}: Meaning Preserved {suffix}',
  '{keyword} — Verified Against Live Detectors {suffix}',
  '{keyword}: 0% AI Score {adverb} {suffix}',
  '{keyword} — Deep Transformation, Not Paraphrasing {suffix}',
  '{keyword} in Under 10 Seconds {suffix}',
];

const ACTION_H1_FORMATS = [
  '{keyword} — {adverb}',
  'How to {keyword} {adverb}',
  '{keyword} with a 99.9% Success Rate',
  '{keyword} — Free, Fast & Reliable',
  '{keyword}: Verified Results {adverb}',
  '{keyword} — Meaning Preserved, AI Signature Removed',
  '{keyword}: Zero AI Score {adverb}',
  'The Proven Way to {keyword}',
  '{keyword} — No Sign-up Needed',
  '{keyword} in Under 10 Seconds',
];

const QUESTION_TITLE_FORMATS = [
  '{keyword}? Here Is the Answer {suffix}',
  '{keyword} — Answered for 2026 {suffix}',
  '{keyword}: Everything You Need to Know {suffix}',
  '{keyword} — Explained Simply {suffix}',
  '{keyword}: Complete 2026 Guide {suffix}',
  '{keyword} — The Full Answer {suffix}',
  '{keyword}? What the Tests Show {suffix}',
  '{keyword}: Answered + the Fix {suffix}',
  '{keyword} — Guide & Free Tool {suffix}',
  '{keyword}: Step-by-Step Guide {suffix}',
];

const QUESTION_H1_FORMATS = [
  '{keyword}? Here Is the Answer',
  '{keyword} — Answered for 2026',
  '{keyword}: Everything You Need to Know',
  '{keyword} — Explained Simply',
  '{keyword}: The Complete Guide',
  '{keyword}? What Our Tests Show',
  '{keyword} — The Full Answer (and the Fix)',
  '{keyword}: Answered Step by Step',
];

const NOUN_TITLE_FORMATS = [
  '{keyword} — Free AI Humanizer {suffix}',
  '{keyword}: 99.9% Undetectable Results {suffix}',
  'The Best {keyword} in 2026 {suffix}',
  '{keyword} — Pass Every AI Detector {suffix}',
  '{keyword}: Humanize AI Text {adverb} {suffix}',
  '{keyword} — Instant, Accurate & Free {suffix}',
  '{keyword} That Actually Works in 2026 {suffix}',
  '{keyword}: Free Plan, Instant Results {suffix}',
  'Try {keyword} — No Sign-up Needed {suffix}',
  '{keyword}: Meaning Preserved, AI Removed {suffix}',
];

const NOUN_H1_FORMATS = [
  '{keyword} — Humanize AI Text {adverb}',
  'The Best {keyword} for 2026',
  '{keyword}: Pass Every AI Detector',
  '{keyword} — Free, Fast & Undetectable',
  '{keyword}: 99.9% Human Score {adverb}',
  '{keyword} That Actually Works',
  '{keyword} — Instant Results, Meaning Preserved',
  '{keyword}: Undetectable AI Writing {adverb}',
];

// First-person statement keywords ("my professor said my essay sounds like
// ai") — used by the v5 `scenario` cluster. Neither the noun formats ("...
// That Actually Works in 2026") nor the question formats fit a declarative
// sentence, so these frame the keyword as the reader's situation and the
// page as the fix.
const STATEMENT_TITLE_FORMATS = [
  '{keyword}? Here Is the Fix {suffix}',
  '{keyword} — What to Do Next {suffix}',
  '{keyword}: The Fix Takes 10 Seconds {suffix}',
  '{keyword} — Solved in 2026 {suffix}',
  '{keyword}? Do This First {suffix}',
  '{keyword} — The Step-by-Step Fix {suffix}',
  '{keyword}: Here Is Your Way Out {suffix}',
  '{keyword} — Fix It Before You Submit {suffix}',
];

const STATEMENT_H1_FORMATS = [
  '{keyword}? Here Is the Fix',
  '{keyword} — What to Do Next',
  '{keyword}: The Fix Takes 10 Seconds',
  '{keyword} — Do This Before You Submit',
  '{keyword}? You Have Options',
  '{keyword} — The Step-by-Step Fix',
  '{keyword}: Here Is Your Way Out',
  '{keyword} — Solved',
];

const STATEMENT_DESC_OPENERS: ((kw: string) => string)[] = [
  (kw) => `${kw}? Here is exactly what to do.`,
  (kw) => `"${kw}" — a situation thousands face. Here is the fix.`,
  (kw) => `${kw}? Don't panic — the fix takes under a minute.`,
  (kw) => `${kw}? HumanifyLab solves this before anyone sees your draft.`,
  (kw) => `If ${kw.toLowerCase()}, here is your step-by-step way out.`,
  (kw) => `${kw} — the fix is simpler than you think.`,
];

const STATEMENT_HERO_A: ((kw: string) => string)[] = [
  (kw) => `"${kw}" — if that sounds familiar, you are not alone, and it is fixable in under a minute.`,
  (kw) => `Thousands of people search "${kw.toLowerCase()}" every month. Here is the fix that actually works.`,
  (kw) => `${kw}? The problem is statistical patterns in your text — and HumanifyLab removes them completely.`,
  (kw) => `This exact situation — ${kw.toLowerCase()} — is what HumanifyLab was built to solve.`,
];

const QUESTION_DESC_OPENERS: ((kw: string) => string)[] = [
  (kw) => `${kw}? Here is the clear answer.`,
  (kw) => `${kw}? We tested it so you don't have to.`,
  (kw) => `Wondering ${kw.toLowerCase()}? Here is what actually happens.`,
  (kw) => `${kw} — answered with real test results.`,
  (kw) => `The short answer to "${kw.toLowerCase()}" — plus the fix.`,
  (kw) => `${kw}? Get the full answer and the solution.`,
];

const NOUN_DESC_OPENERS: ((kw: string) => string)[] = [
  (kw) => `Looking for ${kw.toLowerCase().startsWith('the ') ? kw.toLowerCase() : 'a ' + kw.toLowerCase()}? HumanifyLab delivers.`,
  (kw) => `${kw} — powered by HumanifyLab.`,
  (kw) => `HumanifyLab is the ${kw.toLowerCase()} that actually works.`,
  (kw) => `${kw}: instant results, meaning preserved.`,
  (kw) => `The most reliable ${kw.toLowerCase()} in 2026.`,
  (kw) => `${kw} — free plan, no sign-up, no watermark.`,
];

const QUESTION_HERO_A: ((kw: string) => string)[] = [
  (kw) => `${kw}? HumanifyLab has tested this against live detection systems — here is what you need to know.`,
  (kw) => `The question "${kw.toLowerCase()}" comes up constantly. We ran the tests and built the fix.`,
  (kw) => `${kw}? The answer matters if you use AI to write. Here is the complete picture for 2026.`,
  (kw) => `We test AI detectors weekly, so we can answer "${kw.toLowerCase()}" with real data — not guesses.`,
];

const NOUN_HERO_A: ((kw: string) => string)[] = [
  (kw) => `HumanifyLab is the most reliable ${kw.toLowerCase()} available in 2026.`,
  (kw) => `Over 450,000 users trust HumanifyLab as their ${kw.toLowerCase()}.`,
  (kw) => `HumanifyLab delivers what every ${kw.toLowerCase()} promises — verified 99.9% bypass rate across all major detectors.`,
  (kw) => `As a ${kw.toLowerCase()}, HumanifyLab targets perplexity, burstiness, and semantic entropy — the exact signals detectors measure.`,
];

const TYPE_NEUTRAL_HERO_B: ((kw: string) => string)[] = [
  () => `Paste your content, click Humanize, and get a 0% AI score in under 10 seconds.`,
  () => `Your original meaning is preserved 100% — only the AI signature is removed.`,
  () => `Passes Turnitin, GPTZero, Originality.AI, Copyleaks, and more.`,
  () => `Free plan handles up to 500 words per run — no sign-up, no credit card.`,
  () => `Academic, Professional, and Casual tone presets are included.`,
  () => `Works on any device — desktop, tablet, or mobile, with zero data stored.`,
];

const HERO_PARTS_A: ((kw: string) => string)[] = [
  (kw) => `HumanifyLab is the most reliable AI humanizer for ${kw.toLowerCase()} in 2026.`,
  (kw) => `Over 450,000 users trust HumanifyLab to ${kw.toLowerCase()} every day.`,
  (kw) => `HumanifyLab achieves a 99.9% bypass rate for ${kw.toLowerCase()} across all major detectors.`,
  (kw) => `Deep linguistic transformation makes ${kw.toLowerCase()} effortless — not just synonym replacement.`,
  (kw) => `HumanifyLab targets perplexity, burstiness, and semantic entropy to ${kw.toLowerCase()} perfectly.`,
  (kw) => `The fastest tool for ${kw.toLowerCase()} — results in under 10 seconds, every time.`,
  (kw) => `HumanifyLab is tested weekly against live detectors to ensure ${kw.toLowerCase()} works reliably.`,
  (kw) => `Zero data retention — your content is never stored when you ${kw.toLowerCase()} with HumanifyLab.`,
  (kw) => `HumanifyLab supports 50+ languages for ${kw.toLowerCase()} with the same 99.9% bypass rate.`,
  (kw) => `Free plan available — no credit card, no sign-up required to ${kw.toLowerCase()}.`,
  (kw) => `HumanifyLab's 47-dimensional engine is purpose-built for ${kw.toLowerCase()}.`,
  (kw) => `Students, writers, and professionals worldwide use HumanifyLab to ${kw.toLowerCase()}.`,
  (kw) => `No other tool matches HumanifyLab's accuracy when it comes to ${kw.toLowerCase()}.`,
  (kw) => `HumanifyLab permanently removes AI signatures — ideal for ${kw.toLowerCase()}.`,
  (kw) => `Verified 0-3% AI score every time you use HumanifyLab to ${kw.toLowerCase()}.`,
  (kw) => `HumanifyLab is updated weekly so ${kw.toLowerCase()} stays effective as detectors evolve.`,
  (kw) => `The #1 rated tool for ${kw.toLowerCase()} — trusted by 450,000+ users worldwide.`,
  (kw) => `HumanifyLab preserves 100% of your original meaning while you ${kw.toLowerCase()}.`,
  (kw) => `Academic, Professional, and Casual tones — all available for ${kw.toLowerCase()}.`,
  (kw) => `Bulk processing and API access make ${kw.toLowerCase()} scalable for any team.`,
];

const HERO_PARTS_B: ((kw: string) => string)[] = [
  (kw) => `Paste your content, click Humanize, get 0% AI score — ${kw.toLowerCase()} done.`,
  (kw) => `No waiting, no queues — ${kw.toLowerCase()} delivers instant results every time.`,
  (kw) => `Your original meaning is preserved 100% when you ${kw.toLowerCase()} with HumanifyLab.`,
  (kw) => `Works on any device — ${kw.toLowerCase()} from desktop, tablet, or mobile.`,
  (kw) => `Passes Turnitin, GPTZero, Originality.AI, Copyleaks, and more — ${kw.toLowerCase()} guaranteed.`,
  (kw) => `Free plan handles up to 500 words per run — start ${kw.toLowerCase()} today.`,
  (kw) => `Upgrade for unlimited words, bulk processing, and API access for ${kw.toLowerCase()}.`,
  (kw) => `Academic, Professional, and Casual tone presets available for ${kw.toLowerCase()}.`,
  (kw) => `Maximum intensity mode for the strictest detectors — ${kw.toLowerCase()} with confidence.`,
  (kw) => `Results are permanent — ${kw.toLowerCase()} once and never get re-flagged.`,
  (kw) => `No sign-up required — ${kw.toLowerCase()} immediately with the free plan.`,
  (kw) => `50+ languages supported — ${kw.toLowerCase()} in any language with 99.9% success.`,
  (kw) => `Zero data stored — your content is safe when you ${kw.toLowerCase()}.`,
  (kw) => `Tested weekly against live systems — ${kw.toLowerCase()} stays effective as detectors update.`,
  (kw) => `Deep transformation, not paraphrasing — ${kw.toLowerCase()} at the statistical level.`,
  (kw) => `Trusted by 450,000+ users — ${kw.toLowerCase()} with the platform that actually works.`,
  (kw) => `API access available — automate ${kw.toLowerCase()} in your content pipeline.`,
  (kw) => `Bulk mode available — ${kw.toLowerCase()} multiple documents simultaneously.`,
  (kw) => `0-3% AI score guaranteed — ${kw.toLowerCase()} and submit with complete confidence.`,
  (kw) => `Free forever plan — ${kw.toLowerCase()} without spending a cent.`,
];

const BADGE_PREFIXES = ['AI Humanizer', 'Bypass Tool', 'Detection Fix', 'Score Reducer', 'Content Tool', 'Humanization Engine', 'AI Detector Bypass', 'Undetectable AI', 'Deep Transformer', 'Linguistic Engine', 'AI Score Eliminator', 'Detection Remover', 'Human Text Converter', 'AI Flag Remover', 'Bypass Solution', 'Undetectable Writer', 'AI Content Fixer', 'Detection Beater', 'Score Zeroing Tool', 'AI Signature Eraser'];
const BADGE_SUFFIXES = ['2026', 'Free', 'Instant', 'Verified', 'Pro', 'Trusted', 'Top Rated', '#1 Tool', 'No Sign-up', 'Guaranteed', '99.9%', 'Permanent', 'Zero Data', '450K+ Users', 'Weekly Updated', 'All Detectors', 'Any Language', 'Any Device', 'Bulk Ready', 'API Ready'];

const FAQ_TITLE_FORMATS = [
  'Frequently Asked Questions',
  'Common Questions Answered',
  'Everything You Need to Know',
  'Your Questions, Answered',
  'FAQs About {keyword}',
  '{keyword}: Common Questions',
  'What People Ask About {keyword}',
  'Questions & Answers',
  'Need Help? Read This First',
  'Quick Answers',
  '{keyword}: FAQ Guide',
  'Top Questions About {keyword}',
  'What You Need to Know About {keyword}',
  '{keyword}: Answers to Common Questions',
  'Everything About {keyword}',
  '{keyword}: Your Questions Answered',
  'Common {keyword} Questions',
  'The {keyword} FAQ',
  'Ask Us About {keyword}',
  '{keyword}: What Users Ask Most',
];

const CTA_TITLE_FORMATS = [
  'Get Started with {keyword} Today',
  '{keyword} — Start Free Now',
  'Try HumanifyLab Free',
  'Fix {keyword} in Seconds',
  'Start Bypassing AI Detection',
  'Get 0% AI Score Now',
  'Join 450,000+ Users',
  '{keyword} — No Sign-up Needed',
  'Start Free — Instant Results',
  'Try HumanifyLab for {keyword}',
  '{keyword} — Try It Free Right Now',
  'Start {keyword} with HumanifyLab',
  'Get Your First Result in 10 Seconds',
  '{keyword} — Free Plan, No Card',
  'Humanize Your Content Now',
  '{keyword}: Start Free Today',
  'Beat AI Detection — Try Free',
  '{keyword} — Join 450K+ Users',
  'Get 0% AI Score for {keyword}',
  '{keyword} — Instant, Free, Reliable',
];

const CTA_SUBTITLE_FORMATS = [
  'Free plan available. No sign-up required. Results in under 10 seconds.',
  'Join 450,000+ users who trust HumanifyLab. Start free — no credit card needed.',
  '99.9% bypass rate. Zero data stored. Instant results. Try free today.',
  'No account needed. Paste your content and get 0% AI score in seconds.',
  'Free plan, instant results, meaning preserved. Start now.',
  'Trusted by students and professionals worldwide. Free to start.',
  '99.9% bypass rate across Turnitin, GPTZero, Originality.AI. Free plan.',
  'Deep transformation, permanent results, zero data stored. Try free.',
  'No credit card. No sign-up. No watermark. Just results.',
  'Start free, upgrade when you need more. No commitment required.',
  'Free forever plan. 500 words per run. No card, no catch.',
  'Instant results. Meaning preserved. Zero data retention. Start free.',
  'Trusted by 450K+ users. 99.9% bypass rate. Free to start today.',
  'No registration needed. Paste and humanize in under 10 seconds.',
  'Free plan available. Works on any device. No download required.',
  'Join the #1 AI humanizer platform. Free plan, instant access.',
  '0-3% AI score guaranteed. Free plan. No sign-up. Start now.',
  'Permanent results. 50+ languages. Free plan available today.',
  'Tested weekly against live detectors. Free to start. No card needed.',
  'Academic, Professional, Casual tones. Free plan. Instant results.',
  'Bulk processing available. API access on paid plans. Start free.',
  'Zero data stored. Meaning preserved. 99.9% bypass. Try free.',
  'Works with Turnitin, GPTZero, Copyleaks, and 10+ more. Free plan.',
  'No watermark. No branding. Just clean, undetectable output. Free.',
  'Start in seconds. No setup. No account. Just paste and humanize.',
  'Free plan: 500 words, unlimited runs, no expiry. Start today.',
  'Trusted by PhD students, content teams, and copywriters. Free plan.',
  '47-dimensional transformation. 99.9% bypass. Free to start.',
  'Results in under 10 seconds. Zero data stored. Free plan available.',
  'The only humanizer with a verified 99.9% bypass rate. Try free.',
];

// ── FAQ pools ─────────────────────────────────────────────────────────────────

const FAQ_QUESTION_TEMPLATES = [
  (kw: string) => `Does HumanifyLab really work for ${kw.toLowerCase()}?`,
  (kw: string) => `How long does it take to ${kw.toLowerCase()} with HumanifyLab?`,
  (kw: string) => `Is HumanifyLab free for ${kw.toLowerCase()}?`,
  (kw: string) => `Will my content still make sense after using HumanifyLab for ${kw.toLowerCase()}?`,
  (kw: string) => `Which AI detectors does HumanifyLab beat when I need to ${kw.toLowerCase()}?`,
  (kw: string) => `Do I need to create an account to ${kw.toLowerCase()}?`,
  (kw: string) => `How does HumanifyLab achieve ${kw.toLowerCase()} without ruining my text?`,
  (kw: string) => `Is it safe to use HumanifyLab to ${kw.toLowerCase()}?`,
  (kw: string) => `What's the word limit when I use HumanifyLab to ${kw.toLowerCase()}?`,
  (kw: string) => `Can I ${kw.toLowerCase()} in languages other than English?`,
  (kw: string) => `How is HumanifyLab different from other tools for ${kw.toLowerCase()}?`,
  (kw: string) => `Will the results for ${kw.toLowerCase()} be permanent?`,
  (kw: string) => `Does HumanifyLab store my content when I ${kw.toLowerCase()}?`,
  (kw: string) => `What success rate does HumanifyLab have for ${kw.toLowerCase()}?`,
  (kw: string) => `Can I use HumanifyLab to ${kw.toLowerCase()} on mobile?`,
  (kw: string) => `How many times can I ${kw.toLowerCase()} for free?`,
  (kw: string) => `Does HumanifyLab work for academic content when I need to ${kw.toLowerCase()}?`,
  (kw: string) => `What tone options are available when I ${kw.toLowerCase()}?`,
  (kw: string) => `Is there an API for bulk ${kw.toLowerCase()}?`,
  (kw: string) => `How does HumanifyLab handle ${kw.toLowerCase()} for long documents?`,
  (kw: string) => `Why do I need a tool specifically for ${kw.toLowerCase()}?`,
  (kw: string) => `What makes HumanifyLab the best choice for ${kw.toLowerCase()}?`,
  (kw: string) => `Can I ${kw.toLowerCase()} without any technical knowledge?`,
  (kw: string) => `How often is HumanifyLab updated to keep ${kw.toLowerCase()} effective?`,
  (kw: string) => `Does ${kw.toLowerCase()} work for all types of content?`,
  (kw: string) => `What happens to my text after I ${kw.toLowerCase()} with HumanifyLab?`,
  (kw: string) => `Can I ${kw.toLowerCase()} and still maintain my original writing style?`,
  (kw: string) => `Is HumanifyLab's approach to ${kw.toLowerCase()} ethical?`,
  (kw: string) => `How does HumanifyLab compare to paraphrasers for ${kw.toLowerCase()}?`,
  (kw: string) => `What's the best way to get started with ${kw.toLowerCase()}?`,
];

const FAQ_ANSWER_TEMPLATES: ((kw: string) => string)[] = [
  (kw) => `Yes. HumanifyLab achieves a 99.9% bypass rate for ${kw.toLowerCase()} across all major AI detectors, verified weekly against live systems.`,
  (kw) => `Results for ${kw.toLowerCase()} are instant — under 10 seconds for most documents. No queues, no waiting.`,
  (kw) => `Yes. The free plan handles up to 500 words per run for ${kw.toLowerCase()} with no sign-up required. Upgrade for unlimited access.`,
  (kw) => `Absolutely. HumanifyLab preserves 100% of your original meaning while transforming the linguistic signature for ${kw.toLowerCase()}.`,
  (kw) => `HumanifyLab beats Turnitin, GPTZero, Originality.AI, Copyleaks, ZeroGPT, and all other major detectors when you ${kw.toLowerCase()}.`,
  (kw) => `No account needed. Paste your content, click Humanize, and ${kw.toLowerCase()} instantly — no sign-up required.`,
  (kw) => `HumanifyLab uses deep linguistic transformation targeting perplexity, burstiness, and semantic entropy to ${kw.toLowerCase()} without distorting your text.`,
  (kw) => `Completely safe. HumanifyLab uses zero data retention — your content is never stored, logged, or shared when you ${kw.toLowerCase()}.`,
  (kw) => `The free plan handles up to 500 words for ${kw.toLowerCase()}. Pro and Unlimited plans remove all word limits.`,
  (kw) => `Yes. HumanifyLab supports 50+ languages for ${kw.toLowerCase()} with the same 99.9% bypass rate as English.`,
  (kw) => `Unlike basic paraphrasers, HumanifyLab targets the statistical patterns detectors actually measure — making ${kw.toLowerCase()} genuinely effective, not just surface-level rewording.`,
  (kw) => `Yes. The transformation for ${kw.toLowerCase()} is permanent. Detectors will not flag the output even on re-scan.`,
  (kw) => `Never. HumanifyLab has a strict zero data retention policy. Your content is processed and immediately discarded after ${kw.toLowerCase()}.`,
  (kw) => `99.9% bypass rate for ${kw.toLowerCase()} across all major detectors, with results verified weekly against live Turnitin and GPTZero systems.`,
  (kw) => `Yes. HumanifyLab works on any device for ${kw.toLowerCase()} — desktop, tablet, or mobile — with no app download required.`,
  (kw) => `The free plan gives you unlimited runs for ${kw.toLowerCase()} up to 500 words each. No daily cap, no credit card required.`,
  (kw) => `Yes. HumanifyLab includes an Academic tone preset specifically tuned for university-level writing when you ${kw.toLowerCase()}.`,
  (kw) => `Academic, Professional, and Casual tone presets are available for ${kw.toLowerCase()}. Choose the one that fits your context.`,
  (kw) => `Yes. The HumanifyLab API supports bulk processing for ${kw.toLowerCase()} for teams and developers. Available on Pro and Unlimited plans.`,
  (kw) => `HumanifyLab processes long documents in chunks for ${kw.toLowerCase()}, ensuring consistent bypass rates throughout the entire text.`,
  (kw) => `AI detectors are specifically designed to catch AI-generated content. Without a dedicated tool for ${kw.toLowerCase()}, your content will be flagged. HumanifyLab solves this permanently.`,
  (kw) => `HumanifyLab is purpose-built for ${kw.toLowerCase()} — it targets the exact statistical signals detectors measure, not just surface-level wording. That's why it achieves 99.9% bypass rates.`,
  (kw) => `Yes. HumanifyLab is designed for everyone — just paste your content and click Humanize. No technical knowledge needed to ${kw.toLowerCase()}.`,
  (kw) => `HumanifyLab is updated weekly to ensure ${kw.toLowerCase()} stays effective as AI detectors evolve. Our team monitors every detector update.`,
  (kw) => `Yes. HumanifyLab handles essays, research papers, blog posts, marketing copy, reports, and any other content type for ${kw.toLowerCase()}.`,
  (kw) => `After you ${kw.toLowerCase()} with HumanifyLab, your content is immediately deleted from our servers. We have a strict zero data retention policy.`,
  (kw) => `Yes. HumanifyLab preserves your voice and style while transforming the AI signature. You can also choose tone presets to match your natural writing register when you ${kw.toLowerCase()}.`,
  (kw) => `HumanifyLab is a tool that helps you present your ideas in natural human writing. Always review your institution's or platform's policies regarding AI use when you ${kw.toLowerCase()}.`,
  (kw) => `Paraphrasers only change surface-level wording and don't address the statistical patterns detectors measure. HumanifyLab's approach to ${kw.toLowerCase()} targets the exact signals detectors look for.`,
  (kw) => `The easiest way to get started with ${kw.toLowerCase()} is to paste your content into HumanifyLab, select your tone, and click Humanize. Results appear in under 10 seconds — no account needed.`,
];

// ── Step pools ────────────────────────────────────────────────────────────────

const STEP_TITLE_TEMPLATES = [
  (kw: string) => `Paste Your Content`,
  (kw: string) => `Select Your Tone`,
  (kw: string) => `Click Humanize`,
  (kw: string) => `Get Your Results`,
  (kw: string) => `Copy & Use`,
  (kw: string) => `Choose Intensity`,
  (kw: string) => `Verify Your Score`,
  (kw: string) => `Upload Your Document`,
  (kw: string) => `Select Language`,
  (kw: string) => `Review the Output`,
  (kw: string) => `Run the Detector`,
  (kw: string) => `Adjust if Needed`,
  (kw: string) => `Download Your Text`,
  (kw: string) => `Set Word Limit`,
  (kw: string) => `Enable Bulk Mode`,
  (kw: string) => `Access the API`,
  (kw: string) => `Check Your Score`,
  (kw: string) => `Submit Your Work`,
  (kw: string) => `Share Your Results`,
  (kw: string) => `Upgrade for More`,
  (kw: string) => `Open HumanifyLab`,
  (kw: string) => `Configure Settings`,
  (kw: string) => `Process Your Draft`,
  (kw: string) => `Confirm & Deliver`,
  (kw: string) => `Start for Free`,
];

const STEP_DESC_TEMPLATES = [
  (kw: string) => `Copy your AI-generated text and paste it into the HumanifyLab editor to ${kw.toLowerCase()}. Works with any content up to 500 words on the free plan.`,
  (kw: string) => `Choose Academic, Professional, or Casual tone to match your context for ${kw.toLowerCase()}. Each preset is tuned for different use cases.`,
  (kw: string) => `Hit the Humanize button and let HumanifyLab transform your text to ${kw.toLowerCase()}. Deep linguistic processing starts immediately.`,
  (kw: string) => `Your humanized content is ready in under 10 seconds. The AI signature has been completely removed — ${kw.toLowerCase()} done.`,
  (kw: string) => `Copy the output and use it anywhere. The transformation for ${kw.toLowerCase()} is permanent — no re-flagging on future scans.`,
  (kw: string) => `Set the intensity level to match your detector's strictness for ${kw.toLowerCase()}. Maximum intensity for Turnitin and GPTZero.`,
  (kw: string) => `Run your text through any AI detector to confirm the 0% AI score after ${kw.toLowerCase()}. HumanifyLab guarantees the result.`,
  (kw: string) => `Upload a .txt or .docx file directly to ${kw.toLowerCase()}. HumanifyLab processes the full document and returns the humanized version.`,
  (kw: string) => `Select from 50+ supported languages for ${kw.toLowerCase()}. HumanifyLab achieves the same 99.9% bypass rate in every language.`,
  (kw: string) => `Read through the output to confirm your meaning is preserved after ${kw.toLowerCase()}. HumanifyLab maintains 100% semantic accuracy.`,
  (kw: string) => `Test the output in Turnitin, GPTZero, or Originality.AI after ${kw.toLowerCase()}. Expect a 0-3% AI score every time.`,
  (kw: string) => `If you want further adjustments after ${kw.toLowerCase()}, run the text through HumanifyLab again. Each pass adds more variation.`,
  (kw: string) => `Download the humanized text as a .txt or .docx file after ${kw.toLowerCase()}. Ready to submit or publish immediately.`,
  (kw: string) => `Set a custom word limit for your ${kw.toLowerCase()} run. The free plan handles up to 500 words per submission.`,
  (kw: string) => `Enable bulk mode to process multiple documents at once for ${kw.toLowerCase()}. Available on Pro and Unlimited plans.`,
  (kw: string) => `Integrate HumanifyLab into your workflow via API for automated ${kw.toLowerCase()}. Supports batch processing for high-volume needs.`,
  (kw: string) => `Check your AI score before and after ${kw.toLowerCase()}. HumanifyLab consistently delivers 0-3% AI scores.`,
  (kw: string) => `Submit your humanized content with confidence after ${kw.toLowerCase()}. HumanifyLab's results are verified weekly against live detectors.`,
  (kw: string) => `Share your results with your team after ${kw.toLowerCase()}. HumanifyLab's output is clean, professional, and ready to use.`,
  (kw: string) => `Upgrade to Pro or Unlimited for unlimited words, bulk processing, API access, and priority support for ${kw.toLowerCase()}.`,
  (kw: string) => `Go to HumanifyLab.com to start ${kw.toLowerCase()}. The free plan handles up to 500 words per run — no sign-up needed.`,
  (kw: string) => `Pick the tone that matches your context and set the humanization level for ${kw.toLowerCase()}. Maximum is recommended for strict detectors.`,
  (kw: string) => `HumanifyLab applies 47-dimensional linguistic transformation to your content for ${kw.toLowerCase()}. The result is statistically indistinguishable from human writing.`,
  (kw: string) => `Verify your score against the target detector after ${kw.toLowerCase()}. With HumanifyLab, you'll consistently see 0-3% AI — ready to submit or publish.`,
  (kw: string) => `No account required for the free plan — start ${kw.toLowerCase()} immediately. Just paste your content and click Humanize.`,
];

// ── Feature pools ─────────────────────────────────────────────────────────────

const FEATURE_ICONS = ['🚀', '🛡️', '⚡', '🎯', '🔬', '🌍', '🔒', '📊', '✅', '💡', '🧬', '📈', '🤖', '🔑', '💎', '⚙️', '📝', '🏆', '🔥', '💯', '🎓', '🔌', '📱', '🌐', '🔄', '🧠', '⭐', '🎨', '📋', '🔎'];

const FEATURE_TITLE_TEMPLATES = [
  '99.9% Bypass Rate',
  'Instant Results',
  'Zero Data Retention',
  '50+ Languages',
  'Meaning Preserved',
  'Free Plan Available',
  'No Sign-up Required',
  'Weekly Verification',
  'Deep Transformation',
  'Permanent Results',
  'Academic Tone Preset',
  'Professional Tone Preset',
  'Bulk Processing',
  'API Access',
  'Mobile Friendly',
  'Turnitin Verified',
  'GPTZero Verified',
  'Originality.AI Verified',
  'Maximum Intensity Mode',
  'Unlimited Word Plans',
  'Casual Tone Preset',
  'File Upload Support',
  'Real-Time Processing',
  'Semantic Accuracy',
  'Multi-Detector Coverage',
  '47-Dimensional Analysis',
  'Enterprise Plans',
  'No Watermark',
  'Copyleaks Verified',
  'Winston AI Verified',
];

const FEATURE_DESC_TEMPLATES: ((kw: string) => string)[] = [
  (kw) => `HumanifyLab achieves a 99.9% bypass rate for ${kw.toLowerCase()} across all major AI detectors, verified weekly against live systems.`,
  (kw) => `Get humanized content for ${kw.toLowerCase()} in under 10 seconds. No queues, no waiting — instant results every time.`,
  (kw) => `Your content is never stored, logged, or shared when you ${kw.toLowerCase()}. Strict zero data retention policy on every plan.`,
  (kw) => `HumanifyLab supports 50+ languages for ${kw.toLowerCase()} with the same 99.9% bypass rate as English content.`,
  (kw) => `Deep linguistic transformation preserves 100% of your original meaning while removing AI signatures for ${kw.toLowerCase()}.`,
  (kw) => `The free plan handles up to 500 words per run for ${kw.toLowerCase()}. No credit card, no sign-up, no commitment.`,
  (kw) => `Paste your content and ${kw.toLowerCase()} immediately. No account creation required to get started.`,
  (kw) => `HumanifyLab is tested weekly against live Turnitin and GPTZero systems to ensure ${kw.toLowerCase()} stays effective.`,
  (kw) => `Targets perplexity, burstiness, and semantic entropy simultaneously for ${kw.toLowerCase()} — not just synonym replacement.`,
  (kw) => `The transformation for ${kw.toLowerCase()} is permanent. Your humanized content will not be re-flagged on future scans.`,
  (kw) => `Academic tone preset is tuned for university-level writing when you ${kw.toLowerCase()}, passing Turnitin with 0-3% AI scores.`,
  (kw) => `Professional tone preset delivers polished, business-ready content that passes all workplace AI checks for ${kw.toLowerCase()}.`,
  (kw) => `Process multiple documents at once with bulk mode for ${kw.toLowerCase()}. Available on Pro and Unlimited plans.`,
  (kw) => `Integrate HumanifyLab into your workflow via REST API for automated ${kw.toLowerCase()}. Supports high-volume batch processing.`,
  (kw) => `Works on any device for ${kw.toLowerCase()} — desktop, tablet, or mobile — with no app download required.`,
  (kw) => `Verified to achieve 0-3% AI scores on Turnitin for ${kw.toLowerCase()}, the world's most widely used academic detector.`,
  (kw) => `Verified to achieve 0-3% AI scores on GPTZero for ${kw.toLowerCase()}, trusted by educators and institutions worldwide.`,
  (kw) => `Verified to achieve 0-3% AI scores on Originality.AI for ${kw.toLowerCase()}, the standard for publishers and agencies.`,
  (kw) => `Maximum intensity mode targets the strictest detectors with the most aggressive transformation for ${kw.toLowerCase()}.`,
  (kw) => `Pro and Unlimited plans remove all word limits for ${kw.toLowerCase()}. Process entire books, reports, or datasets in one run.`,
  (kw) => `Casual tone preset produces natural, conversational writing that passes all AI detectors for ${kw.toLowerCase()}.`,
  (kw) => `Upload .txt or .docx files directly for ${kw.toLowerCase()}. HumanifyLab processes the full document and returns humanized output.`,
  (kw) => `HumanifyLab processes your content in real time for ${kw.toLowerCase()} — watch the transformation happen as it runs.`,
  (kw) => `Every idea, fact, and argument is preserved when you ${kw.toLowerCase()} with HumanifyLab. Only the AI signature is removed.`,
  (kw) => `HumanifyLab bypasses Turnitin, GPTZero, Originality.AI, Copyleaks, ZeroGPT, Winston AI, and more for ${kw.toLowerCase()}.`,
  (kw) => `HumanifyLab's 47-dimensional analysis targets every statistical signal detectors measure for ${kw.toLowerCase()}.`,
  (kw) => `Enterprise plans with unlimited words, dedicated support, and custom API limits are available for ${kw.toLowerCase()} at scale.`,
  (kw) => `No watermark, no branding on output — your humanized content for ${kw.toLowerCase()} is completely clean and ready to use.`,
  (kw) => `Verified to achieve 0-3% AI scores on Copyleaks for ${kw.toLowerCase()}, used by enterprises and LMS platforms worldwide.`,
  (kw) => `Verified to achieve 0-3% AI scores on Winston AI for ${kw.toLowerCase()}, trusted by media companies and publishers.`,
];

// ── Stat pools ────────────────────────────────────────────────────────────────

const STAT_VALUES = ['99.9%', '450,000+', '<10s', '50+', '0-3%', '100%', '5M+', '2026', '500', '24/7', '#1', '3x', '10x', '99%', '0', '1M+', '48h', '5★', '30+', '1B+', '47', '12+', '20+', '99.8%', '99.7%', '10,000+', '200K+', '1,000+', '60s', '0%'];
const STAT_LABELS = [
  'Bypass Rate',
  'Users Worldwide',
  'Average Processing Time',
  'Languages Supported',
  'AI Score Guaranteed',
  'Meaning Preserved',
  'Documents Processed',
  'Verified & Updated',
  'Free Words Per Run',
  'Support Available',
  'Ranked AI Humanizer',
  'Faster Than Competitors',
  'More Effective Than Paraphrasers',
  'Detector Pass Rate',
  'Data Stored',
  'Monthly Active Users',
  'Average Response Time',
  'User Rating',
  'Detector Integrations',
  'Words Humanized',
  'Linguistic Dimensions Analyzed',
  'Major Detectors Bypassed',
  'Supported Languages',
  'GPTZero Bypass Rate',
  'Originality.AI Bypass Rate',
  'Academic Users',
  'Professional Users',
  'Enterprise Clients',
  'Max Processing Time',
  'AI Score on Turnitin',
];

// ── Helper ────────────────────────────────────────────────────────────────────

function pick<T>(pool: T[], seed: number, keyword: string, offset: number): T {
  return pool[uniqueIdx(seed, keyword, pool.length, offset)]!;
}

function fillTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? '');
}

// ── Main page strings builder ─────────────────────────────────────────────────

export function buildPageStrings(
  keyword: string,
  seed: number,
  entity: string,
  cluster: string,
): {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  badge: string;
  faqTitle: string;
  finalCtaTitle: string;
  finalCtaSubtitle: string;
} {
  const adverb = pick(TITLE_ADVERBS, seed, keyword, 1);
  const suffix = pick(TITLE_SUFFIXES, seed, keyword, 2);

  // Route to grammatically correct format pools by keyword shape
  const kwType = classifyKeyword(keyword);
  const titlePool =
    kwType === 'action' ? ACTION_TITLE_FORMATS :
    kwType === 'question' ? QUESTION_TITLE_FORMATS :
    kwType === 'statement' ? STATEMENT_TITLE_FORMATS :
    NOUN_TITLE_FORMATS;
  const h1Pool =
    kwType === 'action' ? ACTION_H1_FORMATS :
    kwType === 'question' ? QUESTION_H1_FORMATS :
    kwType === 'statement' ? STATEMENT_H1_FORMATS :
    NOUN_H1_FORMATS;
  const titleFormat = pick(titlePool, seed, keyword, 3);
  const h1Format = pick(h1Pool, seed, keyword, 4);

  // Correct brand/acronym casing wherever the keyword appears in copy
  const displayKeyword = smartTitleCase(keyword);
  const vars = { adverb, suffix, keyword: displayKeyword };

  const metaTitle = fillTemplate(titleFormat, vars).replace(/\s{2,}/g, ' ').trim();
  const h1 = fillTemplate(h1Format, { adverb, keyword: displayKeyword }).replace(/\s{2,}/g, ' ').trim();

  const openerPool =
    kwType === 'action' ? DESC_OPENERS :
    kwType === 'question' ? QUESTION_DESC_OPENERS :
    kwType === 'statement' ? STATEMENT_DESC_OPENERS :
    NOUN_DESC_OPENERS;
  const opener = pick(openerPool, seed, keyword, 5)(displayKeyword);
  const stat = pick(DESC_STATS, seed, keyword, 6);
  const closer = pick(DESC_CLOSERS, seed, keyword, 7);
  const metaDescription = `${opener} ${stat} ${closer}`;

  const heroAPool =
    kwType === 'action' ? HERO_PARTS_A :
    kwType === 'question' ? QUESTION_HERO_A :
    kwType === 'statement' ? STATEMENT_HERO_A :
    NOUN_HERO_A;
  const heroBPool = kwType === 'action' ? HERO_PARTS_B : TYPE_NEUTRAL_HERO_B;
  const heroA = pick(heroAPool, seed, keyword, 8)(displayKeyword);
  const heroB = pick(heroBPool, seed, keyword, 9)(displayKeyword);
  const heroSubtitle = `${heroA} ${heroB}`;

  const badgePrefix = pick(BADGE_PREFIXES, seed, keyword, 10);
  const badgeSuffix = pick(BADGE_SUFFIXES, seed, keyword, 11);
  const badge = `${badgePrefix} ${badgeSuffix}`;

  const faqTitleTemplate = pick(FAQ_TITLE_FORMATS, seed, keyword, 12);
  const faqTitle = fillTemplate(faqTitleTemplate, { keyword: displayKeyword });

  // Question/statement keywords read badly inside CTA templates — use neutral CTAs there
  const ctaPool = kwType === 'question' || kwType === 'statement'
    ? CTA_TITLE_FORMATS.filter((t) => !t.includes('{keyword}'))
    : CTA_TITLE_FORMATS;
  const ctaTitleTemplate = pick(ctaPool, seed, keyword, 13);
  const finalCtaTitle = fillTemplate(ctaTitleTemplate, { keyword: displayKeyword });

  const finalCtaSubtitle = pick(CTA_SUBTITLE_FORMATS, seed, keyword, 14);

  return { metaTitle, metaDescription, h1, heroSubtitle, badge, faqTitle, finalCtaTitle, finalCtaSubtitle };
}

// ── FAQ builder ───────────────────────────────────────────────────────────────

export function buildFaqs(
  keyword: string,
  seed: number,
  entity: string,
  cluster: string,
): { q: string; a: string }[] {
  const count = 5;
  const result: { q: string; a: string }[] = [];
  const usedQ = new Set<number>();
  const usedA = new Set<number>();

  for (let i = 0; i < count; i++) {
    // Pick unique question index
    let qIdx = uniqueIdx(seed, keyword, FAQ_QUESTION_TEMPLATES.length, i * 3);
    let attempts = 0;
    while (usedQ.has(qIdx) && attempts < FAQ_QUESTION_TEMPLATES.length) {
      qIdx = (qIdx + 1) % FAQ_QUESTION_TEMPLATES.length;
      attempts++;
    }
    usedQ.add(qIdx);

    // Pick unique answer index (different offset so q and a vary independently)
    let aIdx = uniqueIdx(seed, keyword, FAQ_ANSWER_TEMPLATES.length, i * 3 + 100);
    attempts = 0;
    while (usedA.has(aIdx) && attempts < FAQ_ANSWER_TEMPLATES.length) {
      aIdx = (aIdx + 1) % FAQ_ANSWER_TEMPLATES.length;
      attempts++;
    }
    usedA.add(aIdx);

    result.push({
      q: FAQ_QUESTION_TEMPLATES[qIdx]!(keyword),
      a: FAQ_ANSWER_TEMPLATES[aIdx]!(keyword),
    });
  }

  return result;
}

// ── Steps builder ─────────────────────────────────────────────────────────────

export function buildSteps(
  keyword: string,
  seed: number,
  cluster: string,
): { number: string; title: string; description: string }[] {
  const count = 4;
  const result: { number: string; title: string; description: string }[] = [];
  const used = new Set<number>();

  for (let i = 0; i < count; i++) {
    let idx = uniqueIdx(seed, keyword, STEP_TITLE_TEMPLATES.length, i * 5 + 200);
    let attempts = 0;
    while (used.has(idx) && attempts < STEP_TITLE_TEMPLATES.length) {
      idx = (idx + 1) % STEP_TITLE_TEMPLATES.length;
      attempts++;
    }
    used.add(idx);

    result.push({
      number: String(i + 1),
      title: STEP_TITLE_TEMPLATES[idx]!(keyword),
      description: STEP_DESC_TEMPLATES[idx]!(keyword),
    });
  }

  return result;
}

// ── Feature points builder ────────────────────────────────────────────────────

export function buildFeaturePoints(
  keyword: string,
  seed: number,
  cluster: string,
): { icon: string; title: string; description: string }[] {
  const count = 4;
  const result: { icon: string; title: string; description: string }[] = [];
  const used = new Set<number>();

  for (let i = 0; i < count; i++) {
    let idx = uniqueIdx(seed, keyword, FEATURE_TITLE_TEMPLATES.length, i * 5 + 300);
    let attempts = 0;
    while (used.has(idx) && attempts < FEATURE_TITLE_TEMPLATES.length) {
      idx = (idx + 1) % FEATURE_TITLE_TEMPLATES.length;
      attempts++;
    }
    used.add(idx);

    const iconIdx = uniqueIdx(seed, keyword, FEATURE_ICONS.length, i * 5 + 350);

    result.push({
      icon: FEATURE_ICONS[iconIdx]!,
      title: FEATURE_TITLE_TEMPLATES[idx]!,
      description: FEATURE_DESC_TEMPLATES[idx]!(keyword),
    });
  }

  return result;
}

// ── Stats builder ─────────────────────────────────────────────────────────────

export function buildStats(
  keyword: string,
  seed: number,
): { value: string; label: string }[] {
  const count = 4;
  const result: { value: string; label: string }[] = [];
  const usedV = new Set<number>();
  const usedL = new Set<number>();

  for (let i = 0; i < count; i++) {
    let vIdx = uniqueIdx(seed, keyword, STAT_VALUES.length, i * 5 + 400);
    let attempts = 0;
    while (usedV.has(vIdx) && attempts < STAT_VALUES.length) {
      vIdx = (vIdx + 1) % STAT_VALUES.length;
      attempts++;
    }
    usedV.add(vIdx);

    let lIdx = uniqueIdx(seed, keyword, STAT_LABELS.length, i * 5 + 450);
    attempts = 0;
    while (usedL.has(lIdx) && attempts < STAT_LABELS.length) {
      lIdx = (lIdx + 1) % STAT_LABELS.length;
      attempts++;
    }
    usedL.add(lIdx);

    result.push({
      value: STAT_VALUES[vIdx]!,
      label: STAT_LABELS[lIdx]!,
    });
  }

  return result;
}
