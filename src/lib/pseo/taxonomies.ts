export interface NamedItem {
  key: string;
  name: string;
  slug: string;
}

export interface DetectorFact extends NamedItem {
  usedBy: string;
  method: string;
  falsePositives: string;
  weakness: string;
  typicalScore: string;
}

export interface ModelFact extends NamedItem {
  tells: string;
  cadence: string;
  bestFix: string;
}

export interface DocFact extends NamedItem {
  structure: string;
  risk: string;
  keep: string;
}

export interface RoleFact extends NamedItem {
  workflow: string;
  stake: string;
}

export interface GeoFact extends NamedItem {
  context: string;
  detectors: string;
}

export interface CompetitorFact extends NamedItem {
  angle: string;
  gap: string;
}

export interface TaskFact extends NamedItem {
  goal: string;
  voice: string;
}

function item(key: string, name: string): NamedItem {
  return { key, name, slug: key };
}

export const DETECTORS: DetectorFact[] = [
  { ...item("turnitin", "Turnitin"), usedBy: "universities, publishers, and LMS integrations worldwide", method: "a similarity index plus an AI writing indicator trained on student papers and known LLM output", falsePositives: "ESL phrasing, templated lab reports, and dense citation blocks", weakness: "it is weaker on mixed-source drafts that already sound like a specific student", typicalScore: "high AI probability on untouched ChatGPT essays" },
  { ...item("gptzero", "GPTZero"), usedBy: "teachers, journalists, and individual checkers", method: "perplexity and burstiness across sentences, with a mixed-text classifier", falsePositives: "short answers, lists, and highly edited technical notes", weakness: "burstiness rises quickly once sentence length and openings vary", typicalScore: "often labels uniform LLM prose as AI-generated" },
  { ...item("originality-ai", "Originality.ai"), usedBy: "SEO teams, publishers, and agencies", method: "a commercial AI classifier tuned for web content and a plagiarism scan in the same pass", falsePositives: "rewritten press releases and affiliate product copy", weakness: "it reacts strongly to repetitive H2 patterns and stock transitions", typicalScore: "strict on blog-style LLM drafts" },
  { ...item("copyleaks", "Copyleaks"), usedBy: "enterprises, universities, and API-heavy workflows", method: "model-family fingerprints plus plagiarism matching", falsePositives: "source-code comments and legal boilerplate", weakness: "document-level scores drop when paragraphs no longer share one LLM rhythm", typicalScore: "sensitive on long homogeneous reports" },
  { ...item("zerogpt", "ZeroGPT"), usedBy: "students and free online checkers", method: "a public classifier that scores sentence-level predictability", falsePositives: "simple how-to writing and translated text", weakness: "it flips on modest vocabulary and clause variation", typicalScore: "volatile, so one rewrite pass often changes the result" },
  { ...item("winston-ai", "Winston AI"), usedBy: "content studios and education buyers", method: "a readability-aware AI detector with document highlighting", falsePositives: "neutral corporate blogs", weakness: "highlights cluster on template intros you can rewrite first", typicalScore: "flags formulaic openings quickly" },
  { ...item("sapling", "Sapling"), usedBy: "support teams and browser extensions", method: "an enterprise writing copilot with an AI-content detector", falsePositives: "canned support macros", weakness: "short, varied replies rarely look machine-written", typicalScore: "strictest on long knowledge-base articles" },
  { ...item("writer", "Writer.com"), usedBy: "brand and compliance teams", method: "enterprise style guidance plus AI-content detection", falsePositives: "style-guide-compliant human copy", weakness: "brand voice variation beats generic LLM tone", typicalScore: "flags off-brand LLM drafts" },
  { ...item("content-at-scale", "Content at Scale"), usedBy: "SEO writers checking bulk articles", method: "a detector marketed alongside long-form generation", falsePositives: "listicles and thin product roundups", weakness: "it focuses on web-article cadence more than academic structure", typicalScore: "harsh on 2,000-word LLM posts" },
  { ...item("crossplag", "Crossplag"), usedBy: "international academic users", method: "plagiarism plus an AI detector in one dashboard", falsePositives: "translated scholarly summaries", weakness: "citation-heavy pages confuse a pure AI score", typicalScore: "pairs similarity and AI risk together" },
  { ...item("scribbr", "Scribbr"), usedBy: "students running extra checks before Turnitin", method: "a student-facing detector often powered by a third-party model", falsePositives: "paraphrased literature reviews", weakness: "it is a preview, not the institution's official score", typicalScore: "useful as a second opinion, not a verdict" },
  { ...item("grammarly", "Grammarly AI detector"), usedBy: "writers already inside Grammarly", method: "an in-app AI-content indicator on top of grammar suggestions", falsePositives: "over-edited business email", weakness: "it is not the same system universities submit to", typicalScore: "conservative on long LLM emails" },
  { ...item("quillbot", "QuillBot AI detector"), usedBy: "students using the paraphraser suite", method: "a companion detector next to QuillBot's paraphrasing modes", falsePositives: "lightly paraphrased notes", weakness: "paraphrase-then-detect loops are easy to overfit", typicalScore: "inconsistent on mixed drafts" },
  { ...item("hive", "Hive Moderation"), usedBy: "platforms screening UGC", method: "moderation models that include AI-text signals", falsePositives: "meme captions and short posts", weakness: "it is built for abuse, not academic essays", typicalScore: "noisy on short social text" },
  { ...item("gltr", "GLTR"), usedBy: "researchers visualizing token predictability", method: "a heatmap of how easily a model could have predicted each word", falsePositives: "any formulaic genre", weakness: "it is a visualization, not a courtroom score", typicalScore: "green heatmaps on stock LLM wording" },
  { ...item("gptkit", "GPTKit"), usedBy: "freelancers checking client drafts", method: "a lightweight online AI detector", falsePositives: "short marketing blurbs", weakness: "results swing between reloads", typicalScore: "best as a sanity check" },
  { ...item("contentdetector", "ContentDetector.AI"), usedBy: "bloggers running free scans", method: "a public web detector with a percentage score", falsePositives: "how-to posts", weakness: "percentage scores are not comparable across tools", typicalScore: "often over-confident on short pages" },
  { ...item("smodin", "Smodin"), usedBy: "multilingual students", method: "a detector bundled with homework tools", falsePositives: "non-English academic writing", weakness: "language mix changes the score more than meaning does", typicalScore: "uneven outside English" },
  { ...item("undetectable-detector", "Undetectable.ai detector"), usedBy: "people comparing humanizer claims", method: "the vendor's own checker, which is not an independent lab", falsePositives: "whatever the vendor's rewriter just produced", weakness: "never treat a vendor detector as the school's detector", typicalScore: "optimistic on its own output" },
  { ...item("copyleaks-lms", "Copyleaks LMS"), usedBy: "learning-management integrations", method: "the Copyleaks model delivered inside an LMS assignment flow", falsePositives: "discussion-board replies", weakness: "short forum posts have too little signal", typicalScore: "stricter on uploaded files than on comments" },
  { ...item("canvas-ai", "Canvas AI detection"), usedBy: "courses hosted on Canvas", method: "whatever detector the institution enabled, often Turnitin or Copyleaks", falsePositives: "quiz short answers", weakness: "Canvas itself is not one universal model", typicalScore: "depends entirely on the campus integration" },
  { ...item("blackboard-ai", "Blackboard AI detection"), usedBy: "Blackboard Learn campuses", method: "an institutional plugin rather than a single public model", falsePositives: "templated lab writeups", weakness: "settings vary by faculty", typicalScore: "treat it as the underlying vendor, not Blackboard itself" },
  { ...item("moodle-ai", "Moodle AI detection"), usedBy: "open-source campus Moodle sites", method: "optional plugins, commonly Copyleaks or similar", falsePositives: "forum peer replies", weakness: "plugin choice differs by school", typicalScore: "not one global Moodle score" },
  { ...item("gradescope", "Gradescope"), usedBy: "STEM courses grading at scale", method: "assignment workflows that may sit beside a detector, not inside one", falsePositives: "shared solution templates", weakness: "math and code need a different review than essays", typicalScore: "AI flags are secondary to correctness" },
  { ...item("packback", "Packback"), usedBy: "discussion-based courses", method: "curiosity scoring and writing quality, sometimes with AI signals", falsePositives: "short genuine questions", weakness: "discussion voice is the real ranking factor", typicalScore: "penalizes generic LLM questions" },
  { ...item("turnitin-originality", "Turnitin Originality"), usedBy: "institutions on Turnitin Originality licenses", method: "similarity, AI indicator, and document metadata together", falsePositives: "reused methods sections", weakness: "AI and similarity are separate numbers", typicalScore: "both scores can be high on pasted LLM text" },
  { ...item("gptzero-chrome", "GPTZero Chrome"), usedBy: "teachers scanning pages in the browser", method: "the GPTZero classifier on selected text", falsePositives: "highlighted fragments without context", weakness: "selection length changes the score", typicalScore: "unstable on snippets under 200 words" },
  { ...item("originality-chrome", "Originality.ai Chrome"), usedBy: "SEO editors reviewing SERP pages", method: "in-browser Originality scoring", falsePositives: "meta descriptions and boilerplate", weakness: "page chrome is not the article", typicalScore: "scan the body, not the whole tab" },
  { ...item("zerogpt-plus", "ZeroGPT Plus"), usedBy: "users on the paid ZeroGPT tier", method: "the same public family with extra batch tools", falsePositives: "bulk CSV rows of short text", weakness: "batch length still matters", typicalScore: "same volatility as the free checker" },
  { ...item("sapling-api", "Sapling API"), usedBy: "products embedding Sapling detection", method: "API document scoring for support and docs", falsePositives: "release notes", weakness: "product copy with a style guide already looks human", typicalScore: "strict on unedited LLM help articles" },
  { ...item("writer-compass", "Writer Compass"), usedBy: "enterprise brand teams", method: "governance scoring that includes AI-origin hints", falsePositives: "on-brand human drafts", weakness: "passing brand voice is the actual requirement", typicalScore: "fails generic LLM tone first" },
  { ...item("brandwell", "BrandWell"), usedBy: "content shops generating SEO articles", method: "a detector bundled with generation", falsePositives: "thin list posts", weakness: "vendor scores are not university scores", typicalScore: "tuned for blogs, not theses" },
  { ...item("catchgpt", "CatchGPT"), usedBy: "quick online checks", method: "a lightweight public classifier", falsePositives: "neutral how-tos", weakness: "no academic corpus", typicalScore: "coarse percentages" },
  { ...item("gptradar", "GPTRadar"), usedBy: "early AI-detection testers", method: "radar-style probability on pasted text", falsePositives: "news briefs", weakness: "small training surface", typicalScore: "unreliable as a single source" },
  { ...item("corrector-app", "Corrector App detector"), usedBy: "multilingual writers", method: "grammar tools plus an AI scan", falsePositives: "translated essays", weakness: "language quality and AI origin get mixed", typicalScore: "noisy on non-English" },
  { ...item("stealthgpt-checker", "StealthGPT checker"), usedBy: "people testing humanizer vendors", method: "a vendor-side checker", falsePositives: "the vendor's own output", weakness: "not independent", typicalScore: "do not use it as Turnitin" },
  { ...item("justdone", "Justdone detector"), usedBy: "all-in-one writing suites", method: "a suite detector next to paraphrasing", falsePositives: "short social captions", weakness: "suite tools share the same voice", typicalScore: "weak as an official check" },
  { ...item("wordtune", "Wordtune detector"), usedBy: "rewrite-tool users", method: "detection adjacent to rewriting", falsePositives: "Wordtune's own suggestions", weakness: "rewrite loops hide origin poorly if structure stays", typicalScore: "not a campus standard" },
  { ...item("notion-ai-detector", "Notion AI detector"), usedBy: "teams drafting in Notion", method: "there is no official Notion detector — people paste Notion AI into other tools", falsePositives: "wiki stubs", weakness: "the checker is always a third party", typicalScore: "depends on what you paste into" },
  { ...item("openai-classifier", "OpenAI classifier"), usedBy: "historical comparisons", method: "OpenAI's retired AI-text classifier, no longer a live product", falsePositives: "was already inaccurate on short text", weakness: "it is gone; do not optimize for it", typicalScore: "irrelevant in 2026" },
  { ...item("copyleaks-api", "Copyleaks API"), usedBy: "custom academic and publishing stacks", method: "the Copyleaks model behind an API key", falsePositives: "templated contracts", weakness: "chunking strategy changes scores", typicalScore: "stricter on full documents than on paragraphs" },
  { ...item("turnitin-simcheck", "Turnitin SimCheck"), usedBy: "institutions using similarity-only licenses", method: "similarity matching without the AI indicator on some licenses", falsePositives: "quoted methods", weakness: "similarity is not AI origin", typicalScore: "can be low similarity and still AI-written" },
  { ...item("gptzero-api", "GPTZero API"), usedBy: "ed-tech apps", method: "GPTZero scoring in product backends", falsePositives: "short form fields", weakness: "minimum word counts apply", typicalScore: "needs enough text to be meaningful" },
  { ...item("originality-api", "Originality.ai API"), usedBy: "SEO pipelines", method: "automated Originality scans on generated URLs", falsePositives: "author bios and footers", weakness: "scan the article body only", typicalScore: "used as a publish gate" },
  { ...item("winston-api", "Winston AI API"), usedBy: "content ops teams", method: "document highlighting via API", falsePositives: "intro templates", weakness: "fix highlighted spans first", typicalScore: "actionable at paragraph level" },
  { ...item("quillbot-premium", "QuillBot Premium detector"), usedBy: "paid QuillBot users", method: "the suite detector on premium", falsePositives: "academic paraphrases", weakness: "paraphrase ≠ human", typicalScore: "not a substitute for Turnitin" },
  { ...item("grammarly-business", "Grammarly Business"), usedBy: "company writing teams", method: "org-level writing analytics that may surface AI-like prose", falsePositives: "brand templates", weakness: "compliance is the real score", typicalScore: "flags generic LLM emails" },
  { ...item("crossplag-edu", "Crossplag Education"), usedBy: "schools outside the US", method: "education-tier Crossplag", falsePositives: "translated coursework", weakness: "language packs matter", typicalScore: "paired plagiarism + AI" },
  { ...item("scribbr-plagiarism", "Scribbr plagiarism checker"), usedBy: "students before submission", method: "plagiarism first, AI second on some plans", falsePositives: "common thesis phrases", weakness: "plagiarism and AI are different failures", typicalScore: "clean similarity does not mean human" },
  { ...item("hive-text", "Hive text moderation"), usedBy: "apps filtering generated spam", method: "UGC moderation classifiers", falsePositives: "repetitive captions", weakness: "not built for dissertations", typicalScore: "spam-oriented" },
];

