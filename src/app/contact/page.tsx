import { type Metadata } from "next";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

import PageNavbar from "~/components/PageNavbar";
import { SiteFooter } from "~/components/SiteFooter";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us - HumanifyLab",
  description: "Connect with the HumanifyLab team. Professional support for enterprise-grade AI humanization technology and custom solutions.",
  keywords: [
    "ai humanizer",
    "AI detection bypass",
    "humanize AI text",
    "humanizer",
    "HumanifyLab contact",
    "support",
    "customer service",
    "contact us",
    "help",
    "feedback",
    "enterprise AI humanizer"
  ],
  alternates: {
    canonical: "https://www.humanifylab.com/contact",
  },
  openGraph: {
    title: "Contact Us - HumanifyLab",
    description: "Connect with our professional support team for enterprise solutions and assistance.",
    url: "https://www.humanifylab.com/contact",
    siteName: "HumanifyLab",
    images: [
      {
        url: "/forOpengraph.png",
        width: 1200,
        height: 630,
        alt: "HumanifyLab OpenGraph Image"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us - HumanifyLab",
    description: "Connect with the HumanifyLab professional support team.",
    images: ["/humanify.png"],
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
      badge: "Support",
      badgeStyles: "border-2 border-[#bfdbfe] text-[#2563eb]",
      title: "Email us anytime",
      description: (
        <>
          <a href="mailto:humanifylab1@gmail.com" className="font-semibold text-[#2563eb] underline underline-offset-4">
            humanifylab1@gmail.com
          </a>{" "}
          • We respond in under 24 hours.
        </>
      ),
    },
    {
      badge: "Help",
      badgeStyles: "border-2 border-[#bfdbfe] text-[#2563eb]",
      title: "Prefer self-serve answers?",
      description: (
        <>
          Visit{" "}
          <Link className="font-semibold text-[#2563eb] underline underline-offset-4" href="/faq">
            our FAQ
          </Link>{" "}
          for tutorials, billing, and compliance docs.
        </>
      ),
    },
    {
      badge: "Enterprise",
      badgeStyles: "border-2 border-[#bfdbfe] text-[#2563eb]",
      title: "Need a custom plan?",
      description: "Share your compliance requirements and volume. We’ll schedule a call with our solutions team.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f0f9ff]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <PageNavbar />
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full  border border-[#bfdbfe] bg-card px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#2563eb]">
                We’d love to hear from you
              </span>
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Contact the HumanifyLab team
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
                Tell us about your use case, partnership idea, or anything else on your mind. We’ll reply within one business day.
              </p>
            </div>

            <div className="space-y-4">
              {contactHighlights.map(({ badge, badgeStyles, title, description }) => (
                <div
                  key={badge}
                  className="flex flex-col gap-4 rounded-2xl border border-[#bfdbfe] bg-white/95 p-5 shadow-sm sm:flex-row sm:items-center sm:gap-6"
                >
                  <div className="flex justify-center sm:justify-start">
                    <span
                      className={`inline-flex min-w-[100px] items-center justify-center rounded-full px-3 py-1 text-xs font-semibold ${badgeStyles}`}
                    >
                      {badge}
                    </span>
                  </div>
                  <div className="space-y-1 text-center sm:text-left">
                    <p className="text-base font-semibold text-foreground">{title}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-[#bfdbfe] bg-white/90 p-6 shadow-sm">
              <p className="text-sm font-semibold text-foreground">Availability</p>
              <p className="mt-1 text-sm text-muted-foreground">24/7 Customer Support</p>
            </div>
          </div>

          <div className="rounded-[28px] border border-[#bfdbfe] bg-card p-8 shadow-[0_26px_55px_-38px_rgba(24,18,54,0.45)]">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">Send us a message</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Fill out the form and we’ll follow up with the best next step.
            </p>
            <div className="mt-8">
              <ContactForm initialEmail={userEmail} isEmailReadOnly={!!userEmail} />
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

