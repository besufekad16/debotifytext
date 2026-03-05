"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { History, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "~/lib/utils";

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
    ]
    : [
      { href: "/", label: "Home" },
      { href: "/pricing", label: "Pricing" },
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
      "after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-emerald-500 after:via-emerald-600 after:to-emerald-700 after:opacity-0 after:transition after:duration-200 after:content-['']",
      isActive && "text-[#5e3d2a] after:opacity-100"
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#f0f9ff] border-b-2 border-[#5e3d2a] shadow-md" style={{ backgroundImage: 'linear-gradient(#eff8ff 1px, transparent 1px), linear-gradient(90deg, #eff8ff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/humanify.png"
            alt="HumanifyLab logo"
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <span className="text-[23px] font-semibold tracking-tight bg-gradient-to-r from-[#5e3d2a] via-[#8b6f47] to-[#5e3d2a] bg-clip-text text-transparent">
            HumanifyLab
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
                  <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                    Team Member
                  </div>
                )}
                {currentCredits !== undefined && (
                  <div className="rounded-full bg-slate-100 px-4 py-1 text-sm font-medium text-slate-600">
                    {currentCredits} credits
                  </div>
                )}
                {onHistoryClick && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onHistoryClick}
                    className="gap-2 rounded-full border-slate-200 text-slate-700 hover:border-slate-300 hover:text-[#5e3d2a]"
                  >
                    <History className="h-4 w-4" />
                    History
                  </Button>
                )}
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                    },
                  }}
                />
              </>
            ) : !isHydrated ? (
              // Show loading state during hydration to prevent layout shift
              <div className="flex items-center gap-3">
                <div className="h-8 w-16 bg-slate-200 rounded-full animate-pulse" />
                <div className="h-8 w-20 bg-slate-200 rounded-full animate-pulse" />
              </div>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost" className="text-muted-foreground hover:text-[#5e3d2a]">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="rounded-full bg-emerald-500 px-5 text-white shadow-[0_12px_28px_-18px_rgba(16,185,129,0.6)] transition hover:bg-emerald-600">
                    Sign Up
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
        <div className="border-t border-[#eff8ff] bg-[#f0f9ff] pb-6 pt-4 shadow-lg lg:hidden" style={{ backgroundImage: 'linear-gradient(#eff8ff 1px, transparent 1px), linear-gradient(90deg, #eff8ff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 text-sm font-medium text-slate-600">
            {navLinks.map((item) => {
              const isActive = variant === "page" ? pathname === item.href : false;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-2 transition",
                    "hover:bg-slate-100",
                    isActive && "bg-slate-100 text-[#5e3d2a]"
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
                  <div className="rounded-lg bg-emerald-50 px-4 py-2 text-center text-sm font-semibold text-emerald-700 border border-emerald-100">
                    Team Member Account
                  </div>
                )}
                {currentCredits !== undefined && (
                  <div className="rounded-lg bg-slate-100 px-4 py-2 text-center text-sm font-semibold text-slate-600">
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
                <div className="h-10 bg-slate-200 rounded-lg animate-pulse" />
                <div className="h-10 bg-slate-200 rounded-lg animate-pulse" />
              </div>
            ) : (
              <div className="mt-2 flex flex-col gap-3">
                <SignInButton mode="modal">
                  <Button variant="outline" className="w-full rounded-lg text-slate-600">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="w-full rounded-lg bg-emerald-500 text-white shadow-[0_12px_24px_-18px_rgba(16,185,129,0.55)] hover:bg-emerald-600">
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
