import "../styles/globals.css";

import { type Metadata } from "next";
import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";
import { GeistSans } from "geist/font/sans";
import CookieConsent from "~/components/CookieConsent";
import { TooltipProvider } from "~/components/ui/tooltip";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.debotifytext.com'),
  title: {
    default: "AI Humanizer: Humanize AI Text & Bypass AI Detectors | DebotifyText",
    template: "%s | DebotifyText"
  },
  description: "Use DebotifyText's AI humanizer tool to humanize AI text and easily bypass AI detectors like Turnitin and GPTZero. Rewrite ChatGPT content to 100% human for free.",
  keywords: [
    'debotifytext',
    'debotify',
    'debotify ai',
    'debotify text',
    'debotifytext humanizer',
    'debitify',
    'debitifytext',
    'debitify text',
    'unrobotictext',
    'unrobotic text',
    'ai humanizer',
    'humanize ai',
    'text humanizer',
    'humanizer ai',
    'ai rewriter',
    'ai rewriting',
    'content humanizer',
    'ai paraphraser',
    'rewrite ai',
    'clarity bubble',
    'claritybubble',
    'clarity ai',
    'humanize ai text',
    'ai text humanizer',
    'free ai humanizer',
    'best ai humanizer',
    'undetectable ai',
    'ai detector bypass',
    'bypass turnitin ai detection',
    'bypass gptzero',
    'humanize chatgpt text',
    'ai to human text converter',
    'essay humanizer',
  ],
  authors: [{ name: "DebotifyText" }],
  creator: "DebotifyText",
  publisher: "DebotifyText",
  applicationName: "DebotifyText",
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
    { rel: "icon", url: "/debotify-logo.png", type: "image/png" },
    { rel: "apple-touch-icon", url: "/debotify-logo.png" }
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.debotifytext.com",
    siteName: "DebotifyText",
    title: "AI Humanizer — Humanize AI Text & Bypass AI Detectors | DebotifyText",
    description: "Rewrite ChatGPT, Claude & Gemini text into natural human writing that passes Turnitin, GPTZero, Originality.ai and every major AI detector. Free to try.",
    images: [
      {
        url: "/forOpenGraph.jpg",
        width: 1200,
        height: 630,
        alt: "DebotifyText — Professional AI Humanizer"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Humanizer — Humanize AI Text & Bypass AI Detectors | DebotifyText",
    description: "Rewrite ChatGPT, Claude & Gemini text into natural human writing that passes Turnitin, GPTZero, Originality.ai and every major AI detector. Free to try.",
    images: ["/forOpenGraph.jpg"],
    site: "@debotifytext",
    creator: "@debotifytext",
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
        "@id": "https://www.debotifytext.com/#website",
        "name": "DebotifyText",
        "url": "https://www.debotifytext.com",
        "description": "Professional AI humanizer that transforms AI-generated content into natural, human-like writing that passes AI detection.",
        "publisher": { "@id": "https://www.debotifytext.com/#organization" },
        "inLanguage": "en-US"
      },
      {
        "@type": "Organization",
        "@id": "https://www.debotifytext.com/#organization",
        "name": "DebotifyText",
        "url": "https://www.debotifytext.com",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.debotifytext.com/debotify-logo.png"
        },
        "alternateName": [
          "Debotify",
          "Debotify Text",
          "DebotifyText AI Humanizer",
          "Debitify",
          "DebitifyText",
          "Debitify Text",
          "DebotifyText Humanizer",
          "UnroboticText",
          "Unrobotic Text",
          "Clarity Bubble Alternative"
        ],
        "description": "DebotifyText (also searched as Debotify, Debitify, DebitifyText, and UnroboticText) is the leading free AI text humanizer and undetectable rewriter. It converts ChatGPT, Claude, and Gemini text into natural human writing that bypasses Turnitin, GPTZero, and Originality.ai.",
        "email": "debotifytext@gmail.com",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer support",
          "email": "debotifytext@gmail.com",
          "url": "https://www.debotifytext.com/contact"
        },
        "sameAs": [
          "https://x.com/debotifytext",
          "https://www.linkedin.com/company/debotifytext",
          "https://www.facebook.com/debotifytext",
          "https://www.instagram.com/debotifytext",
          "https://www.youtube.com/@debotifytext"
        ]
      }
    ]
  };

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_Y2xlcmsuZGVib3RpZnl0ZXh0LmNvbSQ"}
      appearance={{ variables: { colorPrimary: "#15803D" } }}
    >
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
          <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
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
