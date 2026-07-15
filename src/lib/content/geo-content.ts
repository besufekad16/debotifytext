import type { KeywordEntryGeo } from "~/lib/pseo-data-geo";

export interface GeoContentData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  badge: string;
  flag: string;
  stats: { value: string; label: string }[];
  whyTitle: string;
  whyPoints: { icon: string; title: string; description: string }[];
  audienceTitle: string;
  audiencePoints: { icon: string; title: string; description: string }[];
  detectorsTitle: string;
  detectors: { name: string; note: string }[];
  stepsTitle: string;
  steps: { number: string; title: string; description: string }[];
  pricingNote: string;
  faqTitle: string;
  faqs: { q: string; a: string }[];
  finalCtaTitle: string;
  finalCtaSubtitle: string;
}

interface GeoRecord extends Omit<GeoContentData, "metaTitle" | "metaDescription" | "h1"> {
  displayName: string;
}

const GEO_DATA: Record<string, GeoRecord> = {
  USA: {
    displayName: "the United States",
    flag: "🇺🇸",
    badge: "Trusted Across All 50 States",
    heroSubtitle:
      "From community colleges to the Ivy League, and from freelance writers in Austin to SaaS marketing teams in San Francisco — HumanifyLab is the AI humanizer built for how Americans actually write, priced in USD with no card required to start.",
    stats: [
      { value: "180K+", label: "US Users" },
      { value: "99.9%", label: "Bypass Rate" },
      { value: "<10s", label: "Turnaround" },
      { value: "24/7", label: "US Support Hours" },
    ],
    whyTitle: "Why US Users Choose HumanifyLab",
    whyPoints: [
      { icon: "🎓", title: "Built for US Academic Standards", description: "Turnitin and GPTZero are used by the vast majority of US colleges and universities. HumanifyLab's Academic tone preset is tuned specifically for the citation styles (APA, MLA, Chicago) US institutions expect." },
      { icon: "💵", title: "USD Pricing, No Surprises", description: "Every plan is billed in US dollars with transparent monthly pricing — no currency conversion guesswork, no hidden fees." },
      { icon: "🏢", title: "Built for US Content Teams", description: "US marketing agencies and SaaS companies use HumanifyLab's bulk and API tools to keep AI-assisted content production compliant with in-house editorial standards." },
      { icon: "⚡", title: "Low-Latency US Servers", description: "Requests from US IP addresses route to the nearest edge region, keeping the under-10-second processing time consistent coast to coast." },
    ],
    audienceTitle: "Who Uses HumanifyLab in the US",
    audiencePoints: [
      { icon: "📚", title: "College & Grad Students", description: "Undergrad and graduate students across the US use HumanifyLab to make AI-assisted drafts pass Turnitin before submission." },
      { icon: "✍️", title: "Freelance Writers", description: "US-based freelance writers on platforms like Upwork and Contently use HumanifyLab to meet client 'AI-free' guarantees." },
      { icon: "📈", title: "SaaS Marketing Teams", description: "Content and growth teams at US SaaS companies humanize AI-drafted blog posts and landing pages before publishing." },
      { icon: "🏛️", title: "Agencies & Consultants", description: "US digital marketing agencies run client deliverables through HumanifyLab to guarantee human-quality copy at scale." },
    ],
    detectorsTitle: "Detectors Common in the US",
    detectors: [
      { name: "Turnitin", note: "Used by an estimated 70%+ of US four-year universities" },
      { name: "GPTZero", note: "Popular with individual US professors and K-12 school districts" },
      { name: "Originality.AI", note: "Widely used by US content agencies and publishers" },
      { name: "Copyleaks", note: "Integrated into many US LMS platforms like Canvas and Blackboard" },
    ],
    stepsTitle: "Get Started in the US",
    steps: [
      { number: "1", title: "Paste your content", description: "Drop in your AI-drafted essay, blog post, or business document — no sign-up needed for your first run." },
      { number: "2", title: "Pick a tone", description: "Choose Academic for coursework or Professional for business writing — both tuned for US audiences." },
      { number: "3", title: "Humanize instantly", description: "Get a rewritten, undetectable version in under 10 seconds, ready to submit or publish." },
    ],
    pricingNote: "Plans start at $0/month (free tier) with paid plans billed in USD — see current pricing on the Pricing page.",
    faqTitle: "US FAQs",
    faqs: [
      { q: "Does HumanifyLab work with Turnitin used by US universities?", a: "Yes. HumanifyLab is tested weekly against live Turnitin submissions and consistently returns AI scores in the 0-3% range, well under most US institutions' flagging threshold." },
      { q: "Is pricing in US dollars?", a: "Yes, all HumanifyLab plans are billed in USD with no currency conversion fees for US customers." },
      { q: "Can US businesses use HumanifyLab for client content?", a: "Yes — HumanifyLab's Professional tone and bulk processing are built for US agencies and SaaS content teams producing client-facing material at volume." },
    ],
    finalCtaTitle: "Join 180,000+ US Users",
    finalCtaSubtitle: "Free plan available. No credit card required. Results in under 10 seconds.",
  },

  Canada: {
    displayName: "Canada",
    flag: "🇨🇦",
    badge: "Coast to Coast Coverage",
    heroSubtitle:
      "Canadian universities lean heavily on Turnitin, and Canadian businesses need content that reads naturally in both English and French markets. HumanifyLab covers both — with CAD-friendly pricing and support for bilingual content teams.",
    stats: [
      { value: "24K+", label: "Canadian Users" },
      { value: "99.9%", label: "Bypass Rate" },
      { value: "50+", label: "Languages incl. French" },
      { value: "<10s", label: "Turnaround" },
    ],
    whyTitle: "Why Canadian Users Choose HumanifyLab",
    whyPoints: [
      { icon: "🍁", title: "Built for Canadian Institutions", description: "Canadian universities from UBC to the University of Toronto rely heavily on Turnitin — HumanifyLab's Academic preset is tested against it weekly." },
      { icon: "🇫🇷", title: "Bilingual by Default", description: "HumanifyLab supports French alongside English, so Québec-based students and businesses get the same 99.9% bypass rate in either language." },
      { icon: "🏢", title: "Built for Canadian SMBs", description: "Small and mid-size Canadian businesses use HumanifyLab to keep AI-assisted marketing copy sounding local and authentic." },
      { icon: "🔒", title: "PIPEDA-Conscious Privacy", description: "HumanifyLab stores zero submitted content, aligning with the privacy expectations Canadian users hold their software to." },
    ],
    audienceTitle: "Who Uses HumanifyLab in Canada",
    audiencePoints: [
      { icon: "📚", title: "University Students", description: "Students at Canadian universities use HumanifyLab to submit AI-assisted essays that pass Turnitin scans." },
      { icon: "🍁", title: "Bilingual Content Teams", description: "Marketing teams serving both English and French-speaking Canadian markets humanize content in both languages." },
      { icon: "💻", title: "Tech & SaaS Startups", description: "Canada's growing SaaS sector (Toronto, Vancouver, Waterloo) uses HumanifyLab to scale content production without an AI-written feel." },
    ],
    detectorsTitle: "Detectors Common in Canada",
    detectors: [
      { name: "Turnitin", note: "The default AI/plagiarism checker at most Canadian universities" },
      { name: "GPTZero", note: "Used by individual instructors across Canadian colleges" },
      { name: "Copyleaks", note: "Common in Canadian corporate compliance workflows" },
    ],
    stepsTitle: "Get Started in Canada",
    steps: [
      { number: "1", title: "Paste your content", description: "Works in English or French — no sign-up required for your first run." },
      { number: "2", title: "Choose your tone", description: "Academic for coursework, Professional for business — both calibrated for Canadian audiences." },
      { number: "3", title: "Get your result", description: "Undetectable, natural-reading text in under 10 seconds." },
    ],
    pricingNote: "Free plan available; paid plans are billed in USD but display clearly with no hidden conversion fees for Canadian cardholders.",
    faqTitle: "Canada FAQs",
    faqs: [
      { q: "Does HumanifyLab work in French?", a: "Yes — HumanifyLab supports French alongside 50+ other languages, with the same 99.9% bypass rate." },
      { q: "Is HumanifyLab tested against Canadian university systems?", a: "Yes, HumanifyLab is tested weekly against Turnitin, the detector used by the majority of Canadian universities." },
    ],
    finalCtaTitle: "Trusted by 24,000+ Canadian Users",
    finalCtaSubtitle: "Free plan available. Works in English and French. Results in under 10 seconds.",
  },

  UK: {
    displayName: "the United Kingdom",
    flag: "🇬🇧",
    badge: "Built for Russell Group Standards",
    heroSubtitle:
      "UK universities run some of the strictest academic integrity policies in the world, and UK content agencies face growing client demand for provably human copy. HumanifyLab is tuned for both, with GBP-aware pricing and UK spelling conventions supported.",
    stats: [
      { value: "31K+", label: "UK Users" },
      { value: "99.9%", label: "Bypass Rate" },
      { value: "24", label: "Russell Group Unis Covered" },
      { value: "<10s", label: "Turnaround" },
    ],
    whyTitle: "Why UK Users Choose HumanifyLab",
    whyPoints: [
      { icon: "🎓", title: "Russell Group Tested", description: "HumanifyLab is tested weekly against Turnitin as deployed across Russell Group universities, where AI-detection policy is especially strict." },
      { icon: "🇬🇧", title: "UK English Supported", description: "Output respects UK spelling and phrasing conventions rather than defaulting to American English." },
      { icon: "📰", title: "Built for UK Publishers", description: "UK content agencies and publishers use HumanifyLab's Professional tone to meet 'human-written' guarantees for clients." },
      { icon: "🔐", title: "UK GDPR-Aligned Privacy", description: "Zero data retention on submitted content aligns with the privacy standards UK users expect under UK GDPR." },
    ],
    audienceTitle: "Who Uses HumanifyLab in the UK",
    audiencePoints: [
      { icon: "📚", title: "University Students", description: "From Russell Group universities to further education colleges, UK students use HumanifyLab to pass Turnitin before submission." },
      { icon: "✍️", title: "Freelance & Agency Writers", description: "UK copywriters and agencies use HumanifyLab to guarantee AI-assisted drafts read as fully human-written." },
      { icon: "📈", title: "UK SaaS & Fintech", description: "London's SaaS and fintech content teams humanize AI-drafted product and marketing copy at scale." },
    ],
    detectorsTitle: "Detectors Common in the UK",
    detectors: [
      { name: "Turnitin", note: "The default tool across UK higher education, including all Russell Group members" },
      { name: "GPTZero", note: "Used by individual UK lecturers and sixth-form colleges" },
      { name: "Copyleaks", note: "Common in UK corporate and publishing compliance checks" },
    ],
    stepsTitle: "Get Started in the UK",
    steps: [
      { number: "1", title: "Paste your content", description: "No sign-up needed for your first run — UK English supported by default." },
      { number: "2", title: "Choose your tone", description: "Academic for coursework and dissertations, Professional for agency and business work." },
      { number: "3", title: "Get your result", description: "Undetectable text in under 10 seconds, ready to submit or publish." },
    ],
    pricingNote: "Free plan available. Paid plans display in USD; GBP cardholders are charged at the prevailing exchange rate with no additional HumanifyLab fees.",
    faqTitle: "UK FAQs",
    faqs: [
      { q: "Is HumanifyLab tested against UK university Turnitin deployments?", a: "Yes, weekly, including configurations used across Russell Group universities." },
      { q: "Does the output use UK spelling?", a: "Yes — select UK English in the tone settings and HumanifyLab will use UK spelling and phrasing conventions." },
    ],
    finalCtaTitle: "Trusted by 31,000+ UK Users",
    finalCtaSubtitle: "Free plan available. UK English supported. Results in under 10 seconds.",
  },

  Europe: {
    displayName: "Europe",
    flag: "🇪🇺",
    badge: "GDPR-First, 30+ Countries",
    heroSubtitle:
      "From German engineering universities to French business schools and Nordic SaaS startups, European users need an AI humanizer that respects strict data protection law and works fluently across languages. HumanifyLab does both.",
    stats: [
      { value: "42K+", label: "EU Users" },
      { value: "99.9%", label: "Bypass Rate" },
      { value: "30+", label: "European Languages" },
      { value: "0", label: "Data Retained" },
    ],
    whyTitle: "Why European Users Choose HumanifyLab",
    whyPoints: [
      { icon: "🔐", title: "GDPR-Aligned by Design", description: "Zero data retention on every submission means there's nothing to store, export, or worry about under EU data protection law." },
      { icon: "🌍", title: "Fluent in 30+ European Languages", description: "German, French, Spanish, Italian, Dutch, Polish and more — the same 99.9% bypass rate applies regardless of language." },
      { icon: "🎓", title: "Built for European Academic Norms", description: "European universities increasingly deploy Turnitin, Compilatio (France) and Urkund/Ouriginal (Nordics) — HumanifyLab is tested against all three." },
      { icon: "💶", title: "Transparent Euro-Friendly Pricing", description: "No hidden conversion markups for Eurozone cardholders." },
    ],
    audienceTitle: "Who Uses HumanifyLab in Europe",
    audiencePoints: [
      { icon: "📚", title: "University Students", description: "Students across Germany, France, the Netherlands, Poland, Italy and the Nordics use HumanifyLab to pass local detection systems." },
      { icon: "🏢", title: "European SaaS Teams", description: "Startups in Berlin, Amsterdam, Paris and Stockholm humanize AI-drafted content for multilingual European markets." },
      { icon: "✍️", title: "Translators & Content Teams", description: "Multilingual content teams use HumanifyLab to keep AI-assisted translations reading naturally in the target language." },
    ],
    detectorsTitle: "Detectors Common in Europe",
    detectors: [
      { name: "Turnitin", note: "Widely deployed across Western and Southern European universities" },
      { name: "Compilatio", note: "The standard AI/plagiarism checker at most French institutions" },
      { name: "Urkund / Ouriginal", note: "Common across Nordic and Baltic universities" },
      { name: "Copyleaks", note: "Used by European enterprises for compliance content review" },
    ],
    stepsTitle: "Get Started in Europe",
    steps: [
      { number: "1", title: "Paste your content", description: "In any of 30+ supported European languages — no sign-up required." },
      { number: "2", title: "Choose your tone", description: "Academic for coursework, Professional for business and marketing content." },
      { number: "3", title: "Get your result", description: "Natural-reading, undetectable text in under 10 seconds." },
    ],
    pricingNote: "Free plan available. Euro pricing shown at checkout for Eurozone cardholders with no additional conversion fees.",
    faqTitle: "Europe FAQs",
    faqs: [
      { q: "Is HumanifyLab GDPR-compliant?", a: "HumanifyLab retains zero data from submitted content, which aligns directly with GDPR's data minimization principle." },
      { q: "Does HumanifyLab work in languages other than English?", a: "Yes — 30+ European languages are supported with the same bypass rate and processing speed as English." },
      { q: "Is HumanifyLab tested against Compilatio and Urkund?", a: "Yes, alongside Turnitin, both are tested weekly to ensure consistent bypass rates across European academic systems." },
    ],
    finalCtaTitle: "Trusted by 42,000+ Users Across Europe",
    finalCtaSubtitle: "Free plan available. 30+ languages supported. Zero data retained.",
  },

  Australia: {
    displayName: "Australia",
    flag: "🇦🇺",
    badge: "Trusted by Go8 Universities",
    heroSubtitle:
      "Australian universities enforce some of the strictest academic integrity policies globally, often layering Turnitin with Copyleaks. HumanifyLab is tested against both, with AUD-aware pricing and support tuned to Australian time zones.",
    stats: [
      { value: "19K+", label: "Australian Users" },
      { value: "99.9%", label: "Bypass Rate" },
      { value: "8", label: "Group of Eight Unis Covered" },
      { value: "<10s", label: "Turnaround" },
    ],
    whyTitle: "Why Australian Users Choose HumanifyLab",
    whyPoints: [
      { icon: "🎓", title: "Tested Against Go8 Detection Stacks", description: "Group of Eight universities often run Turnitin and Copyleaks together — HumanifyLab is verified weekly against both simultaneously." },
      { icon: "🕐", title: "AEST/AEDT-Friendly Support", description: "Support responses are tuned to Australian working hours, so questions don't sit unanswered overnight." },
      { icon: "💼", title: "Built for Australian SMBs", description: "Australian small businesses and agencies use HumanifyLab to scale AI-assisted marketing content without losing a local, human voice." },
      { icon: "💰", title: "AUD-Aware Pricing", description: "Clear pricing at checkout for Australian cardholders with no surprise conversion costs." },
    ],
    audienceTitle: "Who Uses HumanifyLab in Australia",
    audiencePoints: [
      { icon: "📚", title: "University Students", description: "Students at Go8 and regional Australian universities use HumanifyLab to pass combined Turnitin + Copyleaks checks." },
      { icon: "🏢", title: "Marketing Agencies", description: "Sydney and Melbourne-based agencies humanize AI-drafted client content before delivery." },
      { icon: "📈", title: "Australian SaaS Startups", description: "Australia's growing SaaS sector uses HumanifyLab to keep AI-assisted content production sounding authentically local." },
    ],
    detectorsTitle: "Detectors Common in Australia",
    detectors: [
      { name: "Turnitin", note: "Deployed at nearly every Australian university, often as the primary check" },
      { name: "Copyleaks", note: "Frequently layered alongside Turnitin at Go8 institutions" },
      { name: "GPTZero", note: "Used by individual lecturers and TAFE instructors" },
    ],
    stepsTitle: "Get Started in Australia",
    steps: [
      { number: "1", title: "Paste your content", description: "No sign-up required for your first run." },
      { number: "2", title: "Choose your tone", description: "Academic for coursework, Professional for agency and business writing." },
      { number: "3", title: "Get your result", description: "Undetectable, natural-reading text in under 10 seconds — any time zone." },
    ],
    pricingNote: "Free plan available. AUD pricing shown clearly at checkout with no hidden conversion fees.",
    faqTitle: "Australia FAQs",
    faqs: [
      { q: "Does HumanifyLab work against combined Turnitin + Copyleaks checks used by Go8 universities?", a: "Yes — HumanifyLab is tested weekly against both detectors simultaneously, which is how most Group of Eight universities deploy them." },
      { q: "Is support available during Australian hours?", a: "Yes, support responses are structured around AEST/AEDT so Australian users aren't waiting overnight for answers." },
    ],
    finalCtaTitle: "Trusted by 19,000+ Australian Users",
    finalCtaSubtitle: "Free plan available. Tested against Go8 detection stacks. Results in under 10 seconds.",
  },

  "South Africa": {
    displayName: "South Africa",
    flag: "🇿🇦",
    badge: "Built for SA Universities & Growing SaaS",
    heroSubtitle:
      "South African universities lean heavily on Turnitin, and South Africa's fast-growing tech and content sector needs tools that work reliably despite variable connectivity. HumanifyLab is lightweight, fast, and priced accessibly for the South African market.",
    stats: [
      { value: "11K+", label: "South African Users" },
      { value: "99.9%", label: "Bypass Rate" },
      { value: "<10s", label: "Turnaround" },
      { value: "50+", label: "Languages Supported" },
    ],
    whyTitle: "Why South African Users Choose HumanifyLab",
    whyPoints: [
      { icon: "🎓", title: "Built for SA University Policy", description: "Universities including UCT, Wits, Stellenbosch and UP rely on Turnitin — HumanifyLab is tested weekly to stay ahead of it." },
      { icon: "⚡", title: "Fast Even on Variable Connections", description: "HumanifyLab's lightweight interface is built to process quickly even where bandwidth is inconsistent." },
      { icon: "💼", title: "Supporting SA's Growing Tech Sector", description: "Cape Town and Johannesburg's expanding SaaS and content agencies use HumanifyLab to scale AI-assisted content production affordably." },
      { icon: "🌍", title: "Multilingual for a Multilingual Country", description: "Support for English and Afrikaans alongside 50+ other languages fits South Africa's linguistic diversity." },
    ],
    audienceTitle: "Who Uses HumanifyLab in South Africa",
    audiencePoints: [
      { icon: "📚", title: "University Students", description: "Students at UCT, Wits, Stellenbosch, UP and other SA universities use HumanifyLab ahead of Turnitin submissions." },
      { icon: "💻", title: "SA Tech & SaaS Teams", description: "South Africa's growing SaaS and startup scene uses HumanifyLab to keep content production costs low without sacrificing quality." },
      { icon: "✍️", title: "Freelancers & Agencies", description: "South African freelance writers and digital agencies serving international clients use HumanifyLab to meet 'human-written' requirements." },
    ],
    detectorsTitle: "Detectors Common in South Africa",
    detectors: [
      { name: "Turnitin", note: "The dominant AI/plagiarism checker across South African higher education" },
      { name: "GPTZero", note: "Used by individual SA lecturers and private colleges" },
    ],
    stepsTitle: "Get Started in South Africa",
    steps: [
      { number: "1", title: "Paste your content", description: "No sign-up required — works reliably even on slower connections." },
      { number: "2", title: "Choose your tone", description: "Academic for coursework, Professional for business and freelance work." },
      { number: "3", title: "Get your result", description: "Undetectable text in under 10 seconds." },
    ],
    pricingNote: "Free plan available. Accessible pricing designed to work for the South African market, billed in USD.",
    faqTitle: "South Africa FAQs",
    faqs: [
      { q: "Does HumanifyLab work against Turnitin as used by South African universities?", a: "Yes — HumanifyLab is tested weekly against Turnitin, the detector used by the vast majority of SA universities including UCT, Wits, Stellenbosch and UP." },
      { q: "Does HumanifyLab support Afrikaans?", a: "Yes, Afrikaans is supported alongside English and 50+ other languages." },
    ],
    finalCtaTitle: "Trusted by 11,000+ South African Users",
    finalCtaSubtitle: "Free plan available. Fast even on variable connections. Results in under 10 seconds.",
  },

  Asia: {
    displayName: "Asia",
    flag: "🌏",
    badge: "Supporting 15+ Asian Markets",
    heroSubtitle:
      "From students at IITs and NUS to content teams in Manila, Jakarta, and Karachi, Asia's fast-growing student and SaaS markets are among the most open to AI tooling in the world. HumanifyLab supports the region's major languages and its most common detection systems.",
    stats: [
      { value: "67K+", label: "Users Across Asia" },
      { value: "99.9%", label: "Bypass Rate" },
      { value: "15+", label: "Asian Markets Covered" },
      { value: "<10s", label: "Turnaround" },
    ],
    whyTitle: "Why Asian Users Choose HumanifyLab",
    whyPoints: [
      { icon: "🎓", title: "Built for Rapidly Growing Academic Markets", description: "Universities across India, the Philippines, Singapore, and Pakistan are adopting Turnitin and Originality.AI quickly — HumanifyLab keeps pace with weekly testing." },
      { icon: "💻", title: "Fit for Asia's SaaS Boom", description: "Startups across Singapore, India, and Southeast Asia use HumanifyLab to scale AI-assisted content production for global markets." },
      { icon: "🌏", title: "Multilingual Across the Region", description: "Supports Hindi, Filipino, Indonesian, Urdu, and other regional languages alongside English." },
      { icon: "💰", title: "Accessible Pricing", description: "A generous free tier and low-cost paid plans make HumanifyLab practical for students and early-stage startups across price-sensitive markets." },
    ],
    audienceTitle: "Who Uses HumanifyLab in Asia",
    audiencePoints: [
      { icon: "📚", title: "University Students", description: "Students at IITs, NUS, University of the Philippines, and universities across Pakistan and Southeast Asia use HumanifyLab ahead of submission deadlines." },
      { icon: "💻", title: "SaaS & Startup Teams", description: "Startups across India, Singapore, Indonesia, and the Philippines use HumanifyLab to keep content production fast and affordable." },
      { icon: "✍️", title: "Freelancers & Content Agencies", description: "A large share of the world's freelance content workforce is based in Asia — HumanifyLab helps meet international clients' 'human-written' requirements." },
    ],
    detectorsTitle: "Detectors Common Across Asia",
    detectors: [
      { name: "Turnitin", note: "Used at most major universities across India, Singapore, Philippines and Pakistan" },
      { name: "GPTZero", note: "Increasingly adopted by individual instructors region-wide" },
      { name: "Originality.AI", note: "Common among Asia-based content and SEO agencies" },
    ],
    stepsTitle: "Get Started in Asia",
    steps: [
      { number: "1", title: "Paste your content", description: "In English or a regional language — no sign-up required for your first run." },
      { number: "2", title: "Choose your tone", description: "Academic for coursework, Professional for business and agency work." },
      { number: "3", title: "Get your result", description: "Undetectable, natural-reading text in under 10 seconds." },
    ],
    pricingNote: "Free plan available. Low-cost paid plans designed to be accessible across price-sensitive Asian markets.",
    faqTitle: "Asia FAQs",
    faqs: [
      { q: "Does HumanifyLab support regional Asian languages?", a: "Yes — Hindi, Filipino, Indonesian, Urdu and more are supported alongside English, all with the same 99.9% bypass rate." },
      { q: "Is HumanifyLab affordable for students in price-sensitive markets?", a: "Yes — the free tier covers everyday use, and paid plans are priced to remain accessible across Asian markets." },
    ],
    finalCtaTitle: "Trusted by 67,000+ Users Across Asia",
    finalCtaSubtitle: "Free plan available. 15+ Asian markets supported. Results in under 10 seconds.",
  },
};

export function generateGeoContent(entry: KeywordEntryGeo): GeoContentData {
  const rec = GEO_DATA[entry.entity] ?? GEO_DATA.USA!;
  return {
    metaTitle: `AI Humanizer for ${rec.displayName} — Bypass AI Detection | HumanifyLab`,
    metaDescription: `HumanifyLab is the AI humanizer trusted across ${rec.displayName}. 99.9% bypass rate against Turnitin, GPTZero and more. Free plan, no sign-up, results in under 10 seconds.`,
    h1: `The AI Humanizer Built for ${rec.displayName}`,
    ...rec,
  };
}
