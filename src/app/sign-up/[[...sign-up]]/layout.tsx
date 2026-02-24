import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up - HumanifyLab",
  description: "Create your free account to access HumanifyLab's AI humanizer. Transform AI-generated text into natural, human-like writing. Start humanizing your content today.",
  keywords: [
    "ai humanizer",
    "humanizer",
    "sign up",
    "create account",
    "AI text humanizer",
    "humanize AI text",
    "text humanization tool",
    "AI detection bypass",
    "natural writing",
    "content creation"
  ],
  openGraph: {
    title: "Sign Up - HumanifyLab",
    description: "Join HumanifyLab to transform AI-generated text into natural, human-like writing.",
    url: "https://www.humanifylab.com/sign-up",
    siteName: "HumanifyLab",
    images: [
      {
        url: "/forOpengraph.png",
        width: 1200,
        height: 630,
        alt: "HumanifyLab OpenGraph Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign Up - HumanifyLab | AI Humanizer",
    description: "Create your account to access advanced AI text humanization.",
    images: ["/forOpengraph.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://humanifylab.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Sign Up",
        "item": "https://www.humanifylab.com/sign-up"
      }
    ]
  };

  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
