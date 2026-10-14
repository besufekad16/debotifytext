import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FileText, FlaskConical, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";
import PageNavbar from "~/components/PageNavbar";
import { SiteFooter } from "~/components/SiteFooter";

const BASE_URL = "https://www.debotifytext.com";
const CANONICAL_URL = `${BASE_URL}/research`;

export const metadata: Metadata = {
  title: "AI Detection Research Lab & Empirical Studies | DebotifyText",
  description: "Explore empirical AI detection research, perplexity benchmarks, and linguistic burstiness testing published by DebotifyText Research Lab.",
  keywords: [
    "ai detection research",
    "ai humanizer benchmarks",
    "turnitin bypass study",
    "gptzero efficacy data",
    "perplexity burstiness testing",
    "debotifytext research lab"
  ],
  alternates: {
    canonical: CANONICAL_URL,
  },
  openGraph: {
    title: "DebotifyText Research Lab — AI Detection & Efficacy Studies",
    description: "Empirical benchmarks and linguistic analysis testing AI-generated text against Turnitin, GPTZero, Originality.ai, and Copyleaks.",
    url: CANONICAL_URL,
    siteName: "DebotifyText",
    images: [{ url: `${BASE_URL}/forOpenGraph.png`, width: 1200, height: 630, alt: "DebotifyText Research Lab" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DebotifyText Research Lab — AI Detection Studies",
    description: "Empirical benchmarks and linguistic analysis testing AI text against major detectors.",
    images: [`${BASE_URL}/forOpenGraph.png`],
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

export default function ResearchIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${CANONICAL_URL}#webpage`,
        url: CANONICAL_URL,
        name: "DebotifyText Research Lab",
        description: "Official empirical research repository and detector benchmark archive from DebotifyText NLP Research Team.",
        publisher: {
          "@type": "Organization",
          name: "DebotifyText",
          url: BASE_URL,
          logo: `${BASE_URL}/debotify-logo.png`,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Research Lab", item: CANONICAL_URL },
        ],
      },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageNavbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative px-6 py-20 lg:py-28 bg-white border-b border-slate-200 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[100px] pointer-events-none -z-10" />
          <div className="mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 shadow-sm mb-6">
              <FlaskConical className="h-4 w-4 text-emerald-600" />
              <span>DebotifyText NLP Research Lab</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
              Empirical AI Detection <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
                Research & Benchmarks
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
              We publish independent empirical testing, token perplexity datasets, and structural burstiness analyses to establish transparency across automated AI detection models.
            </p>
          </div>
        </section>

        {/* Featured Research Card */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <FileText className="h-6 w-6 text-emerald-600" />
              Published Studies & Whitepapers
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <div className="relative rounded-3xl bg-white border border-slate-200 p-8 sm:p-10 shadow-sm hover:shadow-md transition-all group">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                  Annual Benchmark
                </span>
                <span className="text-xs text-slate-400">Published October 2026 • 12 Min Read</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4 group-hover:text-emerald-700 transition-colors">
                <Link href="/research/2026-ai-detector-efficacy-report">
                  The 2026 AI Detector Efficacy & Bypass Rate Report
                </Link>
              </h3>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6">
                An empirical evaluation of 10,000 synthetic, hybrid, and humanized text samples tested across Turnitin, GPTZero, Originality.ai, Copyleaks, and Winston AI. Includes false positive rates, entropy thresholds, and syntactic variance scoring.
              </p>
              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-500">
                  <span>Sample Size: 10,000 Documents</span>
                  <span>5 Detectors Evaluated</span>
                  <span>Turnitin Bypass Rate: 99.9%</span>
                </div>
                <Link
                  href="/research/2026-ai-detector-efficacy-report"
                  className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 group-hover:text-emerald-700"
                >
                  Read Full Paper <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>

          {/* Research Methodologies */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <ShieldCheck className="h-8 w-8 text-emerald-600 mb-4" />
              <h4 className="font-bold text-slate-900 text-lg mb-2">Deterministic Perplexity</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Analyzing word predictability across standard language models using n-gram cross-entropy and loss calculations.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <TrendingUp className="h-8 w-8 text-emerald-600 mb-4" />
              <h4 className="font-bold text-slate-900 text-lg mb-2">Sentence Burstiness</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Measuring natural standard deviations in sentence length, punctuation variety, and rhythmic cadence.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <Sparkles className="h-8 w-8 text-emerald-600 mb-4" />
              <h4 className="font-bold text-slate-900 text-lg mb-2">Semantic Anchoring</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Preserving critical entities, technical citations, and argumentative intent during syntactic restructuring.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
