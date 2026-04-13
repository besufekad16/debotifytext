"use client";

import { useEffect, useState } from "react";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { History, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import YearlyDiscountBanner from "./YearlyDiscountBanner";

interface ModernNavbarProps {
  onHistoryClick?: () => void;
  currentCredits?: number;
  isTeamMember?: boolean;
}

export default function ModernNavbar({ onHistoryClick, currentCredits, isTeamMember = false }: ModernNavbarProps) {
  const { isSignedIn } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Prevent hydration mismatch by waiting for client-side hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Track scroll position for shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/pricing", label: "Pricing" },
    { href: "/affiliate", label: "Earn 10% 💸" },
    { href: "/faq", label: "FAQ" },
    { href: "/contact", label: "Contact" },
  ];

  // Add Account link if user is signed in - only after hydration to prevent mismatch
  const allNavLinks = (isHydrated && isSignedIn)
    ? [...navLinks, { href: "/account", label: "Account" }]
    : navLinks;

  const getNavLinkClass = (href: string) => {
    const isActive = pathname === href;
    return cn(
      "relative text-sm font-medium transition-colors",
      "text-muted-foreground hover:text-[#5e3d2a]",
      isActive && "text-[#5e3d2a] font-semibold"
    );
  };

  return (
    <div 
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] w-full bg-white/95 backdrop-blur-sm transition-shadow duration-300",
        isScrolled && "shadow-lg"
      )} 
      style={{ position: 'fixed' }}
    >
      <div className="w-full py-4">
        <nav 
          className="mx-auto max-w-6xl bg-white rounded-full border border-gray-200 shadow-sm px-6"
        >
          <div className="flex h-14 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/humanify.png"
            alt="HumanifyLab logo"
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <span className="text-xl font-bold tracking-tight text-foreground">
            Humanify<span className="text-[#5e3d2a]">Lab</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          <div className="flex items-center gap-6">
            {allNavLinks.map((item) => (
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
                  <div className="rounded-full bg-[#5e3d2a]/10 px-3 py-1 text-xs font-semibold text-primary border border-[#5e3d2a]/30">
                    Team
                  </div>
                )}
                {currentCredits !== undefined && (
                  <div className="rounded-full bg-background px-3 py-1 text-sm font-medium text-muted-foreground border border-[#eff8ff]">
                    <span className="text-[#5e3d2a] font-bold">{currentCredits}</span> credits
                  </div>
                )}
                {onHistoryClick && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onHistoryClick}
                    className="gap-2 rounded-full text-muted-foreground hover:bg-background hover:text-[#5e3d2a]"
                  >
                    <History className="h-4 w-4" />
                    History
                  </Button>
                )}
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9 border-2 border-white shadow-sm",
                    },
                  }}
                />
              </>
            ) : !isHydrated ? (
              // Show loading state during hydration to prevent layout shift
              <div className="flex items-center gap-3">
                <div className="h-9 w-20 bg-slate-100 rounded-full animate-pulse" />
              </div>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost" className="text-muted-foreground hover:text-[#5e3d2a] hover:bg-transparent font-medium">
                    Log in
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="rounded-full bg-gradient-to-r from-[#5e3d2a] to-[#8b6f47] px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-[#5e3d2a]/20 transition-all hover:shadow-[#5e3d2a]/30 hover:from-[#5e3d2a]/90 hover:to-[#8b6f47]/90">
                    Get Started Free
                  </Button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground transition hover:bg-background hover:text-[#5e3d2a] lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          className="border-t border-gray-200 bg-white shadow-lg lg:hidden absolute w-full left-0 top-full mt-2 rounded-2xl"
        >
          <div className="mx-auto flex flex-col p-4 space-y-4">
            <div className="flex flex-col space-y-1">
              {allNavLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                      isActive ? "bg-gray-100 text-[#5e3d2a]" : "text-muted-foreground hover:bg-gray-50 hover:text-[#5e3d2a]"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 border-t border-gray-200">
              {isHydrated && isSignedIn ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-sm font-medium text-muted-foreground">Account</span>
                    {isTeamMember && (
                      <span className="rounded-full bg-[#5e3d2a]/20 px-2 py-0.5 text-[10px] font-bold text-[#5e3d2a]">TEAM</span>
                    )}
                  </div>

                  {currentCredits !== undefined && (
                    <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 border border-gray-200">
                      <span className="text-sm text-muted-foreground">Available Credits</span>
                      <span className="text-sm font-bold text-[#5e3d2a]">{currentCredits}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-3">
                    {onHistoryClick && (
                      <Button
                        variant="outline"
                        className="flex-1 gap-2 rounded-xl border-gray-200 hover:border-[#5e3d2a] hover:text-[#5e3d2a] h-11"
                        onClick={() => {
                          onHistoryClick();
                          setMobileMenuOpen(false);
                        }}
                      >
                        <History className="h-4 w-4" />
                        History
                      </Button>
                    )}
                    <div className="flex justify-end">
                      <UserButton />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <SignInButton mode="modal">
                    <Button variant="outline" className="w-full rounded-xl h-11 border-gray-200 text-foreground hover:border-[#5e3d2a] hover:text-[#5e3d2a]">
                      Log in
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button className="w-full rounded-xl h-11 bg-gradient-to-r from-[#5e3d2a] to-[#8b6f47] text-white font-semibold hover:from-[#5e3d2a]/90 hover:to-[#8b6f47]/90 shadow-md">
                      Get Started Free
                    </Button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
    </div>
    <YearlyDiscountBanner />
    </div>
  );
}

