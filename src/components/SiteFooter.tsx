"use client";
import Link from "next/link";
import Image from "next/image";
import { Twitter, Linkedin } from "lucide-react";

const PRODUCT_LINKS = [
  { label: "AI Humanizer", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Bypass AI Detectors", href: "/bypass-ai-detectors" },
  { label: "Bypass Turnitin", href: "/bypass-turnitin-ai-detection" },
  { label: "Free AI Humanizer", href: "/free-ai-humanizer" },
  { label: "All Guides", href: "/topics" },
];

const REGION_LINKS = [
  { label: "United States", href: "/ai-humanizer-usa" },
  { label: "Canada", href: "/ai-humanizer-canada" },
  { label: "United Kingdom", href: "/ai-humanizer-uk" },
  { label: "Europe", href: "/ai-humanizer-europe" },
  { label: "Australia", href: "/ai-humanizer-australia" },
  { label: "South Africa", href: "/ai-humanizer-south-africa" },
  { label: "Asia", href: "/ai-humanizer-asia" },
];

const COMPANY_LINKS = [
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Responsible Use", href: "/responsible-use" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-[14px] font-medium text-slate-400 transition-colors hover:text-green-400"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-12 lg:gap-8">
          <div className="col-span-2 md:col-span-4">
            <Link href="/" className="mb-6 inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                <Image src="/debotify-logo.png" alt="DebotifyText" width={24} height={24} className="h-6 w-6" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Debotify<span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-500">Text</span>
              </span>
            </Link>
            <p className="mb-8 max-w-xs text-[14px] leading-relaxed text-slate-400 font-medium">
              The modern AI humanizer that rewrites ChatGPT, Claude, and Gemini text into natural writing
              that passes Turnitin, GPTZero, and every major detector.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="https://x.com/debotifytext"
                target="_blank"
                rel="noreferrer"
                className="group flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-all duration-300 hover:border-green-500/50 hover:bg-green-500/10 hover:text-green-400 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/20"
                aria-label="DebotifyText on X (Twitter)"
              >
                <Twitter className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/debotifytext"
                target="_blank"
                rel="noreferrer"
                className="group flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-all duration-300 hover:border-green-500/50 hover:bg-green-500/10 hover:text-green-400 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/20"
                aria-label="DebotifyText on LinkedIn"
              >
                <Linkedin className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              </Link>
            </div>
          </div>

          <div className="md:col-span-3 md:col-start-6">
            <FooterColumn title="Product" links={PRODUCT_LINKS} />
          </div>
          <div className="md:col-span-2">
            <FooterColumn title="Regions" links={REGION_LINKS} />
          </div>
          <div className="md:col-span-2">
            <FooterColumn title="Company" links={COMPANY_LINKS} />
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-800/80 pt-8 sm:flex-row">
          <p className="text-sm font-medium text-slate-500">© {new Date().getFullYear()} DebotifyText. All rights reserved.</p>
          <p className="text-xs font-medium text-slate-500">Built for writers, students, and teams worldwide.</p>
        </div>
      </div>
    </footer>
  );
}
