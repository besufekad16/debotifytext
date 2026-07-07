import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Responsible Use - HumanifyLab",
  description: "Learn how to use HumanifyLab responsibly and ethically. Understand our guidelines for academic integrity and ethical content creation.",
  keywords: [
    "ai humanizer",
    "responsible AI use",
    "academic integrity",
    "ethical writing",
    "HumanifyLab guidelines",
    "AI ethics",
    "content creation ethics",
    "academic honesty",
  ],
  alternates: {
    canonical: "https://www.humanifylab.com/responsible-use",
  },
  openGraph: {
    title: "Responsible Use - HumanifyLab | AI Humanizer",
    description: "Learn how to use HumanifyLab responsibly and ethically.",
    url: "https://www.humanifylab.com/responsible-use",
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
    title: "Responsible Use - HumanifyLab",
    description: "Learn how to use HumanifyLab responsibly and ethically.",
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

