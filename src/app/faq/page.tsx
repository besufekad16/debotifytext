import { type Metadata } from "next";
import MarketingShell from "~/components/marketing/MarketingShell";
import { Section, Container, SectionHeading, PrimaryButton, SecondaryButton } from "~/components/marketing/primitives";

export const metadata: Metadata = {
  title: "FAQ — AI Humanizer Questions Answered",
  description: "Answers to common questions about HumanifyLab: how the AI humanizer works, which AI detectors it passes, pricing and credits, file formats, data privacy and team plans.",
  keywords: [
    "ai humanizer faq",
    "how does ai humanizer work",
    "how to bypass turnitin",
    "how to bypass gptzero",
    "ai humanizer questions",
    "humanifylab faq",
    "is humanifylab free",
  ],
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.humanifylab.com/faq",
  },
  openGraph: {
    title: "FAQ — AI Humanizer Questions Answered | HumanifyLab",
    description: "How the AI humanizer works, which AI detectors it passes, pricing and credits, file formats, data privacy and team plans.",
    url: "https://www.humanifylab.com/faq",
    siteName: "HumanifyLab",
    images: [
      {
        url: "/forOpenGraph.png",
        width: 1200,
        height: 630,
        alt: "HumanifyLab FAQ — AI Humanizer Questions Answered",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FAQ — AI Humanizer Questions Answered | HumanifyLab",
    description: "How the AI humanizer works, which AI detectors it passes, pricing, file formats, privacy and team plans.",
    images: ["/forOpenGraph.png"],
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
          question: "Can I cancel my subscription?",
          answer: "Yes, you can cancel your subscription at any time from your account settings. After cancellation, you will retain access to your plan until the end of the current billing period. All sales are final — we do not offer refunds.",
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
    <MarketingShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Section tone="dark" compact>
        <Container width="narrow" className="text-center">
          <SectionHeading
            as="h1"
            dark
            eyebrow="Support"
            title="Frequently asked questions"
            description="Everything you need to know about HumanifyLab — how it works, pricing, privacy, and support."
          />
        </Container>
      </Section>

      <Section>
        <Container width="narrow">
          <div className="space-y-12">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="mb-6 border-b border-gray-200 pb-3 text-lg font-semibold text-gray-900">
                  {category.category}
                </h2>
                <div className="space-y-4">
                  {category.questions.map((faq, faqIndex) => (
                    <div
                      key={faqIndex}
                      className="rounded-2xl border border-gray-200 bg-white p-6 transition-colors hover:border-[#8b6f47]/40"
                    >
                      <h3 className="mb-2 text-base font-semibold text-gray-900">{faq.question}</h3>
                      <p className="text-sm leading-relaxed text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section tone="muted" compact>
        <Container width="narrow" className="text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Still have questions?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-600">
            Can&apos;t find the answer you&apos;re looking for? Our support team is here to help.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <PrimaryButton href="/contact" withArrow={false}>
              Contact Support
            </PrimaryButton>
            <SecondaryButton href="/pricing">View Pricing Plans</SecondaryButton>
          </div>
        </Container>
      </Section>
    </MarketingShell>
  );
}
