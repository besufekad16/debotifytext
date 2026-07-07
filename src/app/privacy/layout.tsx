import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - HumanifyLab",
  description: "Read the official Privacy Policy for HumanifyLab. Understand how we collect, use, and protect your personal information and data.",
  keywords: [
    "ai humanizer",
    "AI detection bypass",
    "humanize AI text",
    "humanizer",
    "HumanifyLab privacy",
    "privacy policy",
    "data protection",
    "user data",
    "information security",
    "free AI humanizer"
  ],
  alternates: {
    canonical: "https://www.humanifylab.com/privacy",
  },
  openGraph: {
    title: "Privacy Policy - HumanifyLab | AI Humanizer",
    description: "Learn how HumanifyLab protects your privacy and handles your data.",
    url: "https://www.humanifylab.com/privacy",
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
    title: "Privacy Policy - HumanifyLab",
    description: "Read the privacy policy for HumanifyLab.",
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