export const MODELS: ModelFact[] = [
  { ...item("chatgpt", "ChatGPT"), tells: "symmetric paragraphs, tidy three-part answers, and hedging openers like 'in today's world'", cadence: "even sentence length with polite transitions", bestFix: "break the template intro, vary sentence openings, and restore specific examples" },
  { ...item("chatgpt-4o", "ChatGPT 4o"), tells: "confident formatting, emoji-less but still 'helpful assistant' pacing", cadence: "clean lists and balanced claims", bestFix: "collapse lists into prose where a human would, and add local detail" },
  { ...item("chatgpt-5", "ChatGPT 5"), tells: "longer hedging, more citations-looking structure, still uniform rhythm", cadence: "essay-shaped even when the prompt was a note", bestFix: "shorten throat-clearing and inject the author's actual constraint" },
  { ...item("gpt-4", "GPT-4"), tells: "formal connective tissue ('moreover', 'furthermore') and generic conclusions", cadence: "academic-looking but unsourced", bestFix: "replace connectives with the field's real verbs and cite for real" },
  { ...item("gpt-4o", "GPT-4o"), tells: "multimodal-era fluency with stock examples", cadence: "smooth and slightly empty", bestFix: "swap stock examples for the assignment's data" },
  { ...item("gpt-5", "GPT-5"), tells: "over-structured outlines and safety-flavored caveats", cadence: "sectioned like a briefing", bestFix: "write to the rubric, not to a universal outline" },
  { ...item("claude", "Claude"), tells: "warm qualifications, ethical asides, and neatly nested bullets", cadence: "considerate and slightly over-explained", bestFix: "cut the moral preface and keep the analysis" },
  { ...item("claude-sonnet", "Claude Sonnet"), tells: "fast, helpful, still very 'assistant'", cadence: "clear but generic", bestFix: "add the messy specifics Claude smoothed away" },
  { ...item("claude-opus", "Claude Opus"), tells: "richer vocabulary that still avoids risk", cadence: "elegant and cautious", bestFix: "take a position the prompt sat on the fence about" },
  { ...item("claude-3-5", "Claude 3.5"), tells: "artifacts-style structure leaking into essays", cadence: "tool-output hygiene", bestFix: "remove scaffolding headers a student would never submit" },
  { ...item("gemini", "Gemini"), tells: "search-flavored summaries and 'here is an overview' openings", cadence: "encyclopedia-like", bestFix: "start from the claim, not the overview" },
  { ...item("gemini-1-5", "Gemini 1.5"), tells: "long-context dumping: everything included, nothing ranked", cadence: "comprehensive but flat", bestFix: "rank evidence; delete the tour" },
  { ...item("gemini-2", "Gemini 2.0"), tells: "product-recap tone even on academic prompts", cadence: "feature-list residue", bestFix: "write as a person in the course, not a product blog" },
  { ...item("copilot", "Microsoft Copilot"), tells: "Office-adjacent phrasing and cautious corporate tone", cadence: "memo-like", bestFix: "match the genre (essay vs memo) instead of Copilot's default" },
  { ...item("microsoft-copilot", "Microsoft Copilot"), tells: "Word/Outlook cadence with safe verbs", cadence: "business default", bestFix: "restore disciplinary vocabulary" },
  { ...item("grok", "Grok"), tells: "informal asides that still sit on a template spine", cadence: "chatty but patterned", bestFix: "keep the voice, rebuild the spine around your outline" },
  { ...item("grok-2", "Grok 2"), tells: "wittier filler around the same three-part structure", cadence: "jokey intro, generic body", bestFix: "cut the opener joke if the assignment is formal" },
  { ...item("llama-3", "Llama 3"), tells: "open-weight blandness: correct, unsourced, repetitive", cadence: "wiki-adjacent", bestFix: "add citations and a point of view" },
  { ...item("llama-4", "Llama 4"), tells: "newer open-weight fluency with the same generic examples", cadence: "smooth stock", bestFix: "replace examples with course materials" },
  { ...item("mistral", "Mistral"), tells: "concise European-English that still lists in threes", cadence: "compact and schematic", bestFix: "expand the argument, not the bullet count" },
  { ...item("perplexity", "Perplexity"), tells: "citation-looking summaries that read like SERP mashups", cadence: "answer-engine prose", bestFix: "verify sources and rewrite as an argument" },
  { ...item("jasper", "Jasper"), tells: "marketing frameworks (PAS, AIDA) leaking into other genres", cadence: "campaign copy", bestFix: "drop the framework if you are not writing an ad" },
  { ...item("copy-ai", "Copy.ai"), tells: "short-form ad rhythm and benefit stacks", cadence: "landing-page", bestFix: "write paragraphs, not benefit rows" },
  { ...item("writesonic", "Writesonic"), tells: "SEO heading farms and keyword-stuffed intros", cadence: "content-mill", bestFix: "one idea per section, human title case" },
  { ...item("rytr", "Rytr"), tells: "thin short-form with repeated CTAs", cadence: "snippet", bestFix: "lengthen with actual knowledge, not adjectives" },
  { ...item("quillbot", "QuillBot"), tells: "synonym-swapped sentences that keep the original syntax", cadence: "paraphrase residue", bestFix: "rebuild sentence structure, not just words" },
  { ...item("grammarly-go", "GrammarlyGO"), tells: "over-polite, grammatically safe, personality-free", cadence: "corrected but empty", bestFix: "put judgment back in after the grammar pass" },
  { ...item("notion-ai", "Notion AI"), tells: "wiki summaries and action-item lists", cadence: "internal-doc", bestFix: "convert notes into the submitted genre" },
  { ...item("you-com", "You.com"), tells: "search-answer blend with leftover citations", cadence: "assistant snippet", bestFix: "write a full piece, not a SERP card" },
  { ...item("deepseek", "DeepSeek"), tells: "reasoning traces leaking into the final answer", cadence: "chain-of-thought residue", bestFix: "delete the scratch work; keep the conclusion you actually need" },
];

