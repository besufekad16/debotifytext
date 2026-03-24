import { type Metadata } from "next";
import Link from "next/link";
import PageNavbar from "~/components/PageNavbar";
import { SiteFooter } from "~/components/SiteFooter";

export const metadata: Metadata = {
  title: "FAQ - Undetectable AI Humanizer | Bypass AI Detectors | HumanifyLab",
  description: "Get answers about bypassing AI detectors. Learn how HumanifyLab bypasses Originality.AI, GPTZero, Turnitin, ZeroGPT with 99.9% success. Undetectable AI humanizer FAQ.",
  keywords: [
    // Core FAQ Keywords
    "ai humanizer faq",
    "undetectable ai faq",
    "ai detector bypass faq",
    "humanizer questions",
    
    // AI Detector Bypass Questions
    "how to bypass originality ai",
    "how to bypass gptzero",
    "how to bypass turnitin",
    "how to bypass zerogpt",
    "bypass ai detection faq",
    "undetectable ai questions",
    
    // Feature Questions
    "ai humanizer",
    "humanize AI text",
    "AI text humanizer",
    "natural writing",
    "writing enhancement",
    "professional writing",
    "free AI humanizer",
    
    // Specific Queries
    "does humanifylab bypass ai detectors",
    "is humanifylab undetectable",
    "humanifylab success rate",
    "ai humanizer pricing questions"
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.humanifylab.com/faq",
  },
  openGraph: {
    title: "FAQ - Undetectable AI Humanizer | Bypass All AI Detectors",
    description: "Get answers about bypassing AI detectors. Learn how HumanifyLab bypasses Originality.AI, GPTZero, Turnitin with 99.9% success.",
    url: "https://www.humanifylab.com/faq",
    siteName: "HumanifyLab",
    images: [
      {
        url: "/forOpengraph.png",
        width: 1200,
        height: 630,
        alt: "HumanifyLab FAQ - Undetectable AI Humanizer",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ - Undetectable AI Humanizer | Bypass All AI Detectors",
    description: "Get answers about bypassing AI detectors. HumanifyLab bypasses Originality.AI, GPTZero, Turnitin with 99.9% success.",
    images: ["/forOpengraph.png"],
    site: "@humanifylab",
    creator: "@humanifylab",
  },
};

export default function FAQPage() {
  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "What is HumanifyLab?",
          answer: "HumanifyLab is an AI-powered text humanizer that transforms AI-generated content into fully natural, professional writing with authentic human tone and style. Our advanced AI humanizer helps you enhance your content while preserving the original meaning and intent.",
        },
        {
          question: "How does the AI humanizer work?",
          answer: "Our AI humanizer uses advanced natural language processing to analyze and rewrite your text. It adds human-like variations and adjusts sentence structures that make the content sound naturally written by humans. You can choose from different presets like 'Friendly', 'Professional', 'Academic', or 'Creative' to match your desired tone.",
        },
        {
          question: "Is HumanifyLab free to use?",
          answer: "HumanifyLab offers a free trial with limited credits to test our AI humanizer. After that, you can purchase affordable credit packages to continue humanizing your content. We offer flexible pricing plans to suit different needs.",
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
          question: "Can I get a refund if I'm not satisfied?",
          answer: "We're confident in the quality of our AI humanizer. If you're not satisfied with the results, please contact our support team within 7 days of purchase, and we'll work with you to find a solution.",
        },
      ],
    },
    {
      category: "Quality & Features",
      questions: [
        {
          question: "How does HumanifyLab improve my writing?",
          answer: "HumanifyLab is specifically designed to transform AI-generated text into natural, professional writing with authentic human tone and style. Our AI humanizer has a very high success rate in producing natural-sounding content. However, we recommend reviewing the output to ensure it meets your specific requirements.",
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
          answer: "You can reach our support team through our contact page or by emailing humanifylab1@gmail.com. We typically respond within 24 hours.",
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
        "item": "https://www.humanifylab.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "FAQ",
        "item": "https://www.humanifylab.com/faq"
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
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PageNavbar />
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#dbeafe] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#2563eb] shadow-sm">
            Frequently Asked Questions
          </span>
          <h1 className="mt-4 text-[1.6rem] sm:text-[2rem] font-bold tracking-tight text-gray-950 sm:text-5xl">
            Everything You Need to Know
          </h1>
          <p className="mt-4 text-[14px] text-gray-400">
            Get answers about our AI humanizer and how to enhance your writing naturally
          </p>
        </div>

        <div className="mt-16 space-y-12">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="mb-6 text-[1.15rem] font-bold text-gray-900">
                {category.category}
              </h2>
              <div className="space-y-6">
                {category.questions.map((faq, faqIndex) => (
                  <div
                    key={faqIndex}
                    className="rounded-2xl border border-white/60 bg-white/80 p-6 shadow-sm backdrop-blur transition hover:shadow-md"
                  >
                    <h3 className="text-[14px] font-semibold text-gray-900">
                      {faq.question}
                    </h3>
                    <p className="mt-3 text-[13.5px] leading-relaxed text-gray-600">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-white/60 bg-white/80 p-8 text-center shadow-md backdrop-blur">
          <h2 className="text-[1.15rem] font-bold text-gray-900">
            Still have questions?
          </h2>
          <p className="mt-2 text-[14px] text-gray-400">
            Can&apos;t find the answer you&apos;re looking for? Our support team is here to help.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/contact">
              <button className="rounded-full bg-[#3b82f6] px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-[#2563eb]">
                Contact Support
              </button>
            </Link>
            <Link href="/pricing">
              <button className="rounded-full border-2 border-[#3b82f6] px-6 py-3 font-semibold text-[#3b82f6] transition hover:bg-[#3b82f6] hover:text-white">
                View Pricing Plans
              </button>
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
