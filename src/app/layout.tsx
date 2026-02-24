import "../styles/globals.css";

import { type Metadata } from "next";
import keywords from "../keywords";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import CookieConsent from "~/components/CookieConsent";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.humanifylab.com'),
  title: {
    default: "Professional AI Humanizer - Advanced Detection Bypass | HumanifyLab",
    template: "%s | HumanifyLab"
  },
  description: "Enterprise-grade AI humanization technology. Transform AI-generated content into authentic human writing with 98.7% detection bypass success. Trusted by professionals worldwide.",
  keywords,
  authors: [{ name: "HumanifyLab" }],
  creator: "HumanifyLab",
  publisher: "HumanifyLab",
  alternates: {
    canonical: "https://www.humanifylab.com",
  },
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
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.humanifylab.com",
    siteName: "HumanifyLab",
    title: "Professional AI Humanizer - Advanced Detection Bypass | HumanifyLab",
    description: "Enterprise-grade AI humanization technology. Transform AI-generated content into authentic human writing. 98.7% detection bypass success.",
    images: [
      {
        url: "/forOpenGraph.png",
        width: 1200,
        height: 630,
        alt: "HumanifyLab - Professional AI Humanization Technology"
      }
    ]
  },
  other: {
    'application/ld+json': JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "HumanifyLab",
      "url": "https://www.humanifylab.com",
      "keywords": keywords
    })
  },
  twitter: {
    card: "summary_large_image",
    title: "Professional AI Humanizer - Advanced Detection Bypass | HumanifyLab",
    description: "Enterprise-grade AI humanization technology. Transform AI-generated content into authentic human writing. 98.7% detection bypass success.",
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
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "HumanifyLab",
    "url": "https://www.humanifylab.com",
    "description": "Enterprise-grade AI humanization technology for transforming AI-generated content into authentic, professional human writing.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.humanifylab.com/?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    },
    "sameAs": [
      "https://x.com/humanifylab",
      "https://www.linkedin.com/company/humanifylab"
    ]
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "HumanifyLab",
    "url": "https://www.humanifylab.com",
    "logo": "https://www.humanifylab.com/humanify.png",
    "description": "Professional AI humanization technology for transforming AI-generated content into authentic, human-like writing.",
    "email": "humanifylab1@gmail.com",
    "sameAs": [
      "https://x.com/humanifylab",
      "https://www.linkedin.com/company/humanifylab"
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
          {/* Google Search Console Verification */}
          <meta name="google-site-verification" content="google11bdb4ff94bca264.html" />
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
          <title>Professional AI Humanizer - Advanced Detection Bypass | HumanifyLab</title>
          <link rel="canonical" href="https://www.humanifylab.com" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap" rel="stylesheet" />
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
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          />
          {children}
          <CookieConsent />
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
