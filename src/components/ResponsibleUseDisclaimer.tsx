"use client";

import Link from "next/link";
import { AlertCircle, ArrowRight } from "lucide-react";

export default function ResponsibleUseDisclaimer() {
  return (
    <section className="relative w-full py-8 bg-[#faf6f1] border-t border-[rgba(94,61,42,0.28)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-[var(--hl-mint-deep)] flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <p className="text-sm sm:text-base text-[#5A4529] leading-relaxed">
              <span className="font-semibold text-[var(--hl-mint)]">HumanifyLab is not a tool for academic dishonesty or cheating.</span> We encourage responsible use that enhances your work while respecting academic integrity.
            </p>
          </div>

          {/* CTA Button */}
          <div className="flex-shrink-0">
            <Link
              href="/responsible-use"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--hl-mint-deep)] text-white text-sm font-semibold transition-all duration-300 hover:bg-[var(--hl-mint)] hover:gap-3 group"
            >
              Read more
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
