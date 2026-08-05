import LegalPage, { type LegalSection } from "~/components/marketing/LegalPage";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.humanifylab.com" },
    { "@type": "ListItem", position: 2, name: "Terms of Service", item: "https://www.humanifylab.com/terms" },
  ],
};

const SECTIONS: LegalSection[] = [
  {
    heading: "1. Acceptance of Terms",
    paragraphs: [
      "By accessing and using HumanifyLab, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these Terms of Service, please do not use our service.",
    ],
  },
  {
    heading: "2. Age Requirement",
    paragraphs: [
      "You must be at least 18 years of age to use HumanifyLab. By using our service, you represent and warrant that you are 18 years of age or older. If you are under 18, you are not permitted to use this service.",
    ],
  },
  {
    heading: "3. Description of Service",
    paragraphs: [
      "HumanifyLab provides an AI-powered text humanization service that transforms AI-generated content into natural, human-like writing with professional quality and authentic tone. Our service includes:",
    ],
    bullets: [
      "Text humanization with multiple style presets",
      "Natural writing enhancement capabilities",
      "Credit-based usage system",
      "API access for ULTRA plan subscribers",
      "History tracking and management",
    ],
  },
  {
    heading: "4. User Accounts",
    paragraphs: ["To use certain features of our service, you must register for an account. You are responsible for:"],
    bullets: [
      "Maintaining the confidentiality of your account credentials",
      "All activities that occur under your account",
      "Notifying us immediately of any unauthorized use",
      "Ensuring your account information is accurate and up-to-date",
    ],
  },
  {
    heading: "5. Acceptable Use",
    paragraphs: ["You agree not to use HumanifyLab to:"],
    bullets: [
      "Violate any laws or regulations",
      "Infringe on intellectual property rights",
      "Transmit harmful or malicious content",
      "Attempt to gain unauthorized access to our systems",
      "Use the service for any illegal or unethical purposes",
      "Resell or redistribute our service without permission",
    ],
  },
  {
    heading: "6. Payment and Subscriptions",
    paragraphs: ["HumanifyLab offers both free and paid plans:"],
    bullets: [
      <span key="free"><strong className="text-gray-900">Free Plan:</strong> Limited credits provided at signup</span>,
      <span key="paid"><strong className="text-gray-900">Paid Plans:</strong> Subscription-based with monthly or yearly billing</span>,
      <span key="credits"><strong className="text-gray-900">Credits:</strong> One credit typically equals processing of 1 word</span>,
      <span key="final"><strong className="text-gray-900">All Sales Final:</strong> All purchases are non-refundable. We do not offer refunds on subscriptions or credit top-ups. You may cancel your subscription at any time to prevent future charges.</span>,
      <span key="cancel"><strong className="text-gray-900">Cancellation:</strong> You may cancel your subscription at any time</span>,
    ],
  },
  {
    heading: "7. Intellectual Property",
    paragraphs: [
      "The service and its original content, features, and functionality are owned by HumanifyLab and are protected by international copyright, trademark, and other intellectual property laws.",
      "Content you create using our service remains yours, but you grant us a license to process and humanize your text to provide the service.",
    ],
  },
  {
    heading: "8. API Usage (ULTRA Plan)",
    paragraphs: ["ULTRA plan subscribers with API access must:"],
    bullets: [
      "Keep API keys confidential and secure",
      "Not exceed rate limits or abuse the API",
      "Not share API keys with unauthorized parties",
      "Monitor API key usage and deactivate if compromised",
    ],
  },
  {
    heading: "9. Disclaimer of Warranties",
    paragraphs: [
      'The service is provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not guarantee that:',
    ],
    bullets: [
      "The service will be uninterrupted or error-free",
      "The humanized text will meet all your specific requirements",
      "The service will produce perfect results in every case",
      "All errors will be corrected",
    ],
  },
  {
    heading: "10. Limitation of Liability",
    paragraphs: [
      "To the maximum extent permitted by law, HumanifyLab shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.",
    ],
  },
  {
    heading: "11. Changes to Terms",
    paragraphs: [
      "We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the service. Continued use of the service after changes constitutes acceptance of the new terms.",
    ],
  },
  {
    heading: "12. Termination",
    paragraphs: [
      "We may terminate or suspend your account and access to the service immediately, without prior notice, for any breach of these Terms of Service.",
    ],
  },
  {
    heading: "13. Governing Law",
    paragraphs: [
      "These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law provisions.",
    ],
  },
  {
    heading: "14. Contact Information",
    paragraphs: [
      <span key="contact">
        For questions about these Terms of Service, please contact us at{" "}
        <a href="mailto:humanifylab1@gmail.com" className="font-semibold text-[var(--hl-mint-deep)] underline underline-offset-4">
          humanifylab1@gmail.com
        </a>
        . We typically respond within 24 hours.
      </span>,
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="Please read these terms carefully before using HumanifyLab. By using our service, you agree to these terms."
      lastUpdated="November 4, 2025"
      sections={SECTIONS}
      breadcrumbSchema={breadcrumbSchema}
    />
  );
}