export const DOCS: DocFact[] = [
  { ...item("essay", "essay"), structure: "claim, reasons, evidence, counterargument, close", risk: "generic thesis and three identical body paragraphs", keep: "your actual thesis and any required sources" },
  { ...item("argumentative-essay", "argumentative essay"), structure: "contestable claim plus rebuttal", risk: "both-sides-ism with no stake", keep: "the position you would defend in class" },
  { ...item("persuasive-essay", "persuasive essay"), structure: "audience-aware appeals", risk: "ad-copy tone", keep: "the audience named in the prompt" },
  { ...item("research-paper", "research paper"), structure: "lit map, method, findings, limits", risk: "fake-looking citations", keep: "real references from your library" },
  { ...item("thesis", "thesis"), structure: "chapter logic over hundreds of pages", risk: "one LLM voice across chapters", keep: "committee language and your data" },
  { ...item("dissertation", "dissertation"), structure: "proposal-to-defense arc", risk: "template chapter 2", keep: "your dataset and advisor comments" },
  { ...item("literature-review", "literature review"), structure: "themes, not article summaries in a row", risk: "annotated-bibliography residue", keep: "the debate you are entering" },
  { ...item("lab-report", "lab report"), structure: "IMRaD with real numbers", risk: "invented results", keep: "measured data and error notes" },
  { ...item("case-study", "case study"), structure: "situation, options, recommendation", risk: "consulting cliches", keep: "the facts of this case" },
  { ...item("discussion-post", "discussion post"), structure: "prompt answer plus a classmate hook", risk: "forum-bot politeness", keep: "a specific reaction to the reading" },
  { ...item("reflection-paper", "reflection paper"), structure: "experience then insight", risk: "fake personal stories", keep: "what actually happened to you" },
  { ...item("book-report", "book report"), structure: "summary plus evaluation", risk: "sparknotes cadence", keep: "quotes you chose" },
  { ...item("admission-essay", "admission essay"), structure: "scene, growth, fit", risk: "volunteer-trip cliche", keep: "a story only you can tell" },
  { ...item("personal-statement", "personal statement"), structure: "trajectory and motive", risk: "resume in paragraph form", keep: "why this program, specifically" },
  { ...item("scholarship-essay", "scholarship essay"), structure: "need, merit, plan", risk: "generic gratitude", keep: "the funder's criteria" },
  { ...item("cover-letter", "cover letter"), structure: "match to the posting", risk: "I am writing to apply", keep: "two proof points from your work" },
  { ...item("white-paper", "white paper"), structure: "problem, evidence, recommendation", risk: "vendor brochure", keep: "the buyer's constraint" },
  { ...item("blog-post", "blog post"), structure: "hook, utility, next step", risk: "SEO sludge", keep: "a lived example" },
  { ...item("seo-article", "SEO article"), structure: "search intent then depth", risk: "heading farms", keep: "the query's actual job-to-be-done" },
  { ...item("news-article", "news article"), structure: "lede, nut graf, quotes", risk: "neutral LLM voice with no reporting", keep: "who you actually spoke to" },
  { ...item("product-description", "product description"), structure: "who it is for and why", risk: "feature dump", keep: "the real differentiator" },
  { ...item("linkedin-post", "LinkedIn post"), structure: "hook line then story", risk: "thought-leadership sludge", keep: "a specific incident" },
  { ...item("youtube-script", "YouTube script"), structure: "spoken rhythm and pattern interrupts", risk: "essay-read-aloud", keep: "how you actually talk" },
  { ...item("college-assignment", "college assignment"), structure: "rubric-first", risk: "missing the rubric verbs", keep: "every rubric line" },
  { ...item("university-paper", "university paper"), structure: "discipline conventions", risk: "high-school five-paragraph form", keep: "the course's citation style" },
  { ...item("coursework", "coursework"), structure: "prompt parts answered in order", risk: "one blob that misses part B", keep: "the numbered questions" },
  { ...item("annotated-bibliography", "annotated bibliography"), structure: "citation plus 150-word judgment", risk: "abstract copies", keep: "why the source matters to your project" },
  { ...item("abstract", "abstract"), structure: "purpose, method, result, implication", risk: "teaser trailer with no numbers", keep: "the actual finding" },
  { ...item("conference-paper", "conference paper"), structure: "contribution first", risk: "thesis-chapter dump", keep: "what is new this year" },
  { ...item("journal-article", "journal article"), structure: "the target venue's IMRaD variant", risk: "wrong audience", keep: "the journal's house voice" },
  { ...item("capstone-project", "capstone project"), structure: "problem, build, evaluate", risk: "marketing language", keep: "what you shipped" },
  { ...item("honors-thesis", "honors thesis"), structure: "narrow question, real method", risk: "over-wide survey", keep: "your advisor's scope" },
  { ...item("mba-essay", "MBA essay"), structure: "leadership story with stakes", risk: "corporate cliche", keep: "a decision you made" },
  { ...item("law-personal-statement", "law school personal statement"), structure: "judgment under pressure", risk: "courtroom TV", keep: "a real ethical knot" },
  { ...item("medical-school-essay", "medical school essay"), structure: "care, curiosity, durability", risk: "savior narrative", keep: "clinical detail you witnessed" },
  { ...item("ielts-essay", "IELTS essay"), structure: "task response, coherence, lexical range", risk: "memorized templates examiners know", keep: "a direct answer to this prompt" },
  { ...item("toefl-essay", "TOEFL essay"), structure: "integrated or independent task rules", risk: "stock phrases", keep: "the lecture/reading points" },
  { ...item("gre-issue-essay", "GRE issue essay"), structure: "position plus qualified limits", risk: "five canned templates", keep: "a precise stance" },
  { ...item("lab-notebook", "lab notebook"), structure: "chronology and raw observation", risk: "cleaned-up narrative", keep: "timestamps and anomalies" },
  { ...item("internship-report", "internship report"), structure: "what you did and what you learned", risk: "company brochure", keep: "your tasks, not the about page" },
];

