import { type Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Mail, MessageCircleQuestion, Building2 } from "lucide-react";

import MarketingShell from "~/components/marketing/MarketingShell";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us - Undetectable AI Humanizer Support | DebotifyText",
  description: "Contact DebotifyText for support with bypassing AI detectors. Expert help with Originality.AI, GPTZero, Turnitin bypass. Enterprise undetectable AI solutions. 24/7 support.",
  keywords: [
    "debotifytext contact",
    "ai humanizer support",
    "undetectable ai support",
    "ai detector bypass help",
    "originality ai bypass support",
    "gptzero bypass help",
    "turnitin bypass support",
    "zerogpt bypass help",
    "ai humanizer",
    "humanize AI text",
    "writing enhancement",
    "undetectable ai",
    "enterprise ai humanizer",
    "bulk ai humanization",
    "api access support",
    "custom solutions",
    "customer service",
    "technical support"
  ],
  alternates: {
    canonical: "https://www.debotifytext.com/contact",
  },
  openGraph: {
    title: "Contact Us - Undetectable AI Humanizer Support | DebotifyText",
    description: "Expert support for bypassing AI detectors. Help with Originality.AI, GPTZero, Turnitin bypass. Enterprise solutions.",
    url: "https://www.debotifytext.com/contact",
    siteName: "DebotifyText",
    images: [
      {
        url: "/forOpenGraph.png",
        width: 1200,
        height: 630,
        alt: "DebotifyText Contact - Undetectable AI Support"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us - Undetectable AI Humanizer Support",
    description: "Expert support for bypassing AI detectors. Help with Originality.AI, GPTZero, Turnitin.",
    images: ["/forOpenGraph.png"],
  },
};

export default async function ContactPage() {
  const user = await currentUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.debotifytext.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Contact Us",
        "item": "https://www.debotifytext.com/contact"
      }
    ]
  };

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact DebotifyText",
    "description": "Contact the DebotifyText team for professional AI humanization solutions and enterprise support.",
    "url": "https://www.debotifytext.com/contact"
  };

  const contactHighlights = [
    {
      icon: Mail,
      title: "Email us anytime",
      description: (
        <>
          <a href="mailto:debotifytext1@gmail.com" className="font-semibold text-green-700 transition-colors hover:text-green-800">
            debotifytext1@gmail.com
          </a>{" "}
          — we respond in under 24 hours.
        </>
      ),
    },
    {
      icon: MessageCircleQuestion,
      title: "Prefer self-serve answers?",
      description: (
        <>
          Visit{" "}
          <Link className="font-semibold text-green-700 transition-colors hover:text-green-800" href="/faq">
            our FAQ
          </Link>{" "}
          for tutorials, billing, and compliance docs.
        </>
      ),
    },
    {
      icon: Building2,
      title: "Need a custom plan?",
      description:
        "Share your compliance requirements and volume. We'll schedule a call with our solutions team.",
    },
  ];

  return (
    <MarketingShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />

      <section className="relative overflow-hidden bg-white pt-24 pb-32">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute left-0 top-0 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/4 rounded-full bg-green-50 opacity-70 blur-[100px]" />
        <div className="pointer-events-none absolute right-0 top-1/2 h-[30rem] w-[30rem] translate-x-1/3 -translate-y-1/2 rounded-full bg-green-100/50 opacity-50 blur-[120px]" />

        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 relative z-10">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            
            {/* Left: Intro + Highlights */}
            <div className="space-y-12">
              <div className="space-y-6">
                <span className="inline-block py-1.5 px-3.5 rounded-full bg-green-50 border border-green-200/60 text-[11px] font-bold tracking-[0.2em] text-green-700 uppercase shadow-sm">
                  Get in touch
                </span>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl leading-[1.1]">
                  Talk to the <br/>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">DebotifyText</span> team
                </h1>
                <p className="max-w-md text-lg leading-relaxed text-slate-500 font-medium">
                  Tell us about your use case, partnership idea, or anything else on your mind. We reply within one business day.
                </p>
              </div>

              <div className="space-y-4 relative">
                {/* Decorative connecting line */}
                <div className="absolute left-[1.35rem] top-8 bottom-8 w-px bg-gradient-to-b from-green-100 via-green-200/50 to-transparent hidden sm:block" />
                
                {contactHighlights.map(({ icon: Icon, title, description }) => (
                  <div
                    key={title}
                    className="group relative flex items-start gap-5 rounded-[1.5rem] border border-slate-100 bg-white/60 p-6 backdrop-blur-md shadow-sm transition-all duration-300 hover:border-green-200 hover:shadow-[0_8px_30px_-12px_rgba(34,197,94,0.15)] hover:-translate-y-1"
                  >
                    <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-green-50 shadow-inner border border-green-100/50 transition-colors duration-300 group-hover:bg-green-100/80">
                      <Icon className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="pt-1">
                      <p className="text-[16px] font-bold text-slate-900">{title}</p>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-slate-500 font-medium">{description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-[1.5rem] bg-slate-50/80 p-6 border border-slate-100 backdrop-blur-sm flex items-center gap-4 max-w-sm">
                <div className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </div>
                <div>
                  <p className="text-[14px] font-bold text-slate-900">24/7 Availability</p>
                  <p className="text-[13px] font-medium text-slate-500">Global customer support.</p>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="relative">
              {/* Form Backdrop Glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-green-400/20 to-transparent blur-2xl rounded-[3rem] -z-10 transform scale-[0.95] translate-y-4" />
              
              <div className="rounded-[2rem] sm:rounded-[2.5rem] border border-white/40 bg-white/80 p-8 shadow-[0_24px_60px_-15px_rgba(34,197,94,0.15)] backdrop-blur-xl sm:p-10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[250px] h-[250px] bg-green-50 rounded-full blur-[80px] opacity-60 -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                
                <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 relative z-10">Send us a message</h2>
                <p className="mt-2 text-[15px] font-medium text-slate-500 relative z-10">
                  Fill out the form and we'll follow up with the best next step.
                </p>
                
                <div className="mt-8 relative z-10">
                  <ContactForm initialEmail={userEmail} isEmailReadOnly={!!userEmail} />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
