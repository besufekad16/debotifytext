import { type Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MessageSquare } from "lucide-react";
import MarketingShell from "~/components/marketing/MarketingShell";
import FaqAccordionClient from "./FaqAccordionClient";

export const metadata: Metadata = {
  title: "FAQ — AI Humanizer Questions Answered",
  description: "Answers to common questions about DebotifyText: how the AI humanizer works, which AI detectors it passes, pricing and credits, file formats, data privacy and team plans.",
  keywords: [
    "ai humanizer faq",
    "how does ai humanizer work",
    "how to bypass turnitin",
    "how to bypass gptzero",
    "ai humanizer questions",
    "debotifytext faq",
    "is debotifytext free",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.debotifytext.com/faq",
  },
  openGraph: {
    title: "FAQ — AI Humanizer Questions Answered | DebotifyText",
    description: "How the AI humanizer works, which AI detectors it passes, pricing and credits, file formats, data privacy and team plans.",
    url: "https://www.debotifytext.com/faq",
    siteName: "DebotifyText",
    images: [
      {
        url: "/forOpenGraph.png",
        width: 1200,
        height: 630,
        alt: "DebotifyText FAQ — AI Humanizer Questions Answered",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ — AI Humanizer Questions Answered | DebotifyText",
    description: "How the AI humanizer works, which AI detectors it passes, pricing, file formats, privacy and team plans.",
    images: ["/forOpenGraph.png"],
    site: "@debotifytext",
    creator: "@debotifytext",
  },
};

export default function FAQPage() {
  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "What is DebotifyText?",
          answer: "DebotifyText is an AI-powered text humanizer that transforms AI-generated content into fully natural, professional writing with authentic human tone and style. Our advanced AI humanizer helps you enhance your content while preserving the original meaning and intent.",
        },
        {
          question: "How does the AI humanizer work?",
          answer: "Our AI humanizer uses advanced natural language processing to analyze and rewrite your text. It adds human-like variations and adjusts sentence structures that make the content sound naturally written by humans. You can choose from different presets like 'Friendly', 'Professional', 'Academic', or 'Creative' to match your desired tone.",
        },
        {
          question: "Is DebotifyText free to use?",
          answer: "DebotifyText offers a free trial with limited credits to test our AI humanizer. After that, you can purchase affordable credit packages to continue humanizing your content. We offer flexible pricing plans to suit different needs.",
        },
      ],
    },
    {
      category: "Credits & Pricing",
      questions: [
        {
          question: "What are credits and how do they work?",
          answer: "Credits are used to humanize your text. Typically, one credit equals one word of text processed. The exact number of credits required depends on the length and complexity of your content. You can view your remaining credits on your account.",
        },
        {
          question: "Can I cancel my subscription?",
          answer: "Yes, you can cancel your subscription at any time from your account settings. After cancellation, you will retain access to your plan until the end of the current billing period. All sales are final — we do not offer refunds.",
        },
      ],
    },
    {
      category: "Quality & Features",
      questions: [
        {
          question: "How does DebotifyText improve my writing?",
          answer: "DebotifyText is specifically designed to transform AI-generated text into natural, professional writing with authentic human tone and style. Our AI humanizer has a very high success rate in producing natural-sounding content. However, we recommend reviewing the output to ensure it meets your specific requirements.",
        },
        {
          question: "Will the humanized text maintain the original meaning?",
          answer: "Absolutely! Our AI humanizer is designed to preserve the core message and intent of your original text while making it sound more natural and human-like. The meaning, key points, and information remain intact.",
        },
        {
          question: "What if I'm not happy with the humanized result?",
          answer: "You can try humanizing the text again with a different preset or adjust your input. Each preset (Friendly, Professional, Academic, Empathetic) produces different styles. If you're still not satisfied, our support team is here to help you achieve the best results.",
        },
      ],
    },
    {
      category: "Technical & Support",
      questions: [
        {
          question: "What file formats are supported?",
          answer: "You can paste text directly or upload .txt, .docx, or .pdf files. We'll extract the content automatically so you can humanize in one click.",
        },
        {
          question: "Is there a word limit for humanization?",
          answer: "The word limit depends on your credit balance. Each humanization request can process text based on your available credits. Larger texts will require more credits.",
        },
        {
          question: "How do I contact support?",
          answer: "You can reach our support team through our contact page or by emailing debotifytext@gmail.com. We typically respond within 24 hours.",
        },
      ],
    },
  ];

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
        "name": "FAQ",
        "item": "https://www.debotifytext.com/faq"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.flatMap((category) =>
      category.questions.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    )
  };

  return (
    <MarketingShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 bg-gradient-to-b from-green-50/50 to-white overflow-hidden border-b border-slate-100">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-green-100/50 rounded-full blur-[100px] opacity-60 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-green-50 rounded-full blur-[80px] opacity-70 translate-y-1/2 pointer-events-none" />
        
        <div className="relative z-10 mx-auto max-w-4xl px-5 text-center sm:px-6 lg:px-8">
          <span className="inline-block py-1 px-3 rounded-full bg-green-100/50 border border-green-200/50 text-[11px] font-bold tracking-widest text-green-700 uppercase mb-6">
            Support Hub
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Frequently asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">questions</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-[17px] leading-relaxed text-slate-500 font-medium">
            Everything you need to know about DebotifyText — how the humanizer works, pricing, privacy, and support.
          </p>
        </div>
      </section>

      {/* Accordion Content Section */}
      <section className="relative py-24 bg-white">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(74,222,128,0.03),transparent_70%)] rounded-full pointer-events-none" />
        
        <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-6 lg:px-8">
          <FaqAccordionClient faqs={faqs} />
        </div>
      </section>

      {/* Still Have Questions CTA */}
      <section className="relative py-20 bg-slate-50 border-t border-slate-100 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
        
        <div className="relative z-10 mx-auto max-w-2xl px-5 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-slate-100 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.05)]">
            <MessageSquare className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Still have questions?</h2>
          <p className="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-slate-500 font-medium">
            Can't find the answer you're looking for? Our support team is here to help you get started.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-green-700 px-8 py-4 text-[15px] font-bold text-white transition-all hover:bg-green-800 hover:shadow-md hover:-translate-y-0.5 sm:w-auto"
            >
              Contact Support
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/pricing"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white border border-slate-200 px-8 py-4 text-[15px] font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 sm:w-auto"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </MarketingShell>
  );
}
