import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - DebotifyText",
  description: "Read the official Terms of Service for DebotifyText. Understand our terms, conditions, and guidelines for using our AI humanizer service.",
  keywords: [
    "ai humanizer",
    "AI detection bypass",
    "humanize AI text",
    "humanizer",
    "DebotifyText terms",
    "terms of service",
    "terms and conditions",
    "user agreement",
    "service terms",
    "free AI humanizer"
  ],
  alternates: {
    canonical: "https://www.debotifytext.com/terms",
  },
  openGraph: {
    title: "Terms of Service - DebotifyText | AI Humanizer",
    description: "Read the terms of service for DebotifyText AI humanizer.",
    url: "https://www.debotifytext.com/terms",
    siteName: "DebotifyText",
    images: [
      {
        url: "/forOpenGraph.png",
        width: 1200,
        height: 630,
        alt: "DebotifyText OpenGraph Image"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service - DebotifyText",
    description: "Read the terms of service for DebotifyText.",
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
