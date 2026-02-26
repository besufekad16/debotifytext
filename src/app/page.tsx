import { type Metadata } from "next";
import UnifiedHomePage from "./UnifiedHomePage";

export const metadata: Metadata = {
  title: "HumanifyLab - #1 AI Humanizer | Humanify AI Text Instantly",
  description: "HumanifyLab: The most advanced AI humanizer. Transform AI text into natural, professional human writing. Trusted by 450,000+ users. Try Humanify free today!",
  keywords: [
    "HumanifyLab",
    "humanify",
    "humanifylab humanizer",
    "humanify lab",
    "humanifylab.com",
    "humanizer",
    "AI humanizer",
    "humanize AI text",
    "humanify ai text",
    "humanify chatgpt",
    "AI text humanizer",
    "natural writing",
    "professional writing",
    "free ai humanizer",
    "text humanizer",
    "humanize text",
    "ai to human text",
    "writing enhancement"
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
    title: "HumanifyLab - #1 AI Humanizer | Humanify AI Text Instantly",
    description: "The most advanced AI humanizer. Transform AI text into natural, professional human writing. Trusted by 450,000+ users worldwide.",
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
    title: "HumanifyLab - #1 AI Humanizer | Humanify AI Text Instantly",
    description: "The most advanced AI humanizer. Transform AI text into natural, professional human writing. Trusted by 450,000+ users. Try free!",
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