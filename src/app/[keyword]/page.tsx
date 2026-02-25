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
// 
// Note: Main pages (/, /pricing, /faq, /contact, /sign-in, /sign-up, /terms, /privacy)
// are separate routes and are automatically built by Next.js
export async function generateStaticParams() {
  try {
    // Load keywords from JSON file
    const fs = await import('fs');
    const path = await import('path');
    const keywordsPath = path.join(process.cwd(), 'public', 'data', 'keywords.json');
    
    // Check if file exists
    if (fs.existsSync(keywordsPath)) {
      const keywordsContent = fs.readFileSync(keywordsPath, 'utf-8');
      const keywords: string[] = JSON.parse(keywordsContent);
      
      // High-priority terms for filtering
      const highPriorityTerms = [
        'humanizer', 'ai', 'detector', 'bypass', 'undetectable', 'free',
        'chatgpt', 'turnitin', 'gptzero', 'essay', 'text', 'content',
        'writer', 'generator', 'tool', 'online', 'best', 'paraphrase',
        'rewrite', 'converter', 'check', 'remove', 'make', 'create'
      ];
      
      // Filter to high-priority keywords
      const priorityKeywords = keywords
        .filter(keyword => {
          const lower = keyword.toLowerCase();
          return highPriorityTerms.some(term => lower.includes(term));
        })
        .slice(0, 1000); // Limit to 1000 pages
      
      console.log(`🚀 Pre-generating ${priorityKeywords.length} high-priority keyword pages at build time`);
      console.log(`📊 Main pages (/, /pricing, /faq, /contact, /sign-in, /sign-up, /terms, /privacy) are built automatically`);
      console.log(`📊 Remaining ${keywords.length - priorityKeywords.length} keyword pages will be generated on-demand (ISR)`);
      
      return priorityKeywords.map((keyword) => ({
        keyword: generateSlug(keyword),
      }));
    }
  } catch (error) {
    console.error('⚠️  Failed to load keywords from JSON, using fallback:', error);
  }
  
  // Fallback to essential keywords if JSON loading fails
  const fallbackKeywords = [
    'ai-humanizer',
    'humanize-ai-text',
    'free-ai-humanizer',
    'chatgpt-humanizer',
  ];
  
  console.log(`🚀 Using fallback: Pre-generating ${fallbackKeywords.length} keyword pages`);
  
  return fallbackKeywords.map((keyword) => ({
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
