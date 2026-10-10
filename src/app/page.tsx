import { type Metadata } from "next";
import UnifiedHomePage from "./UnifiedHomePage";

export const metadata: Metadata = {
  title: "Humanize AI Text Free | #1 AI Humanizer & AI Detector Bypass Tool",
  description:
    "Looking for how to avoid AI detection? Use DebotifyText to humanize AI text from ChatGPT, Claude, and Gemini. The best AI humanizer to bypass AI detectors for free.",
  keywords: [
    "DebotifyText",
    "debotify",
    "debotify ai",
    "debotify text",
    "debotifytext humanizer",
    "debitify",
    "debitifytext",
    "debitify text",
    "unrobotictext",
    "unrobotic text",
    "ai humanizer",
    "humanize ai",
    "text humanizer",
    "humanizer ai",
    "ai rewriter",
    "ai rewriting",
    "content humanizer",
    "ai paraphraser",
    "rewrite ai",
    "clarity bubble",
    "claritybubble",
    "clarity ai",
    "humanize ai text",
    "ai text humanizer",
    "free ai humanizer",
    "best ai humanizer",
    "bypass ai detector",
    "bypass ai detection",
    "bypass turnitin",
    "bypass gptzero",
    "0% ai score",
    "undetectable ai humanizer",
    "humanize chatgpt text",
    "essay humanizer",
    "ai to human text converter",
  ],
  authors: [{ name: "DebotifyText" }],
  creator: "DebotifyText",
  publisher: "DebotifyText",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://www.debotifytext.com",
  },
  openGraph: {
    title: "Humanize AI Text Free | #1 AI Humanizer & AI Detector Bypass Tool",
    description:
      "Looking for how to avoid AI detection? Use DebotifyText to humanize AI text from ChatGPT, Claude, and Gemini. The best AI humanizer to bypass AI detectors for free.",
    url: "https://www.debotifytext.com",
    siteName: "DebotifyText",
    images: [
      {
        url: "https://www.debotifytext.com/forOpenGraph.png",
        width: 1200,
        height: 630,
        alt: "DebotifyText — Debotify AI Text Free",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Humanize AI Text Free | #1 AI Humanizer & AI Detector Bypass Tool",
    description:
      "Looking for how to avoid AI detection? Use DebotifyText to humanize AI text from ChatGPT, Claude, and Gemini. The best AI humanizer to bypass AI detectors for free.",
    images: ["https://www.debotifytext.com/forOpenGraph.png"],
    site: "@debotifytext",
    creator: "@debotifytext",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function HomePage() {
  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.debotifytext.com/#organization",
        name: "DebotifyText",
        alternateName: [
          "Debotify",
          "Debotify Text",
          "DebotifyText AI Humanizer",
          "Debitify",
          "DebitifyText",
          "Debitify Text",
          "DebotifyText Humanizer",
          "UnroboticText",
          "Unrobotic Text"
        ],
        url: "https://www.debotifytext.com",
        logo: "https://www.debotifytext.com/debotify-logo.png",
        sameAs: ["https://twitter.com/debotifytext"]
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://www.debotifytext.com/#software",
        name: "DebotifyText AI Humanizer",
        description:
          "DebotifyText is an AI text humanizer that rewrites ChatGPT, Claude and Gemini content into natural writing engineered to pass Turnitin, GPTZero, Originality.ai and Copyleaks — helping users score closer to 0% AI.",
        url: "https://www.debotifytext.com",
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          description: "Free plan available; Lifetime and monthly plans for higher volume.",
        },
        creator: { "@id": "https://www.debotifytext.com/#organization" },
        publisher: { "@id": "https://www.debotifytext.com/#organization" },
        featureList: [
          "AI text humanization",
          "Bypass Turnitin, GPTZero, Originality.ai, ZeroGPT and Copyleaks",
          "Workflows for 0% AI score goals",
          "Meaning-preserving rewriting",
          "Document upload (PDF, DOCX)",
          "Lifetime pay-once plan",
          "History tracking",
        ],
      },
      {
        "@type": "WebPage",
        "@id": "https://www.debotifytext.com/#webpage",
        url: "https://www.debotifytext.com",
        name: "DebotifyText: The #1 Free AI Humanizer & Detector Bypass",
        isPartOf: { "@id": "https://www.debotifytext.com/#website" },
        about: { "@id": "https://www.debotifytext.com/#software" },
        inLanguage: "en-US",
      },
      {
        "@type": "HowTo",
        "@id": "https://www.debotifytext.com/#howto",
        name: "How to humanize AI text and bypass AI detectors with DebotifyText",
        description:
          "Paste AI text, run DebotifyText, and verify on Turnitin, GPTZero, or Originality.ai to score closer to 0% AI.",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Paste your AI text",
            text: "Paste content from ChatGPT, Claude, Gemini, or upload a .txt, .docx, or .pdf file.",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Humanize",
            text: "Click Humanize. DebotifyText rewrites sentence rhythm, burstiness, and phrasing while preserving meaning.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Verify and use",
            text: "Copy or download the output, then re-check in your AI detector before submitting.",
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.debotifytext.com/#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is DebotifyText?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "DebotifyText (often searched as Debotify or Debotify Text) is the #1 free AI text humanizer. It intelligently rewrites robotic ChatGPT, Claude, and Gemini text into natural, human-like writing that easily bypasses AI detectors like Turnitin, GPTZero, and Originality.ai.",
            },
          },
          {
            "@type": "Question",
            name: "Is Debotify free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, DebotifyText offers a genuinely free plan to test the AI humanizer. You can paste your text and see exactly how it bypasses AI detection and improves readability before ever needing to upgrade to our unlimited Lifetime plan.",
            },
          },
          {
            "@type": "Question",
            name: "How does Debotify Text work?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Debotify Text uses proprietary anti-detection models to analyze the predictability (perplexity and burstiness) of your AI draft. It then reconstructs the sentence phrasing, vocabulary, and rhythm to mirror human writing, completely removing the AI watermark.",
            },
          },
          {
            "@type": "Question",
            name: "Which is the best AI text humanizer in 2026?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "DebotifyText is widely considered the best text humanizer because it actually preserves the original meaning of your text while successfully scoring 0% AI on rigorous detectors like Turnitin and GPTZero. Unlike basic paraphrasers, it is purpose-built for humanization.",
            },
          },
          {
            "@type": "Question",
            name: "How to 100% humanize AI text?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Paste your AI draft (150+ words works best) into DebotifyText at debotifytext.com, pick a tone, and click Humanize. Then do a short personal edit pass - fix names, numbers, and quotes, and add one sentence only you could write. A dedicated humanizer plus a human edit is what gets text reading 100% human.",
            },
          },
          {
            "@type": "Question",
            name: "Can ChatGPT humanize AI text?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Not reliably. Asking ChatGPT to humanize its own output keeps the same statistical fingerprints detectors look for - uniform rhythm and predictable word choice. A dedicated AI humanizer like DebotifyText is built to vary sentence length, burstiness, and phrasing, which is why it outperforms prompting ChatGPT to rewrite itself.",
            },
          },
          {
            "@type": "Question",
            name: "Can AI humanize a text?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes - that is exactly what an AI humanizer does. DebotifyText uses advanced models trained specifically to rewrite robotic drafts with natural cadence and varied vocabulary while keeping the original meaning completely intact.",
            },
          },
          {
            "@type": "Question",
            name: "Can DebotifyText help drafts that were flagged by AI detectors?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "DebotifyText rewrites ChatGPT, Claude, and Gemini drafts toward more natural rhythm and wording. Detectors such as Turnitin, GPTZero, Originality.ai, Copyleaks, and ZeroGPT still need your own verification. Scores are estimates and can false-positive. Do not treat a humanizer as permission to misrepresent authorship.",
            },
          },
          {
            "@type": "Question",
            name: "How do I score closer to 0% AI with DebotifyText?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Paste at least 100–250 words, pick Academic or Default tone, run Humanize, then re-check in your detector. For best results, do a short personal edit pass.",
            },
          },
          {
            "@type": "Question",
            name: "How is my data protected?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Encryption protects your content in transit and at rest. We do not train models on your drafts, and you control what stays in history.",
            },
          },
          {
            "@type": "Question",
            name: "How does the credit system work?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "1 credit = 1 word. Monthly plans refresh on a schedule; Lifetime refreshes 20,000 words every month forever after a one-time payment.",
            },
          },
          {
            "@type": "Question",
            name: "What is the Back-to-School Lifetime deal?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Pay once for lifetime access with 20,000 words every month — no subscription renewals. Timed for school opening so students and writers can lock in humanization for the year and beyond.",
            },
          },
          {
            "@type": "Question",
            name: "What support channels are available?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Email debotifytext@gmail.com or use in-app messaging. Paid plans get priority response.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeSchema) }}
      />
      <UnifiedHomePage />
    </>
  );
}
