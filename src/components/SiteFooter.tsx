import Image from "next/image";
import Link from "next/link";
import { Twitter, Linkedin, Github } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-[#0f1419]">
      <div className="h-1 bg-gradient-to-r from-[#8b6f47] via-[#5e3d2a] to-[#4a2f1f]"></div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8">
          
          {/* Logo Section */}
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#8b6f47] to-[#5e3d2a] flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-[15px] font-bold text-white">
                Humanify<span className="text-[#5e3d2a]">Lab</span>
              </span>
            </Link>
            <p className="text-[13px] text-gray-500 leading-relaxed max-w-md">
              Enterprise-grade AI humanization technology. Transform AI-generated content into authentic, professional writing that meets professional quality standards.
            </p>
          </div>

          {/* Product Column */}
          <div className="md:col-span-3 md:col-start-7">
            <h3 className="text-[12px] font-semibold text-white/70 uppercase tracking-widest mb-3">Product</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-gray-400 hover:text-[#5e3d2a] transition-colors">
                  Humanizer
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-[#5e3d2a] transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-gray-400 hover:text-[#5e3d2a] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-[#5e3d2a] transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="md:col-span-3">
            <h3 className="text-[12px] font-semibold text-white/70 uppercase tracking-widest mb-3">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-[#5e3d2a] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/responsible-use" className="text-gray-400 hover:text-[#5e3d2a] transition-colors">
                  Responsible Use
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-[#5e3d2a] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-[#5e3d2a] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} HumanifyLab. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link 
              href="https://x.com/humanifylab" 
              target="_blank" 
              rel="noreferrer" 
              className="text-gray-500 hover:text-[#5e3d2a] transition-colors"
            >
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer" 
              className="text-gray-500 hover:text-[#5e3d2a] transition-colors"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">Github</span>
            </Link>
            <Link 
              href="https://www.linkedin.com/company/humanifylab" 
              target="_blank" 
              rel="noreferrer" 
              className="text-gray-500 hover:text-[#5e3d2a] transition-colors"
            >
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
