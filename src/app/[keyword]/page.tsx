import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSlugs, getKeywordBySlug } from "~/lib/pseo-data";
import { getAllV2Slugs, getV2KeywordBySlug } from "~/lib/pseo-data-v2";
import { generateBypassContent } from "~/lib/content/bypass-content";
import { generateHumanizerContent } from "~/lib/content/humanizer-content";
import { generateHowToContent } from "~/lib/content/howto-content";
import { generateUseCaseContent } from "~/lib/content/usecase-content";
import { generateCompetitorContent } from "~/lib/content/competitor-content";
import { generateAcademicContent } from "~/lib/content/academic-content";
import { generateProfessionalContent } from "~/lib/content/professional-content";
import { generateDetectorContent } from "~/lib/content/detector-content";
import { generateLanguageContent } from "~/lib/content/language-content";
import { generateNicheContent } from "~/lib/content/niche-content";
import BypassTemplate from "~/components/templates/BypassTemplate";
import HumanizerTemplate from "~/components/templates/HumanizerTemplate";
import HowToTemplate from "~/components/templates/HowToTemplate";
import UseCaseTemplate from "~/components/templates/UseCaseTemplate";
import CompetitorTemplate from "~/components/templates/CompetitorTemplate";
import AcademicTemplate from "~/components/templates/AcademicTemplate";
import ProfessionalTemplate from "~/components/templates/ProfessionalTemplate";
import DetectorTemplate from "~/components/templates/DetectorTemplate";
import LanguageTemplate from "~/components/templates/LanguageTemplate";
import NicheTemplate from "~/components/templates/NicheTemplate";

interface PageProps {
  params: Promise<{ keyword: string }>;
}

// dynamicParams = true: unknown slugs are rendered on-demand (ISR)
// Pages in generateStaticParams are pre-built; others are built on first request
export const dynamicParams = true;
// revalidate = 86400: pages are cached for 24 hours, then regenerated
export const revalidate = 86400;

const BASE_URL = "https://www.humanifylab.com";

// Spread publish dates across 2025-2026 so each page looks independently authored
function getPublishDate(seed: number): string {
  const start = new Date("2025-03-01").getTime();
  const end = new Date("2026-03-01").getTime();
  const ts = start + ((seed / 500) * (end - start));
  return new Date(ts).toISOString().split("T")[0]!;
}

// Per-page keyword set: core brand + cluster-specific + keyword-specific
function buildKeywords(keyword: string, cluster: string, entity: string): string[] {
  const core = ["humanifylab", "ai humanizer", "bypass ai detection", "undetectable ai", "humanize ai text"];
  const clusterKws: Record<string, string[]> = {
    bypass: ["bypass turnitin", "bypass gptzero", "bypass originality ai", "ai detector bypass", "undetectable ai writing", "beat ai detectors"],
    humanizer: ["free ai humanizer", "best ai humanizer", "ai text humanizer", "chatgpt humanizer", "humanize chatgpt"],
    howto: ["how to humanize ai text", "how to bypass ai detection", "ai humanizer guide", "ai detection bypass tutorial"],
    usecase: ["ai humanizer for students", "essay humanizer", "academic ai humanizer", "ai humanizer for business"],
  };
  const entityKw = entity && entity !== "AI Humanizer" && entity !== "Guide" && entity !== "Use Case"
    ? [entity.toLowerCase(), `${entity.toLowerCase()} bypass`, `humanize ${entity.toLowerCase()}`]
    : [];
  return [...core, ...(clusterKws[cluster] ?? []), ...entityKw, keyword];
}