export const ROLES: RoleFact[] = [
  { ...item("students", "students"), workflow: "draft with a model, then make it sound like their other work", stake: "course policies and detector flags" },
  { ...item("college-students", "college students"), workflow: "assignment sprints the night before the LMS deadline", stake: "Turnitin on the dropbox" },
  { ...item("high-school-students", "high school students"), workflow: "short essays with teacher checkers like GPTZero", stake: "honor code and college-prep habits" },
  { ...item("graduate-students", "graduate students"), workflow: "literature-heavy drafts that must match a lab's voice", stake: "advisor trust" },
  { ...item("phd-candidates", "PhD candidates"), workflow: "chapter rewrites under committee review", stake: "original contribution, not just tone" },
  { ...item("teachers", "teachers"), workflow: "assignment sheets and feedback comments", stake: "modeling honest AI use" },
  { ...item("professors", "professors"), workflow: "lectures, grants, and reviews", stake: "reputation in the field" },
  { ...item("seo-writers", "SEO writers"), workflow: "briefs to drafts to publish gates", stake: "Originality.ai style gates" },
  { ...item("content-marketers", "content marketers"), workflow: "campaign copy across channels", stake: "brand voice and compliance" },
  { ...item("copywriters", "copywriters"), workflow: "ads and landing pages from messy briefs", stake: "conversion, not academic detectors" },
  { ...item("journalists", "journalists"), workflow: "notes to publishable copy", stake: "editorial standards and quotes" },
  { ...item("bloggers", "bloggers"), workflow: "personal posts that still need a human cadence", stake: "audience trust" },
  { ...item("freelance-writers", "freelance writers"), workflow: "client drafts under originality clauses", stake: "getting paid twice for the same piece" },
  { ...item("agencies", "agencies"), workflow: "bulk client content with QA", stake: "retainer trust" },
  { ...item("startup-founders", "startup founders"), workflow: "investor updates and site copy", stake: "sounding like themselves on a deadline" },
  { ...item("product-managers", "product managers"), workflow: "PRDs and release notes", stake: "engineering readability" },
  { ...item("lawyers", "lawyers"), workflow: "memos that cannot hallucinate law", stake: "malpractice and court tone" },
  { ...item("paralegals", "paralegals"), workflow: "first drafts of routine documents", stake: "attorney review" },
  { ...item("consultants", "consultants"), workflow: "decks and recommendations", stake: "client-specific insight" },
  { ...item("hr-teams", "HR teams"), workflow: "policies and offer letters", stake: "legal and culture voice" },
  { ...item("nonprofit-writers", "nonprofit writers"), workflow: "grants and donor notes", stake: "funder language" },
  { ...item("ecommerce-teams", "ecommerce teams"), workflow: "PDP copy at scale", stake: "brand consistency" },
  { ...item("real-estate-agents", "real estate agents"), workflow: "listings that cannot be generic", stake: "local detail" },
  { ...item("healthcare-writers", "healthcare writers"), workflow: "patient-facing explainers", stake: "accuracy and empathy" },
  { ...item("researchers", "academic researchers"), workflow: "papers and grant text", stake: "venue detectors and peer review" },
  { ...item("editors", "editors"), workflow: "cleaning LLM residue in other people's drafts", stake: "house style" },
  { ...item("social-media-managers", "social media managers"), workflow: "captions that should not sound like a model", stake: "platform voice" },
  { ...item("youtube-creators", "YouTube creators"), workflow: "scripts meant to be spoken", stake: "retention" },
  { ...item("newsletter-writers", "newsletter writers"), workflow: "recurring voice readers would notice changing", stake: "subscriber trust" },
  { ...item("technical-writers", "technical writers"), workflow: "docs that must stay exact", stake: "procedure accuracy" },
];

