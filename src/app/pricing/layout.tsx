// Metadata for /pricing lives in page.tsx — this layout only injects structured data.
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
