import { type Metadata } from "next";
import UnifiedHomePage from "./UnifiedHomePage";

export const metadata: Metadata = {
  title: "AI Humanizer — Bypass AI Detectors & Score 0% AI | HumanifyLab",
  description:
    "HumanifyLab is the AI humanizer for students and writers. Humanize ChatGPT, Claude & Gemini text to bypass Turnitin, GPTZero, Originality.ai & Copyleaks — and score closer to 0% AI. Free to try.",
  keywords: [
    "HumanifyLab",
    "ai humanizer",
    "humanize ai text",
    "free ai humanizer",
    "best ai humanizer",
    "bypass ai detector",
    "bypass ai detection",
    "bypass turnitin",
    "bypass gptzero",
    "0% ai score",
    "how to score 0% ai",
    "undetectable ai humanizer",
    "humanize chatgpt text",
    "essay humanizer",
    "ai to human text converter",
  ],
  authors: [{ name: "HumanifyLab" }],
  creator: "HumanifyLab",
  publisher: "HumanifyLab",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://www.humanifylab.com",
  },
  openGraph: {
    title: "AI Humanizer — Bypass AI Detectors & Score 0% AI | HumanifyLab",
    description:
      "Rewrite ChatGPT, Claude & Gemini into natural writing that passes Turnitin, GPTZero, Originality.ai and Copyleaks. Free to try.",
    url: "https://www.humanifylab.com",
    siteName: "HumanifyLab",
    images: [
      {
        url: "https://www.humanifylab.com/forOpenGraph.png",
        width: 1200,
        height: 630,
        alt: "HumanifyLab — Professional AI Humanizer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Humanizer — Bypass AI Detectors & Score 0% AI | HumanifyLab",
    description:
      "Rewrite ChatGPT, Claude & Gemini into natural writing that passes Turnitin, GPTZero, Originality.ai and Copyleaks. Free to try.",
    images: ["https://www.humanifylab.com/forOpenGraph.png"],
    site: "@humanifylab",
    creator: "@humanifylab",
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
        "@type": "SoftwareApplication",
        "@id": "https://www.humanifylab.com/#software",
        name: "HumanifyLab AI Humanizer",
        description:
          "HumanifyLab is an AI text humanizer that rewrites ChatGPT, Claude and Gemini content into natural writing engineered to pass Turnitin, GPTZero, Originality.ai and Copyleaks — helping users score closer to 0% AI.",
        url: "https://www.humanifylab.com",
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          description: "Free plan available; Lifetime and monthly plans for higher volume.",
        },
        creator: { "@id": "https://www.humanifylab.com/#organization" },
        publisher: { "@id": "https://www.humanifylab.com/#organization" },
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
        "@id": "https://www.humanifylab.com/#webpage",
        url: "https://www.humanifylab.com",
        name: "AI Humanizer — Bypass AI Detectors & Score 0% AI | HumanifyLab",
        isPartOf: { "@id": "https://www.humanifylab.com/#website" },
        about: { "@id": "https://www.humanifylab.com/#software" },
        inLanguage: "en-US",
      },
      {
        "@type": "HowTo",
        "@id": "https://www.humanifylab.com/#howto",
        name: "How to humanize AI text and bypass AI detectors with HumanifyLab",
        description:
          "Paste AI text, run HumanifyLab, and verify on Turnitin, GPTZero, or Originality.ai to score closer to 0% AI.",
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
            text: "Click Humanize. HumanifyLab rewrites sentence rhythm, burstiness, and phrasing while preserving meaning.",
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
        "@id": "https://www.humanifylab.com/#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "Can HumanifyLab help me bypass AI detectors like Turnitin and GPTZero?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. HumanifyLab rewrites ChatGPT, Claude, and Gemini drafts so they read naturally and are engineered to pass major detectors including Turnitin, GPTZero, Originality.ai, Copyleaks, and ZeroGPT — while keeping your meaning intact.",
            },
          },
          {
            "@type": "Question",
            name: "How do I score closer to 0% AI with HumanifyLab?",
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
              text: "Email humanifylab1@gmail.com or use in-app messaging. Paid plans get priority response.",
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