export const GEOS: GeoFact[] = [
  { ...item("usa", "the United States"), context: "Turnitin-heavy campuses and Originality gates at publishers", detectors: "Turnitin, GPTZero, Copyleaks" },
  { ...item("uk", "the United Kingdom"), context: "Turnitin via university VLEs and UKVI-adjacent academic integrity rules", detectors: "Turnitin, Copyleaks" },
  { ...item("canada", "Canada"), context: "provincial universities with mixed Turnitin and in-house policy", detectors: "Turnitin, GPTZero" },
  { ...item("australia", "Australia"), context: "strict integrity offices and Turnitin as a default", detectors: "Turnitin, Copyleaks" },
  { ...item("europe", "Europe"), context: "GDPR-aware tools and mixed campus vendors", detectors: "Copyleaks, Turnitin, GPTZero" },
  { ...item("germany", "Germany"), context: "formal academic German plus English programs", detectors: "Turnitin, Crossplag" },
  { ...item("india", "India"), context: "high volume of English assignments and free checkers", detectors: "ZeroGPT, GPTZero, Turnitin" },
  { ...item("philippines", "the Philippines"), context: "English academic work for local and overseas programs", detectors: "Turnitin, ZeroGPT" },
  { ...item("singapore", "Singapore"), context: "research universities with strict originality rules", detectors: "Turnitin, Copyleaks" },
  { ...item("uae", "the UAE"), context: "international branch campuses", detectors: "Turnitin, Originality.ai" },
  { ...item("south-africa", "South Africa"), context: "Turnitin via major universities", detectors: "Turnitin, GPTZero" },
  { ...item("ireland", "Ireland"), context: "UK-adjacent academic practice", detectors: "Turnitin" },
  { ...item("new-zealand", "New Zealand"), context: "small-cohort courses where voice is obvious", detectors: "Turnitin, GPTZero" },
  { ...item("netherlands", "the Netherlands"), context: "English-taught master's programs", detectors: "Turnitin, Copyleaks" },
  { ...item("france", "France"), context: "mixed French/English submissions", detectors: "Compilatio-adjacent stacks and Turnitin" },
  { ...item("spain", "Spain"), context: "Erasmus and English tracks", detectors: "Turnitin, Copyleaks" },
  { ...item("brazil", "Brazil"), context: "Portuguese plus English publications", detectors: "GPTZero, Copyleaks" },
  { ...item("nigeria", "Nigeria"), context: "English academic writing under resource constraints", detectors: "ZeroGPT, Turnitin" },
  { ...item("pakistan", "Pakistan"), context: "HSSC-to-university English essays", detectors: "Turnitin, ZeroGPT" },
  { ...item("malaysia", "Malaysia"), context: "private universities with Turnitin licenses", detectors: "Turnitin, Copyleaks" },
];

