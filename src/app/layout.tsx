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
    default: "Free AI Humanizer for Students | Bypass Turnitin, GPTZero & All AI Detectors | HumanifyLab",
    template: "%s | HumanifyLab"
  },
  description: "Best free AI humanizer for students & essays. Bypass Turnitin, GPTZero, Originality.AI, ZeroGPT, Copyleaks & all AI detectors. 99.9% undetectable. Perfect for academic writing, essays & assignments. Transform ChatGPT text into human writing. Trusted by 450,000+ students worldwide. Try free!",
  keywords: [
    // Core Brand
    'humanifylab',
    'humanify',
    'humanify lab',
    'humanifylab.com',
    
    // Student-Focused Keywords (TOP PRIORITY)
    'ai humanizer for students',
    'free ai humanizer for students',
    'essay humanizer',
    'essay ai humanizer free',
    'student essay humanizer',
    'college essay humanizer',
    'academic ai humanizer',
    'assignment humanizer',
    'homework humanizer',
    'chatgpt essay humanizer',
    
    // Primary Keywords
    'ai humanizer',
    'humanize ai text',
    'ai text humanizer',
    'free ai humanizer',
    'best ai humanizer',
    'undetectable ai',
    'undetectable ai humanizer',
    
    // AI Detector Bypass (HIGH PRIORITY - STUDENT FOCUSED)
    'bypass turnitin',
    'bypass turnitin ai detection',
    'how to bypass turnitin',
    'bypass gptzero',
    'bypass originality ai',
    'bypass zerogpt',
    'bypass copyleaks',
    'bypass winston ai',
    'bypass content at scale',
    'bypass ai detection',
    'avoid ai detection in essays',
    'beat ai detectors',
    'undetectable to turnitin',
    
    // Specific Detectors
    'originality ai bypass tool',
    'gptzero bypass tool',
    'turnitin ai detection bypass',
    'zerogpt bypass',
    'copyleaks ai bypass',
    
    // AI Tools to Humanize
    'humanize chatgpt',
    'humanize gpt4',
    'humanize claude',
    'humanize gemini',
    'chatgpt humanizer',
    
    // Use Cases
    'essay humanizer',
    'academic writing humanizer',
    'blog humanizer',
    'content humanizer',
    
    // Features
    'natural writing',
    'professional writing',
    'ai text converter',
    'writing enhancement',
    'ai to human text',
    'make ai undetectable'
  ],
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
  icons: [
    { rel: "icon", url: "/humanify.png", type: "image/png" },
    { rel: "apple-touch-icon", url: "/humanify.png" }
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.humanifylab.com",
    siteName: "HumanifyLab",
    title: "Free AI Humanizer for Students | Bypass Turnitin, GPTZero & All AI Detectors",
    description: "Best free AI humanizer for students & essays. Bypass Turnitin, GPTZero, Originality.AI & all AI detectors. Perfect for academic writing. 99.9% undetectable. 450,000+ students trust us.",
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
      "keywords": "ai humanizer, humanize ai text, natural writing, professional writing, free ai humanizer, humanifylab"
    })
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Humanizer for Students | Bypass Turnitin & All AI Detectors",
    description: "Best free AI humanizer for students & essays. Bypass Turnitin, GPTZero, Originality.AI. Perfect for academic writing. 99.9% undetectable. 450,000+ students.",
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
            dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
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
