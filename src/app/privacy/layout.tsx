import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - DebotifyText",
  description: "Read the official Privacy Policy for DebotifyText. Understand how we collect, use, and protect your personal information and data.",
  keywords: [
    "ai humanizer",
    "AI detection bypass",
    "humanize AI text",
    "humanizer",
    "DebotifyText privacy",
    "privacy policy",
    "data protection",
    "user data",
    "information security",
    "free AI humanizer"
  ],
  alternates: {
    canonical: "https://www.debotifytext.com/privacy",
  },
  openGraph: {
    title: "Privacy Policy - DebotifyText | AI Humanizer",
    description: "Learn how DebotifyText protects your privacy and handles your data.",
    url: "https://www.debotifytext.com/privacy",
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
    title: "Privacy Policy - DebotifyText",
    description: "Read the privacy policy for DebotifyText.",
    images: ["/forOpenGraph.png"],
  },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
