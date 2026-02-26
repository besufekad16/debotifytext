import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - HumanifyLab",
  description: "Choose your AI humanizer plan. Affordable pricing to enhance your content naturally with professional writing quality using HumanifyLab.",
  keywords: [
    "ai humanizer",
    "humanizer",
    "AI humanizer pricing",
    "humanizer plans",
    "text humanization pricing",
    "AI text humanizer cost",
    "humanize AI text plans",
    "writing quality enhancement",
    "content humanization credits",
    "subscription plans",
    "professional writing"
  ],
    openGraph: {
      title: "Pricing - HumanifyLab | AI Humanizer Plans & Credits",
      description: "Choose your AI humanizer plan. Affordable pricing to enhance your content naturally with professional writing quality.",
      url: "https://www.humanifylab.com/pricing",
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
    title: "Pricing - HumanifyLab | AI Humanizer Plans & Credits",
    description: "Choose your AI humanizer plan. Affordable pricing to enhance content naturally with professional quality.",
    images: ["/forOpengraph.png"],
    site: "@humanifylab",
    creator: "@humanifylab",
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

export default function PricingLayout({
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
        "item": "https://www.humanifylab.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Pricing",
        "item": "https://www.humanifylab.com/pricing"
      }
    ]
  };

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "HumanifyLab AI Humanizer",
    "description": "Transform AI-generated text into natural, human-like writing with flexible pricing plans.",
    "brand": {
      "@type": "Brand",
      "name": "HumanifyLab"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "5.99",
      "highPrice": "19.99",
      "offerCount": "3",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <>
      {children}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
    </>
  );
}
