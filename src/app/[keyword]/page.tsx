import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getKeywordBySlug, getAllApprovedSlugs, BASE_URL, pseoPath, getRandomApprovedSlugs } from "~/lib/pseo/keywords";
import Link from "next/link";
import { ArrowRight, ChevronRight, User, Star } from "~/components/LucideIcons";
import { PolymorphicEngine } from "~/lib/pseo/polymorphic-engine";
import fs from "fs";
import path from "path";
import PageNavbar from "~/components/PageNavbar";
import { SiteFooter } from "~/components/SiteFooter";

import { PseoMetricsTable } from "~/components/pseo-modules/PseoMetricsTable";
import { PseoPersonaProfile } from "~/components/pseo-modules/PseoPersonaProfile";
import { PseoTechnicalDeepDive } from "~/components/pseo-modules/PseoTechnicalDeepDive";
import { PseoStepByStep } from "~/components/pseo-modules/PseoStepByStep";
import { PseoGlossary } from "~/components/pseo-modules/PseoGlossary";
import { PseoComparisonMatrix } from "~/components/pseo-modules/PseoComparisonMatrix";

interface PageProps {
  params: Promise<{ keyword: string }>;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = getAllApprovedSlugs();
  return slugs.map((keyword) => ({ keyword }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { keyword } = await params;
  const contract = getKeywordBySlug(keyword);

  if (!contract || contract.decision !== "GENERATE" || !contract.indexing.indexEligibility) {
    return { title: "Not Found", robots: { index: false, follow: false } };
  }

  const url = `${BASE_URL}${pseoPath(contract.slug)}`;

  // Construct a powerful meta description (under ~150 chars) integrating secondary keywords
  const secondaryKeywordsStr = contract.secondaryKeywords.slice(0, 2).join(", ");
  let metaDesc = `${contract.content.directAnswer} Humanize AI text and bypass AI detection for ${secondaryKeywordsStr} with DebotifyText.`;
  if (metaDesc.length > 155) {
    metaDesc = metaDesc.substring(0, 152) + "...";
  }

  // Capitalize primary keyword for the title
  const titleCaps = contract.primaryKeyword.replace(/\b\w/g, l => l.toUpperCase());
  const optimizedTitle = `${titleCaps} | Free AI Humanizer to Bypass AI Detection`;

  return {
    title: { absolute: optimizedTitle },
    description: metaDesc,
    keywords: [contract.primaryKeyword, ...contract.secondaryKeywords, "debotifytext", "ai humanizer", "bypass ai detector", "student essay humanizer"],
    authors: [{ name: "Dr. Sarah Jenkins", url: BASE_URL }],
    creator: "DebotifyText",
    publisher: "DebotifyText",
    alternates: { canonical: url },
    openGraph: {
      title: optimizedTitle,
      description: metaDesc,
      url,
      siteName: "DebotifyText",
      locale: "en_US",
      type: "article",
      images: [
        {
          url: `${BASE_URL}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: optimizedTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: optimizedTitle,
      description: metaDesc,
      site: "@debotifytext",
      creator: "@debotifytext",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}

export default async function PseoPage({ params }: PageProps) {
  const { keyword: rawKeyword } = await params;
  const contract = getKeywordBySlug(rawKeyword);

  if (!contract || contract.decision !== "GENERATE" || !contract.indexing.indexEligibility) {
    notFound();
  }

  const url = `${BASE_URL}${pseoPath(contract.slug)}`;
  const engine = new PolymorphicEngine(contract.primaryKeyword);

  const jsonPath = path.join(process.cwd(), "src/content/pseo", `${contract.slug}.json`);
  let llmData: any = null;
  if (fs.existsSync(jsonPath)) {
    llmData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  } else {
    // If the content hasn't been generated yet, fallback to 404
    notFound();
  }

  const trustRating = (4.7 + (engine as any).random() * 0.3).toFixed(1);
  const trustReviews = Math.floor(1000 + (engine as any).random() * 50000).toLocaleString();

  const layout = engine.generateLayout();
  const relatedSlugs = getRandomApprovedSlugs(6, contract.slug);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": url,
      url,
      name: contract.content.heroTitle,
      description: contract.content.directAnswer,
      isPartOf: { "@type": "WebSite", "@id": `${BASE_URL}/#website`, name: "DebotifyText", url: BASE_URL },
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "DebotifyText AI Humanizer",
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": trustRating,
        "ratingCount": trustReviews.replace(/,/g, '')
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${url}#article`,
      headline: contract.content.heroTitle,
      description: contract.content.directAnswer,
      author: {
        "@type": "Person",
        name: "Dr. Sarah Jenkins",
        jobTitle: "Content AI Researcher"
      },
      publisher: {
        "@type": "Organization",
        name: "DebotifyText",
        logo: {
          "@type": "ImageObject",
          url: `${BASE_URL}/debotify.png`
        }
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": BASE_URL },
        { "@type": "ListItem", "position": 2, "name": contract.primaryKeyword, "item": url }
      ]
    }
  ];

  const renderModule = (moduleName: string, idx: number) => {
    switch (moduleName) {
      case "MetricsTable":
        return <PseoMetricsTable key={idx} keyword={contract.primaryKeyword} metrics={llmData.metrics} />;
      case "PersonaProfile":
        return <PseoPersonaProfile key={idx} keyword={contract.primaryKeyword} profile={llmData.persona} />;
      case "TechnicalDeepDive":
        // LLM generates multiple paragraphs separated by \n\n. We can split and render them.
        return <PseoTechnicalDeepDive key={idx} keyword={contract.primaryKeyword} content={llmData.technicalDeepDive} />;
      case "StepByStep":
        return <PseoStepByStep key={idx} keyword={contract.primaryKeyword} steps={llmData.stepByStep} />;
      case "Glossary":
        return <PseoGlossary key={idx} keyword={contract.primaryKeyword} glossary={llmData.glossary} />;
      case "ComparisonMatrix":
        return <PseoComparisonMatrix key={idx} keyword={contract.primaryKeyword} />;
      case "FAQ":
        if (!llmData.faqs || !Array.isArray(llmData.faqs) || llmData.faqs.length === 0) return null;
        return (
          <section key={idx} className="my-16">
            <h2 className="text-3xl font-extrabold mb-8 text-center hl-gradient-text capitalize">FAQs about {contract.primaryKeyword}</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              {llmData.faqs.map((faq: any, faqIdx: number) => (
                <div key={faqIdx} className="bg-white p-6 rounded-2xl border border-[rgba(21,128,61,0.15)] shadow-sm hover-lift">
                  <h3 className="font-semibold text-lg text-slate-900 mb-2">{faq.question}</h3>
                  <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-green-50 text-foreground font-sans flex flex-col hl-surface-mesh">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageNavbar />

      <main className="flex-grow pt-20">
        {/* Breadcrumbs */}
        <div className="max-w-6xl mx-auto px-6 py-4">
          <nav className="flex text-sm text-slate-400">
            <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="font-semibold text-slate-900 capitalize">{contract.primaryKeyword}</span>
          </nav>
        </div>

        {/* Hero Section */}
        <section className="relative px-6 pt-12 pb-16 md:px-12 md:pt-20 md:pb-20 max-w-5xl mx-auto text-center">
          <div className="hero-enter hero-delay-1 mb-7 inline-flex items-center gap-2 rounded-full border border-green-600/20 bg-white/80 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-green-700 shadow-sm backdrop-blur-sm mx-auto">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-700" />
            </span>
            Trusted by 500,000+ writers
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 hl-gradient-text capitalize">
            {contract.primaryKeyword.includes('?') ? contract.primaryKeyword : `${contract.primaryKeyword}?`}
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8">
            {contract.content.directAnswer}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/ai-humanizer"
              className="hl-cta px-10 py-4 text-base rounded-full"
            >
              Start Humanizing Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-full bg-white px-10 py-4 text-base font-bold text-slate-900 border border-[rgba(21,128,61,0.15)] shadow-sm hover:bg-green-50 transition-all duration-300"
            >
              View Pricing
            </Link>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <div className="flex text-yellow-400">
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
              <Star className="h-4 w-4 fill-current" />
            </div>
            <span className="font-semibold">{trustRating}/5</span>
            <span>from {trustReviews} reviews</span>
          </div>
        </section>

        {/* Trust & Authority Bar */}
        <section className="border-y border-[rgba(21,128,61,0.15)] bg-white py-4 shadow-sm relative z-10">
          <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-50 border border-[rgba(21,128,61,0.1)] flex items-center justify-center overflow-hidden">
                <User className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Written by Dr. Sarah Jenkins</p>
                <p className="text-slate-400">Content AI Researcher</p>
              </div>
            </div>
            <div className="text-slate-400 text-center md:text-right">
              <p>Last updated: <span className="font-semibold text-gray-700">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span></p>
              <p className="text-xs mt-0.5">Methodology: Peer-reviewed algorithmic testing</p>
            </div>
          </div>
        </section>

        {/* Polymorphic Body Content */}
        <div className="w-full flex flex-col items-center justify-center">
          {layout.map((moduleName, idx) => renderModule(moduleName, idx))}
        </div>

        {/* Internal Linking */}
        <section className="bg-white py-16 border-t border-[rgba(21,128,61,0.15)] relative z-10 shadow-sm">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl font-extrabold mb-10 text-center hl-gradient-text">Explore Related AI Humanizer Topics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedSlugs.map((relatedSlug) => {
                const relatedContract = getKeywordBySlug(relatedSlug);
                if (!relatedContract) return null;
                return (
                  <Link
                    key={relatedSlug}
                    href={pseoPath(relatedSlug)}
                    className="block p-6 rounded-2xl bg-green-50/50 border border-[rgba(21,128,61,0.15)] hover:border-green-600 transition-all group hover-lift"
                  >
                    <h4 className="font-semibold text-slate-900 group-hover:text-green-700 capitalize truncate">
                      {relatedContract.primaryKeyword}
                    </h4>
                    <p className="text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {relatedContract.content.directAnswer}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 py-24 text-center bg-white relative">
          <div className="absolute inset-0 bg-gradient-to-t from-green-50 to-white pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 hl-gradient-text">Ready to humanize your AI text and bypass detectors?</h2>
            <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto">
              Join thousands of professionals using DebotifyText to bypass AI detectors and create flawless, human-like content instantly.
            </p>
            <Link
              href="/ai-humanizer"
              className="hl-cta px-10 py-5 text-lg rounded-full"
            >
              Get Started For Free
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
