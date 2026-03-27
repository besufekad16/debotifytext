import Image from "next/image";
import Link from "next/link";
import { Twitter, Linkedin, Github } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-[#0f1419]">
      <div className="h-2 bg-gradient-to-r from-[#8b6f47] via-[#5e3d2a] to-[#4a2f1f]"></div>
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-20 sm:py-24 lg:py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-16">
          
          {/* Logo Section */}
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-3 mb-8">
              <div className="h-14 w-14 bg-gradient-to-br from-[#8b6f47] to-[#5e3d2a] flex items-center justify-center">
                <span className="text-white font-bold text-2xl">H</span>
              </div>
              <span className="text-2xl font-bold text-white">
                Humanify<span className="text-[#8b6f47]">Lab</span>
              </span>
            </Link>
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-md mb-8">
              Enterprise-grade AI humanization technology. Transform AI-generated content into authentic, professional writing that meets professional quality standards.
            </p>
            
            {/* Social Links - Larger */}
            <div className="flex items-center gap-6">
              <Link 
                href="https://x.com/humanifylab" 
                target="_blank" 
                rel="noreferrer" 
                className="text-gray-500 hover:text-[#8b6f47] transition-colors"
              >
                <Twitter className="h-7 w-7" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link 
                href="https://github.com" 
                target="_blank" 
                rel="noreferrer" 
                className="text-gray-500 hover:text-[#8b6f47] transition-colors"
              >
                <Github className="h-7 w-7" />
                <span className="sr-only">Github</span>
              </Link>
              <Link 
                href="https://www.linkedin.com/company/humanifylab" 
                target="_blank" 
                rel="noreferrer" 
                className="text-gray-500 hover:text-[#8b6f47] transition-colors"
              >
                <Linkedin className="h-7 w-7" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          {/* Product Column */}
          <div className="md:col-span-3 md:col-start-7">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Product</h3>
            <ul className="space-y-4 text-base">
              <li>
                <Link href="/" className="text-gray-400 hover:text-[#8b6f47] transition-colors">
                  Humanizer
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-[#8b6f47] transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-gray-400 hover:text-[#8b6f47] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-[#8b6f47] transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Company</h3>
            <ul className="space-y-4 text-base">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-[#8b6f47] transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/responsible-use" className="text-gray-400 hover:text-[#8b6f47] transition-colors">
                  Responsible Use
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-[#8b6f47] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-[#8b6f47] transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t-2 border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-base text-gray-500">
            © {new Date().getFullYear()} HumanifyLab. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
