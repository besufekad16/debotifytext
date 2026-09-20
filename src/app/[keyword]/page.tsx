import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import SEOPageWrapper from "~/components/templates/SEOPageWrapper";
import PseoGuide from "~/components/templates/PseoGuide";
import PseoGuideListicle from "~/components/templates/PseoGuideListicle";
import PseoGuideQnA from "~/components/templates/PseoGuideQnA";
import {
  BASE_URL,
  TARGET_TOTAL,
  buildPseoContent,
  getKeywordBySlug,
  getAllSlugs,
  getPrioritySlugs,
  modifiedDate,
  publishDate,
  CLUSTER_META,
  pseoPath,
} from "~/lib/pseo";

interface PageProps {
  params: Promise<{ keyword: string }>;
}

export const dynamic = "force-static";
export const dynamicParams = true;

const loadPage = cache((slug: string) => {
  const entry = getKeywordBySlug(slug);
  if (!entry) return null;
  const data = buildPseoContent(entry);
  const published = publishDate(entry.seed);
  return { entry, data, published, modified: modifiedDate(entry.seed, published) };
});

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  if (slugs.length !== TARGET_TOTAL) {
    throw new Error(`PSEO generateStaticParams expected ${TARGET_TOTAL} slugs, got ${slugs.length}`);
  }
  if (process.env.NODE_ENV !== "production") {
    return getPrioritySlugs().map((keyword) => ({ keyword }));
  }
  return slugs.map((keyword) => ({ keyword }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { keyword } = await params;
  const page = loadPage(keyword);
  if (!page) return { title: "Not Found", robots: { index: false, follow: false } };

  const url = `${BASE_URL}${pseoPath(keyword)}`;
  const { data, entry, published, modified } = page;

  return {
    title: { absolute: data.metaTitle },
    description: data.metaDescription,
    keywords: [entry.keyword, "humanifylab", "humanify", "humanify ai", "humanify text", "humanify ai text", "humanify lab", "ai humanizer", "humanize ai text", entry.entity],
    authors: [{ name: "HumanifyLab", url: BASE_URL }],
    creator: "HumanifyLab",
    publisher: "HumanifyLab",
    alternates: { canonical: url },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url,
      siteName: "HumanifyLab",
      locale: "en_US",
      type: "article",
      publishedTime: published,
      modifiedTime: modified,
      images: [{ url: `${BASE_URL}/forOpenGraph.png`, width: 1200, height: 630, alt: data.h1 }],
    },
    twitter: {
      card: "summary_large_image",
      title: data.metaTitle,
      description: data.metaDescription,
      images: [`${BASE_URL}/forOpenGraph.png`],
      site: "@humanifylab",
      creator: "@humanifylab",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}

export default async function KeywordPage({ params }: PageProps) {
  const { keyword } = await params;
  const page = loadPage(keyword);
  if (!page) notFound();

  const { entry, data, published, modified } = page;
  const url = `${BASE_URL}${pseoPath(keyword)}`;
  const clusterMeta = CLUSTER_META[entry.cluster];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: data.h1,
        description: data.metaDescription,
        datePublished: published,
        dateModified: modified,
        inLanguage: "en-US",
        author: { "@type": "Organization", name: "HumanifyLab", url: BASE_URL },
        publisher: {
          "@type": "Organization",
          name: "HumanifyLab",
          url: BASE_URL,
          logo: { "@type": "ImageObject", url: `${BASE_URL}/humanify.png`, width: 512, height: 512 },
        },
        image: { "@type": "ImageObject", url: `${BASE_URL}/forOpenGraph.png`, width: 1200, height: 630 },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: data.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      ...(entry.cluster === "guides"
        ? [{
            "@type": "HowTo",
            "@id": `${url}#howto`,
            name: data.h1,
            description: data.directAnswer,
            step: data.steps.map((s) => ({
              "@type": "HowToStep",
              position: Number(s.number),
              name: s.title,
              text: s.description,
            })),
          }]
        : []),
      {
        "@type": "SoftwareApplication",
        "@id": `${url}#app`,
        name: "HumanifyLab",
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        url: BASE_URL,
        description: data.directAnswer,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "Free plan available" },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Guides", item: `${BASE_URL}/topics` },
          { "@type": "ListItem", position: 3, name: clusterMeta.label, item: `${BASE_URL}/topics/${entry.cluster}` },
          { "@type": "ListItem", position: 4, name: data.h1, item: url },
        ],
      },
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: data.metaTitle,
        description: data.metaDescription,
        inLanguage: "en-US",
        datePublished: published,
        dateModified: modified,
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["#direct-answer", "h1"] },
        isPartOf: { "@type": "WebSite", "@id": `${BASE_URL}/#website`, name: "HumanifyLab", url: BASE_URL },
        breadcrumb: { "@id": `${url}#breadcrumb` },
      },
    ],
  };

  const templateIndex = Math.abs(entry.seed) % 3;
  let Template = PseoGuide;
  if (templateIndex === 1) Template = PseoGuideListicle;
  if (templateIndex === 2) Template = PseoGuideQnA;

  return (
    <SEOPageWrapper keyword={entry.keyword} cluster={entry.cluster} publishDate={published} updatedDate={modified} readTime={data.readTime}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Template entry={entry} data={data} />
    </SEOPageWrapper>
  );
}
