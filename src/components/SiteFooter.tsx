import Link from "next/link";
import Image from "next/image";
import { Twitter, Linkedin } from "lucide-react";

const PRODUCT_LINKS = [
  { label: "Humanizer", href: "/" },
  { label: "Pricing", href: "/pricing" },
  { label: "Bypass AI Detectors", href: "/bypass-ai-detectors" },
  { label: "AI Detector Guide", href: "/ai-detector" },
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
  { label: "Affiliate Program", href: "/affiliate" },
  { label: "Responsible Use", href: "/responsible-use" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/50">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-gray-400 transition-colors hover:text-[#c9a97f]">
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
    <footer className="bg-[#0f1419]">
      <div className="h-1 bg-gradient-to-r from-[#8b6f47] via-[#5e3d2a] to-[#4a2f1f]" />
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4">
            <Link href="/" className="mb-5 inline-flex items-center gap-2.5">
              <Image src="/humanify.png" alt="" width={36} height={36} className="h-9 w-9" />
              <span className="text-xl font-bold text-white">
                Humanify<span className="text-[#8b6f47]">Lab</span>
              </span>
            </Link>
            <p className="mb-6 max-w-xs text-sm leading-relaxed text-gray-400">
              Professional AI humanization that rewrites AI-generated text into natural, authentic writing which
              passes every major AI detector.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="https://x.com/humanifylab"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition-colors hover:border-[#8b6f47] hover:text-[#c9a97f]"
                aria-label="HumanifyLab on X (Twitter)"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/humanifylab"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-gray-400 transition-colors hover:border-[#8b6f47] hover:text-[#c9a97f]"
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
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} HumanifyLab. All rights reserved.</p>
          <p className="text-xs text-gray-600">Built for writers, students, and teams worldwide.</p>
        </div>
      </div>
    </footer>
  );
}
