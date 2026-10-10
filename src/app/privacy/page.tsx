import LegalPage, { type LegalSection } from "~/components/marketing/LegalPage";

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.debotifytext.com" },
    { "@type": "ListItem", position: 2, name: "Privacy Policy", item: "https://www.debotifytext.com/privacy" },
  ],
};

const SECTIONS: LegalSection[] = [
  {
    heading: "1. Information We Collect",
    paragraphs: [
      "We may collect personal information from you in a variety of ways, including, but not limited to, when you visit our site, register on the site, place an order, and in connection with other activities, services, features, or resources we make available.",
    ],
    bullets: [
      <span key="personal"><strong className="text-slate-900">Personal Data:</strong> Personally identifiable information, such as your name, email address, and payment information, that you voluntarily give to us when you register or when you choose to participate in various activities related to the site.</span>,
      <span key="usage"><strong className="text-slate-900">Usage Data:</strong> Information your browser sends whenever you visit our Service or when you access the Service by or through a mobile device.</span>,
    ],
  },
  {
    heading: "2. How We Use Your Information",
    paragraphs: ["We use the information we collect in order to:"],
    bullets: [
      "Provide, operate, and maintain our services.",
      "Improve, personalize, and expand our services.",
      "Understand and analyze how you use our services.",
      "Develop new products, services, features, and functionality.",
      "Communicate with you, either directly or through one of our partners, including for customer service, updates, and marketing.",
      "Process your transactions.",
    ],
  },
  {
    heading: "3. Data Security",
    paragraphs: [
      "We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.",
    ],
  },
  {
    heading: "4. Your Data Protection Rights",
    paragraphs: ["Depending on your location, you may have the following rights regarding your personal data:"],
    bullets: [
      "The right to access — request copies of your personal data.",
      "The right to rectification — request that we correct any information you believe is inaccurate.",
      "The right to erasure — request that we erase your personal data, under certain conditions.",
      "The right to restrict processing — request that we restrict the processing of your personal data, under certain conditions.",
      "The right to object to processing — object to our processing of your personal data, under certain conditions.",
      "The right to data portability — request that we transfer collected data to another organization, or directly to you, under certain conditions.",
    ],
  },
  {
    heading: "5. Cookies and Tracking Technologies",
    paragraphs: [
      "We use cookies and similar tracking technologies to track activity on our service and hold certain information. Cookies are files with a small amount of data which may include an anonymous unique identifier. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.",
    ],
  },
  {
    heading: "6. Third-Party Services",
    paragraphs: [
      "We may use third-party services to help us operate our service and administer activities on our behalf, such as sending out newsletters or surveys. We may share your information with these third parties for those limited purposes provided that you have given us your permission.",
    ],
  },
  {
    heading: "7. Data Retention",
    paragraphs: [
      "We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.",
    ],
  },
  {
    heading: "8. Changes to This Privacy Policy",
    paragraphs: [
      "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.",
    ],
  },
  {
    heading: "9. Children's Privacy",
    paragraphs: [
      "Our service does not address anyone under the age of 18. We do not knowingly collect personally identifiable information from children under 18. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we can take the necessary actions.",
    ],
  },
  {
    heading: "10. Contact Us",
    paragraphs: [
      <span key="contact">
        If you have any questions about this Privacy Policy, contact us at{" "}
        <a href="mailto:debotifytext@gmail.com" className="font-semibold text-green-700 underline underline-offset-4">
          debotifytext@gmail.com
        </a>
        . We typically respond within 24 hours.
      </span>,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="Your privacy matters to us. Learn how we collect, use, and protect your personal information."
      lastUpdated="November 4, 2025"
      sections={SECTIONS}
      breadcrumbSchema={breadcrumbSchema}
    />
  );
}
