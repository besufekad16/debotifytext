import Link from "next/link";
import Image from "next/image";
import { Twitter, Linkedin } from "lucide-react";

const PRODUCT_LINKS = [
  { label: "AI Humanizer", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Bypass AI Detectors", href: "/bypass-ai-detectors" },
  { label: "Bypass Turnitin", href: "/guides/bypass-turnitin-ai-detection" },
  { label: "Free AI Humanizer", href: "/guides/free-ai-humanizer" },
  { label: "All Guides", href: "/topics" },
];

const REGION_LINKS = [
  { label: "United States", href: "/guides/ai-humanizer-usa" },
  { label: "Canada", href: "/guides/ai-humanizer-canada" },
  { label: "United Kingdom", href: "/guides/ai-humanizer-uk" },
  { label: "Europe", href: "/guides/ai-humanizer-europe" },
  { label: "Australia", href: "/guides/ai-humanizer-australia" },
  { label: "South Africa", href: "/guides/ai-humanizer-south-africa" },
  { label: "Asia", href: "/guides/ai-humanizer-asia" },
];

const COMPANY_LINKS = [
  { label: "Contact", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Affiliate Program", href: "/affiliate" },
  { label: "Responsible Use", href: "/responsible-use" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/45">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-white/55 transition-colors hover:text-[var(--hl-mint-bright)]"
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
    <footer className="bg-[var(--hl-ink)]">
      <div className="h-px bg-gradient-to-r from-transparent via-[var(--hl-mint-bright)] to-transparent" />
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-12 lg:gap-8">
          <div className="col-span-2 md:col-span-4">
            <Link href="/" className="mb-5 inline-flex items-center gap-2.5">
              <Image src="/humanify.png" alt="" width={36} height={36} className="h-9 w-9" />
              <span className="text-xl font-bold text-white">
                Humanify<span className="text-[var(--hl-mint-bright)]">Lab</span>
              </span>
            </Link>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-white/55">
              The modern AI humanizer that rewrites ChatGPT, Claude, and Gemini text into natural writing
              that passes Turnitin, GPTZero, and every major detector.
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="https://x.com/humanifylab"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/50 transition-colors hover:border-[var(--hl-mint)] hover:text-[var(--hl-mint-bright)]"
                aria-label="HumanifyLab on X (Twitter)"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/humanifylab"
                target="_blank"
                rel="noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/50 transition-colors hover:border-[var(--hl-mint)] hover:text-[var(--hl-mint-bright)]"
                aria-label="HumanifyLab on LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
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

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-white/40">© {new Date().getFullYear()} HumanifyLab. All rights reserved.</p>
          <p className="text-xs text-white/30">Built for writers, students, and teams worldwide.</p>
        </div>
      </div>
    </footer>
  );
}
