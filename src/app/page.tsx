import { type Metadata } from "next";
import UnifiedHomePage from "./UnifiedHomePage";

export const metadata: Metadata = {
  title: "HumanifyLab - Professional AI Content Humanization Platform",
  description: "Transform AI-generated content into authentic, human-quality writing with HumanifyLab. Enterprise-grade humanization technology trusted by professionals worldwide.",
  keywords: [
    "HumanifyLab",
    "humanifylab.com",
    "AI text humanizer",
    "humanize AI text",
    "AI detection bypass",
    "text paraphrasing",
    "natural writing",
    "AI content",
    "human-like text",
    "content creation",
    "writing tool",
    "AI writing assistant"
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
    title: "HumanifyLab - Professional AI Content Humanization Platform",
    description: "Transform AI-generated content into authentic, human-quality writing. Enterprise-grade humanization technology trusted by professionals.",
    url: "https://www.humanifylab.com",
    siteName: "HumanifyLab",
    images: [
      {
        url: "/forOpengraph.png",
        width: 1200,
        height: 630,
        alt: "HumanifyLab OpenGraph Image"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HumanifyLab - Professional AI Content Humanization Platform",
    description: "Professional AI content humanization platform. Transform AI text into authentic, human-quality writing with enterprise-grade technology.",
    images: ["/forOpengraph.png"],
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
            "description": "AI Text Humanizer - Transform AI-generated text into natural, human-like writing that passes detection tests.",
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
              "AI Detection Bypass",
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