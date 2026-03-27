"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { LoadingButton } from "~/components/ui/loading-button";
import { Button } from "~/components/ui/button";
import { Menu, X, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleNavigation = (path: string) => {
    setLoading(true);
    router.push(path);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-slate-50/95 backdrop-blur supports-[backdrop-filter]:bg-slate-50/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/humanify.png" alt="HumanifyLab Logo" width={35} height={35} className="h-[35px] w-[35px]" />
            <span className="text-[24px] font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-#8B6F47 to-indigo-700 
              bg-clip-text text-transparent drop-shadow-sm">
                HumanifyLab
              </span>
                        </Link>

          <div className="hidden md:flex" />

          <div className="flex items-center gap-3">
            <LoadingButton
              size="sm"
              loading={loading}
              onClick={() => handleNavigation("/")}
              className="cursor-pointer gap-2 bg-[#8B6F47] hover:bg-[#8B6F47]/90"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </LoadingButton>
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-slate-50 border-t border-slate-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3" />
        </div>
      )}
    </nav>
  );
}
