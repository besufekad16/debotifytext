import { type Metadata } from "next";
import UnifiedHomePage from "./UnifiedHomePage";

export const metadata: Metadata = {
  title: "Free AI Humanizer for Students & Essays | Bypass Turnitin, GPTZero, Originality.AI | HumanifyLab",
  description: "Best free AI humanizer for students! Bypass Turnitin, GPTZero, Originality.AI, ZeroGPT & all AI detectors. Perfect for essays, assignments & academic writing. 99.9% undetectable. Transform ChatGPT text into human writing. Trusted by 450,000+ students. Try free now!",
  keywords: [
    // Brand Keywords
    "HumanifyLab",
    "humanify",
    "humanifylab humanizer",
    "humanify lab",
    "humanifylab.com",
    
    // Student-Focused Keywords (HIGH PRIORITY)
    "ai humanizer for students",
    "free ai humanizer for students",
    "essay humanizer free",
    "humanize essay",
    "ai essay humanizer",
    "student ai humanizer",
    "college essay humanizer",
    "assignment humanizer",
    "homework ai humanizer",
    "academic ai humanizer",
    "chatgpt essay humanizer",
    "humanize chatgpt for essay",
    "make ai essay undetectable",
    "undetectable essay writer",
    
    // Core AI Humanizer Keywords
    "AI humanizer",
    "humanize AI text",
    "AI text humanizer",
    "free ai humanizer",
    "best ai humanizer",
    "undetectable ai humanizer",
    "ai to human text converter",
    "humanify ai text",
    "humanify chatgpt",
    "text humanizer",
    "humanize text",
    "ai to human text",
    
    // AI Detector Bypass Keywords (HIGH PRIORITY - STUDENT FOCUSED)
    "bypass turnitin ai detection",
    "bypass turnitin for students",
    "how to bypass turnitin",
    "bypass gptzero for essays",
    "bypass originality ai",
    "bypass gptzero",
    "bypass zerogpt",
    "bypass copyleaks",
    "bypass winston ai",
    "bypass content at scale",
    "bypass writer ai detector",
    "bypass sapling ai detector",
    "bypass ai detection",
    "undetectable ai",
    "undetectable ai writing",
    "undetectable to turnitin",
    "avoid ai detection in essays",
    "beat ai detectors for students",
    "trick turnitin ai detector",
    "make chatgpt undetectable",
    
    // Specific AI Detector Tools
    "originality ai bypass",
    "gptzero bypass",
    "turnitin ai bypass",
    "zerogpt bypass",
    "copyleaks ai bypass",
    "winston ai bypass",
    "content at scale detector bypass",
    "quillbot ai detector bypass",
    
    // Use Case Keywords (STUDENT PRIORITY)
    "essay humanizer",
    "essay ai humanizer",
    "research paper humanizer",
    "thesis humanizer",
    "dissertation humanizer",
    "academic writing humanizer",
    "college paper humanizer",
    "university assignment humanizer",
    "humanize chatgpt essay",
    "humanize chatgpt text",
    "humanize gpt4 output",
    "humanize claude ai",
    "humanize gemini text",
    "blog post humanizer",
    "content humanizer",
    
    // Quality & Features
    "natural writing",
    "professional writing",
    "authentic human writing",
    "writing enhancement",
    "paraphrase ai text",
    "rewrite ai content",
    "make ai text human",
    "ai content converter"
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
    title: "Free AI Humanizer for Students | Bypass Turnitin & All AI Detectors",
    description: "Best free AI humanizer for students & essays. Bypass Turnitin, GPTZero, Originality.AI. Perfect for academic writing. 99.9% undetectable. Trusted by 450,000+ students.",
    url: "https://www.humanifylab.com",
    siteName: "HumanifyLab",
    images: [
      {
        url: "https://www.humanifylab.com/forOpenGraph.png",
        width: 1200,
        height: 630,
        alt: "HumanifyLab - Professional AI Humanizer"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Humanizer for Students | Bypass Turnitin & All AI Detectors",
    description: "Best free AI humanizer for students & essays. Bypass Turnitin, GPTZero, Originality.AI. 99.9% undetectable. Perfect for academic writing. Try free!",
    images: ["https://www.humanifylab.com/forOpenGraph.png"],
    site: "@humanifylab",
    creator: "@humanifylab",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification-code",
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "HumanifyLab",
            "description": "AI Text Humanizer - Transform AI-generated text into natural, human-like writing with professional quality and authentic tone.",
            "url": "https://www.humanifylab.com",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "5.99",
              "priceCurrency": "USD",
              "priceValidUntil": "2026-12-31",
              "description": "Small pack with 3 credits"
            },
            "creator": {
              "@type": "Organization",
              "name": "HumanifyLab"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "1000",
              "bestRating": "5",
              "worstRating": "1"
            },
            "featureList": [
              "AI Text Humanization",
              "Smart Paraphrasing",
              "Natural Writing Enhancement",
              "Multiple Presets",
              "Fast Processing",
              "History Tracking"
            ]
          })
        }}
      />
      <UnifiedHomePage />
    </>
  );
}