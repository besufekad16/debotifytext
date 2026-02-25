import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SEOPageLayout from "~/components/SEOPageLayout";
import { getKeywordBySlug, generateSlug } from "~/lib/pseo-keywords";
import { generateSEOContent } from "~/lib/pseo-content";

interface PageProps {
  params: Promise<{ keyword: string }>;
}

// PROFESSIONAL ISR STRATEGY: Pre-generate high-priority pages, generate others on-demand
// This prevents Vercel's 75MB function size limit while maintaining SEO benefits
export const dynamicParams = true; // Allow on-demand generation for non-prerendered pages
export const revalidate = 86400; // Revalidate pages every 24 hours (ISR)

// Generate static params for HIGH-PRIORITY keywords only at build time
// Other pages will be generated on-demand when first visited (ISR)
export async function generateStaticParams() {
  // For initial deployment, pre-generate only a small set of pages
  // This ensures the build completes successfully
  // You can increase this number after the first successful deployment
  
  const priorityKeywords = [
    'ai-humanizer',
    'humanize-ai-text',
    'free-ai-humanizer',
    'chatgpt-humanizer',
    'ai-text-humanizer',
  ];

  console.log(`🚀 Pre-generating ${priorityKeywords.length} high-priority pages at build time`);
  console.log(`📊 All other pages will be generated on-demand (ISR)`);

  // Return only priority keywords for build-time generation
  return priorityKeywords.map((keyword) => ({
    keyword: keyword,
  }));
}

// Generate metadata for each page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { keyword } = await params;
  const keywordData = getKeywordBySlug(keyword);

  if (!keywordData) {
    return {
      title: "Page Not Found",
    };
  }

  const content = generateSEOContent(keywordData);
  const url = `https://www.humanifylab.com/${keyword}`;
  
  // Create more SEO-friendly title
  const seoTitle = content.title.length > 60 
    ? `${keywordData.keyword} - Free AI Humanizer | HumanifyLab`
    : content.title;

  return {
    title: seoTitle,
    description: content.description,
    keywords: [
      keywordData.keyword, 
      'ai humanizer', 
      'ai detection bypass', 
      'undetectable ai', 
      'humanize ai text',
      'bypass turnitin',
      'bypass gptzero',
      'free ai humanizer',
      'ai text converter',
      'make ai undetectable'
    ],
    authors: [{ name: 'HumanifyLab' }],
    creator: 'HumanifyLab',
    publisher: 'HumanifyLab',
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: seoTitle,
      description: content.description,
      url: url,
      siteName: 'HumanifyLab',
      locale: 'en_US',
      type: 'article',
      images: [
        {
          url: 'https://www.humanifylab.com/forOpenGraph.png',
          width: 1200,
          height: 630,
          alt: `${keywordData.keyword} - HumanifyLab`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: content.description,
      images: ['https://www.humanifylab.com/forOpenGraph.png'],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function SEOPage({ params }: PageProps) {
  const { keyword } = await params;
  const keywordData = getKeywordBySlug(keyword);

  if (!keywordData) {
    notFound();
  }

  const content = generateSEOContent(keywordData);

  // Generate JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      // Article Schema
      {
        '@type': 'Article',
        headline: content.h1,
        description: content.description,
        author: {
          '@type': 'Organization',
          name: 'HumanifyLab',
          url: 'https://www.humanifylab.com',
        },
        publisher: {
          '@type': 'Organization',
          name: 'HumanifyLab',
          logo: {
            '@type': 'ImageObject',
            url: 'https://www.humanifylab.com/humanify.png',
          },
        },
        datePublished: '2025-01-27',
        dateModified: '2026-01-29',
      },
      // FAQPage Schema
      {
        '@type': 'FAQPage',
        mainEntity: content.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
      // SoftwareApplication Schema
      {
        '@type': 'SoftwareApplication',
        name: 'HumanifyLab',
        applicationCategory: 'BusinessApplication',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          ratingCount: '450000',
          bestRating: '5',
          worstRating: '1',
        },
      },
      // BreadcrumbList Schema
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.humanifylab.com',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: keywordData.keyword,
            item: `https://www.humanifylab.com/${keyword}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SEOPageLayout content={content} keyword={keywordData.keyword} />
    </>
  );
}
