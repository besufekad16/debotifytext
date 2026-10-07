"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "~/components/ui/button";

export default function NotFound() {
  return (
    <div className="h-screen relative overflow-hidden bg-slate-50 flex items-center justify-center px-4">

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-xl text-center">
        {/* 404 Number */}
        <div className="mb-4">
          <h1 className="text-[3rem] sm:text-[4rem] font-bold text-green-700 leading-none">
            404
          </h1>
        </div>

        {/* GIF */}
        <div className="mb-5 flex justify-center">
          <div className="relative h-40 w-40 sm:h-48 sm:w-48 md:h-56 md:w-56 flex-shrink-0">
            <Image
              src="/debotify-logo.png"
              alt="DebotifyText"
              fill
              className="object-contain"
              priority
              unoptimized
              sizes="(max-width: 640px) 160px, (max-width: 768px) 192px, 224px"
            />
          </div>
        </div>

        {/* Title and Description */}
        <div className="mb-6">
          <h2 className="text-[1.2rem] sm:text-[1.4rem] font-semibold text-slate-900 mb-1.5">
            Page Not Found
          </h2>
          <p className="text-[13px] text-gray-400 max-w-sm mx-auto leading-relaxed">
            The page you&apos;re looking for seems to have drifted away like a bubble in the wind.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5">
          <Link href="/">
            <Button
              size="lg"
              className="rounded-full bg-green-700 px-5 py-4 text-sm font-semibold text-white shadow-[0_12px_24px_-8px_rgba(21,128,61,0.45)] transition-all hover:bg-green-600 hover:shadow-[0_14px_28px_-10px_rgba(21,128,61,0.55)] hover:scale-105"
            >
              Go to Homepage
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full border-2 border-slate-200 bg-white/90 px-5 py-4 text-sm font-semibold text-slate-700 hover:border-green-700/30 hover:bg-white hover:scale-105 transition-all"
            onClick={() => window.history.back()}
          >
            Go Back
          </Button>
        </div>

        {/* Quick Links */}
        <div className="pt-4 border-t border-slate-200/60">
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm">
            <Link
              href="/pricing"
              className="text-slate-600 hover:text-green-600 font-medium transition-colors"
            >
              Pricing
            </Link>
            <span className="text-slate-300">•</span>
            <Link
              href="/contact"
              className="text-slate-600 hover:text-green-600 font-medium transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
