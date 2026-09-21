import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getKeywordBySlug, getAllApprovedSlugs, BASE_URL, pseoPath } from "~/lib/pseo/keywords";
import Link from "next/link";
import { ArrowRight, CheckCircle, ShieldCheck, Zap } from "lucide-react";

interface PageProps {
  params: Promise<{ keyword: string }>;
}

export const dynamic = "force-static";
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = getAllApprovedSlugs();
  // Return all slugs to pre-render 40k pages at build time as requested
  return slugs.map((keyword) => ({ keyword }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { keyword } = await params;
  const contract = getKeywordBySlug(keyword);
  
  if (!contract || contract.decision !== "GENERATE" || !contract.indexing.indexEligibility) {
    return { title: "Not Found", robots: { index: false, follow: false } };
  }

  const url = `${BASE_URL}${pseoPath(contract.slug)}`;

  return {
    title: { absolute: contract.content.heroTitle },
    description: contract.content.directAnswer,
    keywords: [contract.primaryKeyword, ...contract.secondaryKeywords, "humanifylab", "ai humanizer"],
    authors: [{ name: "HumanifyLab", url: BASE_URL }],
    creator: "HumanifyLab",
    publisher: "HumanifyLab",
    alternates: { canonical: url },
    openGraph: {
      title: contract.content.heroTitle,
      description: contract.content.directAnswer,
      url,
      siteName: "HumanifyLab",
      locale: "en_US",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: contract.content.heroTitle,
      description: contract.content.directAnswer,
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

export default async function PseoPage({ params }: PageProps) {
  const { keyword } = await params;
  const contract = getKeywordBySlug(keyword);

  if (!contract || contract.decision !== "GENERATE" || !contract.indexing.indexEligibility) {
    notFound();
  }

  const url = `${BASE_URL}${pseoPath(contract.slug)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: contract.content.heroTitle,
        description: contract.content.directAnswer,
        inLanguage: "en-US",
        isPartOf: { "@type": "WebSite", "@id": `${BASE_URL}/#website`, name: "HumanifyLab", url: BASE_URL },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${url}#app`,
        name: "HumanifyLab AI Humanizer",
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Web",
        url: BASE_URL,
        description: contract.content.directAnswer,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD", description: "Free plan available" },
      }
    ],
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-20 md:px-12 md:pt-40 md:pb-28 max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          {contract.content.heroTitle}
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10">
          {contract.content.directAnswer}
        </p>
        <Link 
          href="/ai-humanizer"
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-4 text-sm md:text-base font-semibold text-white shadow-lg hover:bg-blue-700 hover:scale-105 transition-all duration-300"
        >
          {contract.content.toolCallToAction}
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </section>

      {/* Trust & Features */}
      <section className="py-16 bg-white dark:bg-slate-800 border-y border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
              <ShieldCheck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">100% Undetectable</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Bypass Turnitin, GPTZero, Originality.ai and more with our industry-leading {contract.primaryKeyword} model.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-6">
              <Zap className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Instant Processing</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Lightning fast text humanization that preserves your original meaning and context flawlessly.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="h-14 w-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
              <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold mb-3">Plagiarism Free</h3>
            <p className="text-slate-600 dark:text-slate-400">
              Every output is uniquely generated to ensure it is completely original and plagiarism-free.
            </p>
          </div>
        </div>
      </section>

      {/* Semantic Keyword Context Section */}
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="prose prose-lg dark:prose-invert mx-auto">
          <h2>Why Choose Our {contract.primaryKeyword.replace(/\b\w/g, l => l.toUpperCase())}?</h2>
          <p>
            When searching for solutions related to <strong>{contract.primaryKeyword}</strong>, users expect top-tier quality, reliability, and accuracy. HumanifyLab's proprietary algorithm has been trained on millions of human-written data points to ensure that when you need to transform your content, it meets the highest standards.
          </p>
          <p>
            Whether you are exploring <em>{contract.secondaryKeywords[0] || 'advanced AI tools'}</em>, <em>{contract.secondaryKeywords[1] || 'content humanization'}</em>, or simply need a reliable way to make your text flow naturally, our platform is designed for you. Our system handles everything from simple rewrites to complex contextual adaptations.
          </p>
          
          <h3>Explore Related Topics</h3>
          <p>
            Our expertise spans across a wide range of use cases. Below are some of the key topics and features related to our core {contract.primaryKeyword} technology:
          </p>
          
          <div className="mt-8 flex flex-wrap gap-3">
            {contract.secondaryKeywords.map((kw, i) => (
              <span key={i} className="inline-block px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-full text-sm font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {kw}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
