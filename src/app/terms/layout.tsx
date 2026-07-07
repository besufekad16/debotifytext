import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - HumanifyLab",
  description: "Read the official Terms of Service for HumanifyLab. Understand our terms, conditions, and guidelines for using our AI humanizer service.",
  keywords: [
    "ai humanizer",
    "AI detection bypass",
    "humanize AI text",
    "humanizer",
    "HumanifyLab terms",
    "terms of service",
    "terms and conditions",
    "user agreement",
    "service terms",
    "free AI humanizer"
  ],
  alternates: {
    canonical: "https://www.humanifylab.com/terms",
  },
  openGraph: {
    title: "Terms of Service - HumanifyLab | AI Humanizer",
    description: "Read the terms of service for HumanifyLab AI humanizer.",
    url: "https://www.humanifylab.com/terms",
    siteName: "HumanifyLab",
    images: [
      {
        url: "/forOpenGraph.png",
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
    title: "Terms of Service - HumanifyLab",
    description: "Read the terms of service for HumanifyLab.",
    images: ["/forOpenGraph.png"],
  },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