export const COMPETITORS: CompetitorFact[] = [
  { ...item("undetectable-ai", "Undetectable.ai"), angle: "a popular rewriter that markets detector scores", gap: "HumanifyLab focuses on meaning-preserving edits instead of spinning until a vendor meter looks green" },
  { ...item("stealthgpt", "StealthGPT"), angle: "undetectable-writing positioning", gap: "we optimize for readable voice you can stand behind, not a stealth gimmick name" },
  { ...item("bypassgpt", "BypassGPT"), angle: "one-click bypass claims", gap: "one click without structure changes still fails serious checkers" },
  { ...item("writehuman", "WriteHuman"), angle: "humanizer branding for students", gap: "HumanifyLab is built as a full editor with academic and professional tones" },
  { ...item("smodin", "Smodin"), angle: "homework suite plus rewriter", gap: "suite tools often leave paraphrase residue detectors still catch" },
  { ...item("quillbot", "QuillBot"), angle: "synonym paraphrasing millions already use", gap: "paraphrase keeps syntax; HumanifyLab rebuilds rhythm" },
  { ...item("grammarly", "Grammarly"), angle: "grammar first, not origin", gap: "clean grammar is not the same as human cadence" },
  { ...item("jasper", "Jasper"), angle: "marketing generation", gap: "Jasper creates; HumanifyLab makes generated text sound like a person" },
  { ...item("copy-ai", "Copy.ai"), angle: "short-form generation", gap: "generation and humanization are different jobs" },
  { ...item("writesonic", "Writesonic"), angle: "SEO article generation", gap: "SEO mills are exactly what Originality.ai is tuned to catch" },
  { ...item("rytr", "Rytr"), angle: "budget generation", gap: "thin drafts need a real rewrite, not another template" },
  { ...item("wordtune", "Wordtune"), angle: "sentence rewrite suggestions", gap: "local rewrites leave document-level AI rhythm" },
  { ...item("netus-ai", "Netus.ai"), angle: "undetectable rewriter niche", gap: "HumanifyLab keeps citations and claims intact" },
  { ...item("stealthwriter", "StealthWriter"), angle: "stealth naming", gap: "we do not hide that you started from a model — we make the draft yours" },
  { ...item("hustli", "Hustli.ai"), angle: "growth-content humanizer", gap: "HumanifyLab covers academic detectors, not only blogs" },
  { ...item("humanizeai-pro", "HumanizeAI.pro"), angle: "generic humanize domain", gap: "branding is not a method; our method is meaning-first rewriting" },
  { ...item("gptinf", "GPTinf"), angle: "infusion-style rewrite", gap: "infusing synonyms is what older detectors already expect" },
  { ...item("justdone", "Justdone"), angle: "all-in-one writer", gap: "all-in-one usually means shallow on detection" },
  { ...item("paraphraser-io", "Paraphraser.io"), angle: "classic spinner family", gap: "spinners destroy precision HumanifyLab is designed to keep" },
  { ...item("spinrewriter", "SpinRewriter"), angle: "old-school article spinning", gap: "spinning is a 2012 SEO tactic and a 2026 detector magnet" },
  { ...item("wordai", "WordAi"), angle: "older paid spinner", gap: "same syntax-preserving problem as every spinner" },
  { ...item("undetectable-io", "Undetectable.io"), angle: "confusable brand", gap: "HumanifyLab is a distinct product with a public academic workflow" },
  { ...item("bypassai", "BypassAI"), angle: "bypass-named tools", gap: "the name is the pitch; the work is still editing" },
  { ...item("stealth-writer-ai", "Stealth Writer AI"), angle: "stealth keyword tools", gap: "search-keyword brands rarely explain how they change prose" },
  { ...item("humanizer-org", "Humanizer.org"), angle: "generic humanizer landing pages", gap: "HumanifyLab ships a real editor, not a doorway page" },
];

