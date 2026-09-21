import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, Bot, Edit3, CheckCircle2 } from "lucide-react";
import { BASE_URL } from "~/lib/pseo";
import PageNavbar from "~/components/PageNavbar";
import { SiteFooter } from "~/components/SiteFooter";

export const metadata: Metadata = {
  title: "AI Humanizer: The #1 Free AI Text Humanizer & Detector Bypass",
  description: "HumanifyLab is the industry-leading AI humanizer. Turn ChatGPT, Claude, and Gemini drafts into natural, human-written text that bypasses AI detectors like Turnitin, GPTZero, and Originality.ai.",
  keywords: [
    "HumanifyLab",
    "humanify",
    "humanify ai",
    "humanify text",
    "humanify ai text",
    "humanify lab",
    "ai humanizer",
    "humanize ai text"
  ],
  alternates: {
    canonical: `${BASE_URL}/ai-humanizer`,
  },
  openGraph: {
    title: "AI Humanizer: The #1 Free AI Text Humanizer",
    description: "Bypass AI detectors with the most advanced AI humanizer on the market. Turn robotic text into natural human writing.",
    url: `${BASE_URL}/ai-humanizer`,
    images: [{ url: `${BASE_URL}/forOpenGraph.png`, width: 1200, height: 630, alt: "AI Humanizer" }],
  },
};

export default function AIHumanizerPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-950">
      <PageNavbar />
      <main className="flex-1 bg-slate-50 min-h-screen text-slate-900 selection:bg-emerald-200">
        
        {/* Hero Section */}
        <section className="relative px-6 py-20 lg:py-32 overflow-hidden bg-white border-b border-slate-200">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="mx-auto max-w-5xl relative z-10 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-800 ring-1 ring-inset ring-emerald-600/20 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              The #1 Free AI Humanizer
            </span>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-tight">
              Turn Robotic AI Text Into <br className="hidden lg:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Natural Human Writing</span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Bypass Turnitin, GPTZero, and Originality.ai with zero effort. Our advanced AI text humanizer rewrites ChatGPT, Claude, and Gemini drafts so they read like they were written by a real person.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-slate-800 hover:scale-105 hover:shadow-xl w-full sm:w-auto">
                Humanize Text For Free <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/pricing" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-bold text-slate-900 ring-1 ring-inset ring-slate-200 transition-all hover:bg-slate-50 w-full sm:w-auto">
                View Pricing
              </Link>
            </div>
          </div>
        </section>

        {/* Value Props */}
        <section className="px-6 py-24 bg-slate-50">
          <div className="mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why Writers & Students Choose HumanifyLab</h2>
              <p className="mt-4 text-lg text-slate-600">The only AI humanizer that preserves your meaning while completely erasing the robotic watermark.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: ShieldCheck,
                  title: "100% Undetectable",
                  desc: "Consistently bypasses the strictest AI detectors including Turnitin, GPTZero, ZeroGPT, and Originality.ai without raising false flags."
                },
                {
                  icon: Edit3,
                  title: "Preserves Original Meaning",
                  desc: "Unlike cheap spinners that destroy your formatting and swap random synonyms, we maintain your exact facts, citations, and structure."
                },
                {
                  icon: Zap,
                  title: "Lightning Fast",
                  desc: "Humanize thousands of words in seconds. Paste your ChatGPT draft, click run, and get a publish-ready document instantly."
                }
              ].map((f, i) => (
                <div key={i} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="px-6 py-24 bg-white border-y border-slate-200">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold tracking-tight mb-6">How Our AI Humanizer Works</h2>
                <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                  Most AI detectors look for "burstiness" and "perplexity"—statistical measurements of how predictable a sentence is. AI writes predictably. Humans write chaotically.
                </p>
                <ul className="space-y-6">
                  {[
                    "Analyzes your text for common AI patterns and rhythms.",
                    "Restructures sentences to vary length and complexity (increasing burstiness).",
                    "Replaces overly predictable vocabulary with natural phrasing (increasing perplexity).",
                    "Polishes the final output so it reads effortlessly to a human editor."
                  ].map((step, i) => (
                    <li key={i} className="flex gap-4 items-start">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white font-bold text-sm">
                        {i + 1}
                      </div>
                      <p className="text-slate-700 leading-relaxed pt-1">{step}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-slate-100 rounded-3xl p-8 lg:p-12 border border-slate-200">
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-3 text-sm font-bold text-rose-500">
                      <Bot className="w-4 h-4" /> Original AI Draft (100% AI)
                    </div>
                    <p className="text-slate-600">Furthermore, the implementation of these strategies is crucial for long-term success. It is important to note that...</p>
                  </div>
                  <div className="flex justify-center">
                    <ArrowRight className="w-6 h-6 text-slate-400 rotate-90" />
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-6 shadow-sm ring-1 ring-emerald-200">
                    <div className="flex items-center gap-2 mb-3 text-sm font-bold text-emerald-600">
                      <ShieldCheck className="w-4 h-4" /> Humanized Text (0% AI)
                    </div>
                    <p className="text-slate-800">You really have to put these strategies to work if you want them to stick around. And honestly, the biggest takeaway here is...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 py-32 bg-slate-900 text-center text-white">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-4xl font-bold tracking-tight mb-6">Ready to bypass AI detectors?</h2>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed">
              Join over 100,000 writers, marketers, and students who trust HumanifyLab to protect their work and ensure their writing stays human.
            </p>
            <Link href="/" className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 px-10 py-5 text-lg font-bold text-slate-900 transition-all hover:bg-emerald-400 hover:scale-105">
              Start Humanizing For Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
