import { type Metadata } from "next";
import UnifiedHomePage from "./UnifiedHomePage";

export const metadata: Metadata = {
  title: "AI Humanizer — Free AI Text Humanizer to Bypass AI Detection | HumanifyLab",
  description: "Humanize AI text in seconds. HumanifyLab rewrites ChatGPT, Claude & Gemini output into natural human writing that passes Turnitin, GPTZero, Originality.ai, ZeroGPT & Copyleaks. Free to try — no sign-up required.",
  keywords: [
    "HumanifyLab",
    "ai humanizer",
    "humanize ai text",
    "free ai humanizer",
    "ai text humanizer",
    "best ai humanizer",
    "undetectable ai humanizer",
    "bypass ai detection",
    "bypass turnitin ai detection",
    "bypass gptzero",
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
    title: "AI Humanizer — Free AI Text Humanizer to Bypass AI Detection",
    description: "Rewrite ChatGPT, Claude & Gemini output into natural human writing that passes Turnitin, GPTZero, Originality.ai and every major AI detector. Free to try.",
    url: "https://www.humanifylab.com",
    siteName: "HumanifyLab",
    images: [
      {
        url: "https://www.humanifylab.com/forOpenGraph.png",
        width: 1200,
        height: 630,
        alt: "HumanifyLab — Professional AI Humanizer"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Humanizer — Free AI Text Humanizer to Bypass AI Detection",
    description: "Rewrite ChatGPT, Claude & Gemini output into natural human writing that passes Turnitin, GPTZero, Originality.ai and every major AI detector. Free to try.",
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
        "name": "HumanifyLab AI Humanizer",
        "description": "HumanifyLab is an AI text humanizer that transforms AI-generated content from ChatGPT, Claude and Gemini into natural, human-like writing that passes AI detection tools such as Turnitin, GPTZero and Originality.ai.",
        "url": "https://www.humanifylab.com",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "description": "Free plan with monthly word credits; paid plans available."
        },
        "creator": { "@id": "https://www.humanifylab.com/#organization" },
        "publisher": { "@id": "https://www.humanifylab.com/#organization" },
        "featureList": [
          "AI text humanization",
          "Bypasses Turnitin, GPTZero, Originality.ai, ZeroGPT and Copyleaks",
          "Multiple writing style presets",
          "Meaning-preserving rewriting",
          "Document upload (PDF, DOCX)",
          "Fast processing under 10 seconds",
          "History tracking"
        ]
      },
      {
        "@type": "WebPage",
        "@id": "https://www.humanifylab.com/#webpage",
        "url": "https://www.humanifylab.com",
        "name": "AI Humanizer — Free AI Text Humanizer to Bypass AI Detection | HumanifyLab",
        "isPartOf": { "@id": "https://www.humanifylab.com/#website" },
        "about": { "@id": "https://www.humanifylab.com/#software" },
        "inLanguage": "en-US"
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.humanifylab.com/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How is my data protected?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Enterprise-grade encryption protects your content in transit and at rest. We never train models on your data, and you maintain full control with instant deletion capabilities."
            }
          },
          {
            "@type": "Question",
            "name": "What is the humanization quality rate?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "HumanifyLab utilizes advanced language models combined with sophisticated post-processing algorithms to transform AI text into natural, professional human writing while preserving semantic integrity and contextual meaning."
            }
          },
          {
            "@type": "Question",
            "name": "Which file formats are supported?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The platform accepts direct text input or file uploads in .txt, .docx, and .pdf formats. Content is automatically extracted and processed for immediate humanization."
            }
          },
          {
            "@type": "Question",
            "name": "How does the credit system work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Credits operate on a 1:1 word ratio. Monthly allocations reset automatically, with instant top-up options available for paid subscriptions."
            }
          },
          {
            "@type": "Question",
            "name": "Are team and enterprise plans available?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Premium plans include collaborative workspaces, usage analytics, centralized billing, and dedicated support. Contact our team to configure your enterprise deployment."
            }
          },
          {
            "@type": "Question",
            "name": "What support channels are available?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Access support through in-app messaging or email at humanifylab1@gmail.com. Premium and Enterprise subscribers receive priority response with dedicated account management."
            }
          }
        ]
      }
    ]
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