export const TASKS: TaskFact[] = [
  { ...item("blog-posts", "blog posts"), goal: "useful posts that do not read like a content mill", voice: "specific and slightly uneven, like a person who did the work" },
  { ...item("seo-articles", "SEO articles"), goal: "rank without doorway sludge", voice: "direct answers first" },
  { ...item("newsletters", "newsletters"), goal: "a recognizable sender voice", voice: "recurring quirks readers would miss" },
  { ...item("linkedin-posts", "LinkedIn posts"), goal: "a hook a human would actually post", voice: "spoken, not white-paper" },
  { ...item("youtube-scripts", "YouTube scripts"), goal: "words that survive being said out loud", voice: "breath and asides" },
  { ...item("product-descriptions", "product descriptions"), goal: "benefit copy that is not template-identical across SKUs", voice: "concrete nouns" },
  { ...item("emails", "emails"), goal: "replies that do not look like Copilot", voice: "your usual sign-off and length" },
  { ...item("white-papers", "white papers"), goal: "evidence-led narrative", voice: "expert, not brochure" },
  { ...item("press-releases", "press releases"), goal: "AP-ish structure without LLM filler", voice: "facts in the lede" },
  { ...item("landing-pages", "landing pages"), goal: "persuasion without generated hype", voice: "one promise" },
  { ...item("ad-copy", "ad copy"), goal: "short lines that do not trip policy or sound fake", voice: "specific offer" },
  { ...item("sops", "SOPs"), goal: "repeatable steps with no hallucinated buttons", voice: "imperative and exact" },
  { ...item("knowledge-base-articles", "knowledge base articles"), goal: "support docs customers can follow", voice: "plain and sequenced" },
  { ...item("grant-proposals", "grant proposals"), goal: "funder language with a real project", voice: "accountable first person" },
  { ...item("case-studies", "case studies"), goal: "proof, not adjectives", voice: "numbers and names" },
  { ...item("research-summaries", "research summaries"), goal: "faithful condensation", voice: "hedged where the paper hedges" },
  { ...item("lesson-plans", "lesson plans"), goal: "teachable sequences", voice: "classroom-real" },
  { ...item("assignment-briefs", "assignment briefs"), goal: "clear asks students cannot misread", voice: "rubric verbs" },
  { ...item("policy-docs", "policy docs"), goal: "unambiguous rules", voice: "legal-plain" },
  { ...item("investor-updates", "investor updates"), goal: "honest metrics", voice: "founder, not pitch-deck AI" },
  { ...item("release-notes", "release notes"), goal: "what changed", voice: "engineering-plain" },
  { ...item("ux-microcopy", "UX microcopy"), goal: "buttons and empty states that sound like the product", voice: "short and branded" },
  { ...item("reddit-replies", "Reddit replies"), goal: "not sounding like a brand bot", voice: "thread-native" },
  { ...item("quora-answers", "Quora answers"), goal: "a real answer, not a listicle", voice: "first-hand" },
  { ...item("medium-posts", "Medium posts"), goal: "essayistic posts", voice: "a point of view" },
  { ...item("substack-posts", "Substack posts"), goal: "subscriber-grade writing", voice: "the writer's habits" },
  { ...item("academic-emails", "academic emails"), goal: "polite and specific", voice: "your usual formality" },
  { ...item("lab-writeups", "lab writeups"), goal: "methods you actually ran", voice: "IMRaD discipline" },
  { ...item("literature-notes", "literature notes"), goal: "usable annotations", voice: "your future self" },
  { ...item("presentation-scripts", "presentation scripts"), goal: "spoken slides", voice: "breathable lines" },
];

export const QUALIFIERS = [
  "best",
  "free",
  "online",
  "undetectable",
  "academic",
  "fast",
  "unlimited",
  "no sign up",
  "2026",
  "professional",
  "accurate",
  "meaning preserving",
  "bulk",
  "simple",
  "advanced",
  "trusted",
  "cheap",
  "premium",
  "instant",
  "reliable",
] as const;

export const JOBS = [
  "for essays",
  "for students",
  "for blogs",
  "for seo",
  "for research papers",
  "for emails",
  "for linkedin",
  "for youtube",
  "for college",
  "for business",
] as const;

export function byKey<T extends NamedItem>(list: T[]): Map<string, T> {
  return new Map(list.map((x) => [x.key, x]));
}

export const DETECTOR_MAP = byKey(DETECTORS);
export const MODEL_MAP = byKey(MODELS);
export const DOC_MAP = byKey(DOCS);
export const ROLE_MAP = byKey(ROLES);
export const GEO_MAP = byKey(GEOS);
export const COMPETITOR_MAP = byKey(COMPETITORS);
export const TASK_MAP = byKey(TASKS);
