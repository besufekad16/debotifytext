import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Responsible Use - DebotifyText",
  description: "Learn how to use DebotifyText responsibly and ethically. Understand our guidelines for academic integrity and ethical content creation.",
  keywords: [
    "ai humanizer",
    "responsible AI use",
    "academic integrity",
    "ethical writing",
    "DebotifyText guidelines",
    "AI ethics",
    "content creation ethics",
    "academic honesty",
  ],
  alternates: {
    canonical: "https://www.debotifytext.com/responsible-use",
  },
  openGraph: {
    title: "Responsible Use - DebotifyText | AI Humanizer",
    description: "Learn how to use DebotifyText responsibly and ethically.",
    url: "https://www.debotifytext.com/responsible-use",
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
    title: "Responsible Use - DebotifyText",
    description: "Learn how to use DebotifyText responsibly and ethically.",
    images: ["/forOpenGraph.png"],
  },
};

export default function ResponsibleUseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

