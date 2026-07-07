import "../styles/globals.css";

import { type Metadata } from "next";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import CookieConsent from "~/components/CookieConsent";
import { TooltipProvider } from "~/components/ui/tooltip";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.humanifylab.com'),
  title: {
    default: "AI Humanizer — Humanize AI Text & Bypass AI Detectors | HumanifyLab",
    template: "%s | HumanifyLab"
  },
  description: "HumanifyLab is a professional AI humanizer that rewrites ChatGPT, Claude & Gemini text into natural human writing that passes Turnitin, GPTZero, Originality.ai and every major AI detector. Free to try — no sign-up required.",
  keywords: [
    'humanifylab',
    'ai humanizer',
    'humanize ai text',
    'ai text humanizer',
    'free ai humanizer',
    'best ai humanizer',
    'undetectable ai',
    'bypass ai detection',
    'bypass turnitin ai detection',
    'bypass gptzero',
    'humanize chatgpt text',
    'ai to human text converter',
    'essay humanizer',
  ],
  authors: [{ name: "HumanifyLab" }],
  creator: "HumanifyLab",
  publisher: "HumanifyLab",
  applicationName: "HumanifyLab",
  category: "Technology",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: [
    { rel: "icon", url: "/humanify.png", type: "image/png" },
    { rel: "apple-touch-icon", url: "/humanify.png" }
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.humanifylab.com",
    siteName: "HumanifyLab",
    title: "AI Humanizer — Humanize AI Text & Bypass AI Detectors | HumanifyLab",
    description: "Rewrite ChatGPT, Claude & Gemini text into natural human writing that passes Turnitin, GPTZero, Originality.ai and every major AI detector. Free to try.",
    images: [
      {
        url: "/forOpenGraph.png",
        width: 1200,
        height: 630,
        alt: "HumanifyLab — Professional AI Humanizer"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Humanizer — Humanize AI Text & Bypass AI Detectors | HumanifyLab",
    description: "Rewrite ChatGPT, Claude & Gemini text into natural human writing that passes Turnitin, GPTZero, Originality.ai and every major AI detector. Free to try.",
    images: ["/forOpenGraph.png"],
    site: "@humanifylab",
    creator: "@humanifylab",
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: {
      'msvalidate.01': '3178076F587E8E4C2D782D2DCE659D9C'
    }
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const siteGraphSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.humanifylab.com/#website",
        "name": "HumanifyLab",
        "url": "https://www.humanifylab.com",
        "description": "Professional AI humanizer that transforms AI-generated content into natural, human-like writing that passes AI detection.",
        "publisher": { "@id": "https://www.humanifylab.com/#organization" },
        "inLanguage": "en-US"
      },
      {
        "@type": "Organization",
        "@id": "https://www.humanifylab.com/#organization",
        "name": "HumanifyLab",
        "url": "https://www.humanifylab.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.humanifylab.com/humanify.png"
        },
        "description": "HumanifyLab builds professional AI humanization technology that rewrites AI-generated text into authentic, human-like writing.",
        "email": "humanifylab1@gmail.com",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer support",
          "email": "humanifylab1@gmail.com",
          "url": "https://www.humanifylab.com/contact"
        },
        "sameAs": [
          "https://x.com/humanifylab",
          "https://www.linkedin.com/company/humanifylab"
        ]
      }
    ]
  };

  return (
    <ClerkProvider>
      <html lang="en" className={`font-sans ${GeistSans.variable}`}>
        <head>
          {/* Google Analytics */}
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-6C1TZBERFK"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-6C1TZBERFK');
              `,
            }}
          />
          {/* End Google Analytics */}
          {/* Google Tag Manager */}
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TK39PV2F');`,
            }}
          />
          {/* End Google Tag Manager */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Caveat:wght@400;500;600;700&display=swap" rel="stylesheet" />
        </head>
        <body suppressHydrationWarning className="overflow-x-hidden">
          {/* Google Tag Manager (noscript) */}
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-TK39PV2F"
              height="0"
              width="0"
              style={{display: 'none', visibility: 'hidden'}}
            />
          </noscript>
          {/* End Google Tag Manager (noscript) */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(siteGraphSchema) }}
          />
          <TooltipProvider>
            {children}
          </TooltipProvider>
          <CookieConsent />
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
