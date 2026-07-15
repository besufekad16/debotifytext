"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { History, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "~/lib/utils";
import YearlyDiscountBanner from "./YearlyDiscountBanner";

interface PageNavbarProps {
  onHistoryClick?: () => void;
  currentCredits?: number;
  variant?: "home" | "page";
  isTeamMember?: boolean;
}

export default function PageNavbar({
  onHistoryClick,
  currentCredits,
  variant = "page",
  isTeamMember = false,
}: PageNavbarProps) {
  const { isSignedIn } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const homeBase = variant === "home" ? "/#hero" : "/";
  const pricingBase = variant === "home" ? "/#pricing" : "/pricing";

  const baseNavLinks = [
    { href: homeBase, label: "Home" },
    { href: pricingBase, label: "Pricing" },
    { href: "/topics", label: "Guides" },
    { href: "/affiliate", label: "Affiliates" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ];

  const navLinks =
    isHydrated && isSignedIn && variant === "page"
      ? [
          ...baseNavLinks.slice(0, 2),
          { href: "/account", label: "Account" },
          ...baseNavLinks.slice(2),
        ]
      : baseNavLinks;

  const isActiveLink = (href: string) => variant === "page" && pathname === href;

  return (
    <header className="sticky top-0 z-[100] w-full">
      <YearlyDiscountBanner />

      <div className="w-full border-b border-gray-200/80 bg-white/90 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex flex-shrink-0 items-center gap-2.5" aria-label="HumanifyLab home">
            <Image src="/humanify.png" alt="" width={34} height={34} className="h-8 w-8" />
            <span className="text-lg font-bold tracking-tight text-gray-900">
              Humanify<span className="text-[#5e3d2a]">Lab</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActiveLink(item.href)
                    ? "text-[#5e3d2a]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-[#5e3d2a]",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden items-center gap-3 lg:flex">
            {isHydrated && isSignedIn ? (
              <>
                {isTeamMember && (
                  <span className="rounded-full border border-[#5e3d2a]/25 bg-[#5e3d2a]/5 px-3 py-1 text-xs font-semibold text-[#5e3d2a]">
                    Team
                  </span>
                )}
                {currentCredits !== undefined && (
                  <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm font-medium text-gray-600">
                    <span className="font-bold text-[#5e3d2a]">{currentCredits.toLocaleString()}</span> credits
                  </span>
                )}
                {onHistoryClick && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onHistoryClick}
                    className="gap-2 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-[#5e3d2a]"
                  >
                    <History className="h-4 w-4" />
                    History
                  </Button>
                )}
                <UserButton appearance={{ elements: { avatarBox: "w-9 h-9" } }} />
              </>
            ) : !isHydrated ? (
              <div className="flex items-center gap-3">
                <div className="h-9 w-16 animate-pulse rounded-lg bg-gray-100" />
                <div className="h-9 w-32 animate-pulse rounded-xl bg-gray-100" />
              </div>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost" className="font-medium text-gray-600 hover:bg-gray-50 hover:text-[#5e3d2a]">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="rounded-xl bg-[#5e3d2a] px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#4a2f1f] hover:shadow-md">
                    Get Started Free
                  </Button>
                </SignUpButton>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100 hover:text-[#5e3d2a] lg:hidden"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 top-0 z-40 bg-black/30"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 top-full z-50 border-b border-gray-200 bg-white shadow-lg">
            <div className="flex flex-col gap-1 p-4">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                    isActiveLink(item.href)
                      ? "bg-[#5e3d2a]/5 text-[#5e3d2a]"
                      : "text-gray-700 hover:bg-gray-50 hover:text-[#5e3d2a]",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <div className="mt-3 border-t border-gray-100 pt-3">
                {isHydrated && isSignedIn ? (
                  <div className="flex flex-col gap-3">
                    {isTeamMember && (
                      <div className="rounded-xl border border-[#5e3d2a]/20 bg-[#5e3d2a]/5 px-4 py-2 text-center text-sm font-semibold text-[#5e3d2a]">
                        Team Member
                      </div>
                    )}
                    {currentCredits !== undefined && (
                      <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
                        <span className="text-sm text-gray-500">Credits</span>
                        <span className="text-sm font-bold text-[#5e3d2a]">{currentCredits.toLocaleString()}</span>
                      </div>
                    )}
                    {onHistoryClick && (
                      <Button
                        variant="outline"
                        className="h-11 w-full gap-2 rounded-xl border-gray-200 hover:border-[#5e3d2a] hover:text-[#5e3d2a]"
                        onClick={() => {
                          onHistoryClick();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <History className="h-4 w-4" />
                        History
                      </Button>
                    )}
                    <div className="flex justify-center pt-1">
                      <UserButton appearance={{ elements: { avatarBox: "w-10 h-10" } }} />
                    </div>
                  </div>
                ) : !isHydrated ? (
                  <div className="flex flex-col gap-3">
                    <div className="h-11 animate-pulse rounded-xl bg-gray-100" />
                    <div className="h-11 animate-pulse rounded-xl bg-gray-100" />
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <SignInButton mode="modal">
                      <Button
                        variant="outline"
                        className="h-11 w-full rounded-xl border-gray-200 text-gray-700 hover:border-[#5e3d2a] hover:text-[#5e3d2a]"
                      >
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button className="h-11 w-full rounded-xl bg-[#5e3d2a] font-semibold text-white hover:bg-[#4a2f1f]">
                        Get Started Free
                      </Button>
                    </SignUpButton>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
