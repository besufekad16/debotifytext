import { type Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Mail, MessageCircleQuestion, Building2 } from "lucide-react";

import MarketingShell from "~/components/marketing/MarketingShell";
import { Section, Container, Eyebrow } from "~/components/marketing/primitives";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us - Undetectable AI Humanizer Support | HumanifyLab",
  description: "Contact HumanifyLab for support with bypassing AI detectors. Expert help with Originality.AI, GPTZero, Turnitin bypass. Enterprise undetectable AI solutions. 24/7 support.",
  keywords: [
    // Contact Keywords
    "humanifylab contact",
    "ai humanizer support",
    "undetectable ai support",
    "ai detector bypass help",
    
    // Support Topics
    "originality ai bypass support",
    "gptzero bypass help",
    "turnitin bypass support",
    "zerogpt bypass help",
    
    // Core Features
    "ai humanizer",
    "humanize AI text",
    "writing enhancement",
    "undetectable ai",
    
    // Business
    "enterprise ai humanizer",
    "bulk ai humanization",
    "api access support",
    "custom solutions",
    "customer service",
    "technical support"
  ],
  alternates: {
    canonical: "https://www.humanifylab.com/contact",
  },
  openGraph: {
    title: "Contact Us - Undetectable AI Humanizer Support | HumanifyLab",
    description: "Expert support for bypassing AI detectors. Help with Originality.AI, GPTZero, Turnitin bypass. Enterprise solutions.",
    url: "https://www.humanifylab.com/contact",
    siteName: "HumanifyLab",
    images: [
      {
        url: "/forOpenGraph.png",
        width: 1200,
        height: 630,
        alt: "HumanifyLab Contact - Undetectable AI Support"
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
        "item": "https://www.humanifylab.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Contact Us",
        "item": "https://www.humanifylab.com/contact"
      }
    ]
  };

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact HumanifyLab",
    "description": "Contact the HumanifyLab team for professional AI humanization solutions and enterprise support.",
    "url": "https://www.humanifylab.com/contact"
  };

  const contactHighlights = [
    {
      icon: Mail,
      title: "Email us anytime",
      description: (
        <>
          <a href="mailto:humanifylab1@gmail.com" className="font-semibold text-[var(--hl-mint-deep)] underline underline-offset-4">
            humanifylab1@gmail.com
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
          <Link className="font-semibold text-[var(--hl-mint-deep)] underline underline-offset-4" href="/faq">
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

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
            {/* Left: intro + highlights */}
            <div className="space-y-8">
              <div className="space-y-4">
                <Eyebrow>Contact</Eyebrow>
                <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
                  Talk to the HumanifyLab team
                </h1>
                <p className="max-w-xl text-base leading-relaxed text-gray-600">
                  Tell us about your use case, partnership idea, or anything else on your mind. We reply within one
                  business day.
                </p>
              </div>

              <div className="space-y-4">
                {contactHighlights.map(({ icon: Icon, title, description }) => (
                  <div
                    key={title}
                    className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition-colors hover:border-[var(--hl-mint-deep)]/40"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--hl-mint-deep)]">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-gray-600">{description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl bg-[#faf6f1] p-5">
                <p className="text-sm font-semibold text-gray-900">Availability</p>
                <p className="mt-1 text-sm text-gray-600">24/7 customer support, worldwide.</p>
              </div>
            </div>

            {/* Right: form */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_24px_60px_-40px_rgba(94,61,42,0.35)] sm:p-8">
              <h2 className="text-xl font-semibold tracking-tight text-gray-900">Send us a message</h2>
              <p className="mt-2 text-sm text-gray-600">
                Fill out the form and we&apos;ll follow up with the best next step.
              </p>
              <div className="mt-7">
                <ContactForm initialEmail={userEmail} isEmailReadOnly={!!userEmail} />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </MarketingShell>
  );
}

