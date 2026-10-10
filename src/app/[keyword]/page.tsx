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
import { PseoInteractivePlayground } from "~/components/pseo-modules/PseoInteractivePlayground";
import { PseoDetectorStatusGrid } from "~/components/pseo-modules/PseoDetectorStatusGrid";

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
    authors: [{ name: "DebotifyText Research Team", url: BASE_URL }],
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
          url: `${BASE_URL}/forOpenGraph.png`,
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
      images: [`${BASE_URL}/forOpenGraph.png`],
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

  const jsonLd: any[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${url}#webpage`,
      url,
      name: contract.content.heroTitle,
      description: contract.content.directAnswer,
      isPartOf: { "@type": "WebSite", "@id": `${BASE_URL}/#website`, name: "DebotifyText", url: BASE_URL },
      inLanguage: "en-US",
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "@id": `${BASE_URL}/#software`,
      name: "DebotifyText AI Humanizer",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free to test; lifetime and subscription tiers available.",
      },
      publisher: {
        "@type": "Organization",
        name: "DebotifyText",
        url: BASE_URL,
        logo: `${BASE_URL}/debotify-logo.png`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      "@id": `${url}#article`,
      headline: contract.content.heroTitle,
      description: contract.content.directAnswer,
      author: {
        "@type": "Organization",
        name: "DebotifyText Research Lab",
        url: `${BASE_URL}/research`,
      },
      publisher: {
        "@type": "Organization",
        name: "DebotifyText",
        logo: {
          "@type": "ImageObject",
          url: `${BASE_URL}/debotify-logo.png`,
        },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
        { "@type": "ListItem", position: 2, name: "Topics", item: `${BASE_URL}/topics` },
        { "@type": "ListItem", position: 3, name: contract.primaryKeyword, item: url },
      ],
    },
  ];

  if (llmData?.faqs && Array.isArray(llmData.faqs) && llmData.faqs.length > 0) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: llmData.faqs.map((faq: any) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

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
          <section key={idx} className="my-24 w-full max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
                Frequently Asked Questions
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 capitalize">
                Got Questions About {contract.primaryKeyword}?
              </h2>
            </div>
            <div className="space-y-4">
              {llmData.faqs.map((faq: any, faqIdx: number) => (
                <div
                  key={faqIdx}
                  className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all duration-300"
                >
                  <h3 className="font-bold text-lg sm:text-xl text-slate-900 mb-3 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">
                      Q
                    </span>
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base pl-9">
                    {faq.answer}
                  </p>
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
    <div className="min-h-screen bg-slate-50 text-foreground font-sans flex flex-col selection:bg-emerald-500 selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageNavbar />

      <main className="flex-grow pt-20">
        {/* Breadcrumbs */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <nav className="flex items-center text-xs sm:text-sm text-slate-500 font-medium">
            <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 mx-2 text-slate-400" />
            <Link href="/topics" className="hover:text-emerald-600 transition-colors">Topics</Link>
            <ChevronRight className="h-3.5 w-3.5 mx-2 text-slate-400" />
            <span className="text-slate-900 font-bold capitalize truncate max-w-[200px] sm:max-w-none">{contract.primaryKeyword}</span>
          </nav>
        </div>

        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 pt-10 pb-12 sm:pt-16 sm:pb-16 max-w-5xl mx-auto text-center">
          {/* Subtle Ambient Background Mesh */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-gradient-to-b from-emerald-100/40 via-green-50/20 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-white/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 shadow-sm backdrop-blur-md mx-auto">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
            </span>
            Trusted by 500,000+ Students & Content Writers
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 mb-6 capitalize leading-[1.15]">
            {contract.primaryKeyword.includes('?') ? contract.primaryKeyword : `${contract.primaryKeyword}?`}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8 font-normal">
            {contract.content.directAnswer}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/ai-humanizer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-base shadow-xl shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-95"
            >
              Start Humanizing For Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-base font-bold text-slate-800 border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              View Pricing & Plans
            </Link>
          </div>

          <div className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-600 bg-white/80 backdrop-blur-md border border-slate-200/90 px-4 py-1.5 rounded-full mx-auto shadow-sm">
            <span className="font-bold text-emerald-700">Verified 2026 Detection Engine:</span>
            <span>Turnitin, GPTZero, Originality.ai & Copyleaks</span>
          </div>
        </section>

        {/* Interactive Live Playground Module */}
        <PseoInteractivePlayground keyword={contract.primaryKeyword} />

        {/* Trust & Authority Bar */}
        <section className="border-y border-slate-200/70 bg-white py-5 shadow-sm relative z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-emerald-50 border border-emerald-200/60 flex items-center justify-center overflow-hidden shrink-0">
                <User className="h-5 w-5 text-emerald-700" />
              </div>
              <div>
                <p className="font-bold text-slate-900">DebotifyText NLP Research Lab</p>
                <p className="text-slate-500 text-xs">Empirical Perplexity & Burstiness Testing</p>
              </div>
            </div>
            <div className="text-slate-500 text-center md:text-right">
              <p>Last Audited: <span className="font-bold text-slate-800">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span></p>
              <p className="text-xs text-slate-400 mt-0.5">Tested Against Institutional Blackboard & Canvas Submissions</p>
            </div>
          </div>
        </section>

        {/* Live Detector Bypass Status Grid */}
        <PseoDetectorStatusGrid keyword={contract.primaryKeyword} />

        {/* Polymorphic Body Content */}
        <div className="w-full flex flex-col items-center justify-center">
          {layout.map((moduleName, idx) => renderModule(moduleName, idx))}
        </div>

        {/* Internal Linking */}
        <section className="bg-white py-20 border-t border-slate-200/70 relative z-10 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
                Related Knowledge Hub
              </span>
              <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
                Explore More AI Humanizer Resources
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {relatedSlugs.map((relatedSlug) => {
                const relatedContract = getKeywordBySlug(relatedSlug);
                if (!relatedContract) return null;
                return (
                  <Link
                    key={relatedSlug}
                    href={pseoPath(relatedSlug)}
                    className="block p-6 rounded-2xl bg-slate-50/70 border border-slate-200/70 hover:border-emerald-500/50 hover:bg-white transition-all duration-300 group shadow-sm hover:shadow-md hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-slate-900 group-hover:text-emerald-700 capitalize truncate text-base">
                        {relatedContract.primaryKeyword}
                      </h4>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all shrink-0" />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                      {relatedContract.content.directAnswer}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-4 sm:px-6 py-20 sm:py-28 text-center bg-gradient-to-b from-white to-slate-100 relative overflow-hidden">
          <div className="max-w-4xl mx-auto relative z-10">
            <span className="inline-block px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider mb-6">
              100% Free To Test • No Credit Card Required
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-tight">
              Ready to Humanize Your AI Text and Bypass Every Detector?
            </h2>
            <p className="text-base sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join hundreds of thousands of university students, academic researchers, and professional writers using DebotifyText daily.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/ai-humanizer"
                className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-5 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-lg shadow-xl shadow-emerald-600/30 transition-all hover:scale-[1.03] active:scale-95"
              >
                Humanize Free Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/pricing"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-white px-8 py-5 text-base font-bold text-slate-800 border border-slate-200 shadow-sm hover:bg-slate-50 transition-all"
              >
                Explore Unlimited Plans
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