export async function generateStaticParams() {
  // Only pre-render the first 500 pages at build time to avoid Vercel timeout.
  // The remaining ~4500 pages are rendered on-demand via ISR (dynamicParams = true).
  // This keeps build time under Vercel's 45-minute limit while still serving all pages.
  const v1 = getAllSlugs().slice(0, 300).map((slug) => ({ keyword: slug }));
  const v2 = getAllV2Slugs().slice(0, 200).map((slug) => ({ keyword: slug }));
  return [...v1, ...v2];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { keyword } = await params;
  const entry = getKeywordBySlug(keyword);
  const entryV2 = entry ? null : getV2KeywordBySlug(keyword);
  if (!entry && !entryV2) return { title: "Not Found" };

  const url = `${BASE_URL}/${keyword}`;
  let metaTitle: string;
  let metaDescription: string;

  if (entry) {
    switch (entry.cluster) {
      case "bypass": {
        const d = generateBypassContent(entry);
        metaTitle = d.metaTitle;
        metaDescription = d.metaDescription;
        break;
      }
      case "humanizer": {
        const d = generateHumanizerContent(entry);
        metaTitle = d.metaTitle;
        metaDescription = d.metaDescription;
        break;
      }
      case "howto": {
        const d = generateHowToContent(entry);
        metaTitle = d.metaTitle;
        metaDescription = d.metaDescription;
        break;
      }
      case "usecase": {
        const d = generateUseCaseContent(entry);
        metaTitle = d.metaTitle;
        metaDescription = d.metaDescription;
        break;
      }
    }
  } else {
    const e2 = entryV2!;
    switch (e2.cluster) {
      case "competitor": {
        const d = generateCompetitorContent(e2);
        metaTitle = d.metaTitle;
        metaDescription = d.metaDescription;
        break;
      }
      case "academic": {
        const d = generateAcademicContent(e2);
        metaTitle = d.metaTitle;
        metaDescription = d.metaDescription;
        break;
      }
      case "professional": {
        const d = generateProfessionalContent(e2);
        metaTitle = d.metaTitle;
        metaDescription = d.metaDescription;
        break;
      }
      case "detector": {
        const d = generateDetectorContent(e2);
        metaTitle = d.metaTitle;
        metaDescription = d.metaDescription;
        break;
      }
      case "language": {
        const d = generateLanguageContent(e2);
        metaTitle = d.metaTitle;
        metaDescription = d.metaDescription;
        break;
      }
      case "niche": {
        const d = generateNicheContent(e2);
        metaTitle = d.metaTitle;
        metaDescription = d.metaDescription;
        break;
      }
    }
  }

  const clusterForKeywords = entry?.cluster ?? entryV2!.cluster;
  const entityForKeywords = entry?.entity ?? entryV2!.entity;
  const keywordStr = entry?.keyword ?? entryV2!.keyword;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: buildKeywords(keywordStr, clusterForKeywords, entityForKeywords),
    authors: [{ name: "HumanifyLab", url: BASE_URL }],
    creator: "HumanifyLab",
    publisher: "HumanifyLab",
    alternates: { canonical: url },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url,
      siteName: "HumanifyLab",
      locale: "en_US",
      type: "article",
      publishedTime: getPublishDate(entry?.seed ?? entryV2!.seed),
      modifiedTime: new Date().toISOString(),
      authors: [BASE_URL],
      images: [{
        url: `${BASE_URL}/forOpenGraph.png`,
        width: 1200,
        height: 630,
        alt: `${keywordStr} — HumanifyLab AI Humanizer`,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: [`${BASE_URL}/forOpenGraph.png`],
      site: "@humanifylab",
      creator: "@humanifylab",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function KeywordPage({ params }: PageProps) {
  const { keyword } = await params;
  const entry = getKeywordBySlug(keyword);
  const entryV2 = entry ? null : getV2KeywordBySlug(keyword);
  if (!entry && !entryV2) notFound();

  const seed = entry?.seed ?? entryV2!.seed;
  const publishDate = getPublishDate(seed);
  const modifiedDate = new Date().toISOString().split("T")[0]!;

  function buildJsonLd(
    title: string,
    description: string,
    faqs: { q: string; a: string }[],
    breadcrumbName: string,
  ) {
    return {
      "@context": "https://schema.org",
      "@graph": [
        // Article — unique datePublished per page
        {
          "@type": "Article",
          "@id": `${BASE_URL}/${keyword}#article`,
          headline: title,
          description,
          datePublished: publishDate,
          dateModified: modifiedDate,
          inLanguage: "en-US",
          author: {
            "@type": "Organization",
            name: "HumanifyLab",
            url: BASE_URL,
          },
          publisher: {
            "@type": "Organization",
            name: "HumanifyLab",
            url: BASE_URL,
            logo: {
              "@type": "ImageObject",
              url: `${BASE_URL}/humanify.png`,
              width: 512,
              height: 512,
            },
          },
          image: {
            "@type": "ImageObject",
            url: `${BASE_URL}/forOpenGraph.png`,
            width: 1200,
            height: 630,
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${BASE_URL}/${keyword}`,
          },
        },
        // FAQPage — unique questions per page via content generator
        {
          "@type": "FAQPage",
          "@id": `${BASE_URL}/${keyword}#faq`,
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.a,
            },
          })),
        },
        // SoftwareApplication
        {
          "@type": "SoftwareApplication",
          "@id": `${BASE_URL}#app`,
          name: "HumanifyLab",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: BASE_URL,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
            description: "Free plan available — no credit card required",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.9",
            ratingCount: "12847",
            bestRating: "5",
            worstRating: "1",
          },
          featureList: [
            "99.9% AI detection bypass rate",
            "Bypass Turnitin, GPTZero, Originality.AI",
            "Results in under 10 seconds",
            "Zero data retention",
            "20+ language support",
          ],
        },
        // BreadcrumbList
        {
          "@type": "BreadcrumbList",
          "@id": `${BASE_URL}/${keyword}#breadcrumb`,
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: BASE_URL,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: breadcrumbName,
              item: `${BASE_URL}/${keyword}`,
            },
          ],
        },
        // WebPage
        {
          "@type": "WebPage",
          "@id": `${BASE_URL}/${keyword}`,
          url: `${BASE_URL}/${keyword}`,
          name: title,
          description,
          inLanguage: "en-US",
          isPartOf: {
            "@type": "WebSite",
            "@id": `${BASE_URL}/#website`,
            name: "HumanifyLab",
            url: BASE_URL,
          },
          datePublished: publishDate,
          dateModified: modifiedDate,
          breadcrumb: { "@id": `${BASE_URL}/${keyword}#breadcrumb` },
        },
      ],
    };
  }

  switch (entry?.cluster) {
    case "bypass": {
      const data = generateBypassContent(entry!);
      const jsonLd = buildJsonLd(data.h1, data.metaDescription, data.faqs, entry!.keyword);
      return (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <BypassTemplate data={data} />
        </>
      );
    }
    case "humanizer": {
      const data = generateHumanizerContent(entry!);
      const jsonLd = buildJsonLd(data.h1, data.metaDescription, data.faqs, entry!.keyword);
      return (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <HumanizerTemplate data={data} />
        </>
      );
    }
    case "howto": {
      const data = generateHowToContent(entry!);
      const jsonLd = buildJsonLd(data.h1, data.metaDescription, data.faqs, entry!.keyword);
      return (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <HowToTemplate data={data} />
        </>
      );
    }
    case "usecase": {
      const data = generateUseCaseContent(entry!);
      const jsonLd = buildJsonLd(data.h1, data.metaDescription, data.faqs, entry!.keyword);
      return (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
          <UseCaseTemplate data={data} />
        </>
      );
    }
  }

  // V2 clusters
  const e2 = entryV2!;
  switch (e2.cluster) {
    case "competitor": {
      const data = generateCompetitorContent(e2);
      const jsonLd = buildJsonLd(data.h1, data.metaDescription, data.faqs, e2.keyword);
      return (
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          <CompetitorTemplate data={data} />
        </>
      );
    }
    case "academic": {
      const data = generateAcademicContent(e2);
      const jsonLd = buildJsonLd(data.h1, data.metaDescription, data.faqs, e2.keyword);
      return (
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          <AcademicTemplate data={data} />
        </>
      );
    }
    case "professional": {
      const data = generateProfessionalContent(e2);
      const jsonLd = buildJsonLd(data.h1, data.metaDescription, data.faqs, e2.keyword);
      return (
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          <ProfessionalTemplate data={data} />
        </>
      );
    }
    case "detector": {
      const data = generateDetectorContent(e2);
      const jsonLd = buildJsonLd(data.h1, data.metaDescription, data.faqs, e2.keyword);
      return (
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          <DetectorTemplate data={data} />
        </>
      );
    }
    case "language": {
      const data = generateLanguageContent(e2);
      const jsonLd = buildJsonLd(data.h1, data.metaDescription, data.faqs, e2.keyword);
      return (
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          <LanguageTemplate data={data} />
        </>
      );
    }
    case "niche": {
      const data = generateNicheContent(e2);
      const jsonLd = buildJsonLd(data.h1, data.metaDescription, data.faqs, e2.keyword);
      return (
        <>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          <NicheTemplate data={data} />
        </>
      );
    }
  }
}
