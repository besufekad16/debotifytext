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

export default function PageNavbar({ onHistoryClick, currentCredits, variant = "page", isTeamMember = false }: PageNavbarProps) {
  const { isSignedIn } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const pathname = usePathname();

  // Prevent hydration mismatch by waiting for client-side hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Navigation links based on variant
  const baseNavLinks = variant === "home"
    ? [
      { href: "/#hero", label: "Home" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ]
    : [
      { href: "/", label: "Home" },
      { href: "/pricing", label: "Pricing" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ];

  // Add Account link if user is signed in (after Pricing) - only after hydration to prevent mismatch
  const navLinks = (isHydrated && isSignedIn && variant === "page")
    ? [...baseNavLinks.slice(0, 2), { href: "/account", label: "Account" }, ...baseNavLinks.slice(2)]
    : baseNavLinks;

  const getNavLinkClass = (href: string) => {
    const isActive = variant === "page"
      ? pathname === href
      : false; // For home page, active state is handled differently

    return cn(
      "relative px-1 pb-1 text-sm font-medium transition-colors",
      "text-muted-foreground hover:text-[#5e3d2a]",
      "after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-#F5E6D30 after:via-#6D5635 after:to-#5A4529 after:opacity-0 after:transition after:duration-200 after:content-['']",
      isActive && "text-[#5e3d2a] after:opacity-100"
    );
  };

  return (
    <div className="sticky top-0 z-[100] w-full bg-white/95 backdrop-blur-sm" style={{ position: 'sticky' }}>
    <div className="w-full py-4">
    <nav className="mx-auto max-w-6xl bg-white rounded-full border border-gray-200 shadow-sm px-6">
      <div className="flex h-14 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/humanify.png"
            alt="HumanifyLab logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="text-lg font-bold tracking-tight text-foreground">
            Humanify<span className="text-[#5e3d2a]">Lab</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          <div className="flex items-center gap-6">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={getNavLinkClass(item.href)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {isHydrated && isSignedIn ? (
              <>
                {isTeamMember && (
                  <div className="rounded-full bg-#D4C4B0 px-3 py-1 text-xs font-semibold text-#5A4529 border border-#A0826D">
                    Team Member
                  </div>
                )}
                {currentCredits !== undefined && (
                  <div className="rounded-full bg-gray-100 px-4 py-1 text-sm font-medium text-gray-600">
                    {currentCredits} credits
                  </div>
                )}
                {onHistoryClick && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onHistoryClick}
                    className="gap-2 rounded-full border-gray-200 text-gray-700 hover:border-gray-300 hover:text-[#5e3d2a]"
                  >
                    <History className="h-4 w-4" />
                    History
                  </Button>
                )}
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9",
                    },
                  }}
                />
              </>
            ) : !isHydrated ? (
              // Show loading state during hydration to prevent layout shift
              <div className="flex items-center gap-3">
                <div className="h-8 w-16 bg-gray-200 rounded-full animate-pulse" />
                <div className="h-8 w-20 bg-gray-200 rounded-full animate-pulse" />
              </div>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost" className="text-muted-foreground hover:text-[#5e3d2a]">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="rounded-full bg-gradient-to-r from-[#5e3d2a] to-[#8b6f47] px-5 text-white shadow-sm transition hover:shadow-md">
                    Get Started
                  </Button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex items-center rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 bg-white pb-6 pt-4 shadow-lg lg:hidden rounded-2xl mt-2 absolute w-full left-0">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm font-medium text-gray-600">
            {navLinks.map((item) => {
              const isActive = variant === "page" ? pathname === item.href : false;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-2 transition",
                    "hover:bg-gray-100",
                    isActive && "bg-gray-100 text-[#5e3d2a]"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}

            {isHydrated && isSignedIn ? (
              <div className="mt-2 flex flex-col gap-3">
                {isTeamMember && (
                  <div className="rounded-lg bg-#F5E6D3 px-4 py-2 text-center text-sm font-semibold text-#5A4529 border border-#D4C4B0">
                    Team Member Account
                  </div>
                )}
                {currentCredits !== undefined && (
                  <div className="rounded-lg bg-gray-100 px-4 py-2 text-center text-sm font-semibold text-gray-600">
                    {currentCredits} credits left
                  </div>
                )}
                {onHistoryClick && (
                  <Button
                    variant="outline"
                    className="w-full gap-2 rounded-lg"
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
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "w-10 h-10",
                      },
                    }}
                  />
                </div>
              </div>
            ) : !isHydrated ? (
              // Show loading state during hydration
              <div className="mt-2 flex flex-col gap-3">
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
                <div className="h-10 bg-gray-200 rounded-lg animate-pulse" />
              </div>
            ) : (
              <div className="mt-2 flex flex-col gap-3">
                <SignInButton mode="modal">
                  <Button variant="outline" className="w-full rounded-lg text-gray-600">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="w-full rounded-lg bg-gradient-to-r from-[#5e3d2a] to-[#8b6f47] text-white shadow-sm hover:shadow-md">
                    Get Started
                  </Button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
    </div>
    <YearlyDiscountBanner />
    </div>
  );
}
