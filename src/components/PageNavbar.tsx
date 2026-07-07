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

  const baseNavLinks =
    variant === "home"
      ? [
          { href: "/#hero", label: "Home" },
          { href: "/#pricing", label: "Pricing" },
          { href: "/affiliate", label: "Earn 10% 💸" },
          { href: "/faq", label: "FAQ" },
          { href: "/contact", label: "Contact" },
        ]
      : [
          { href: "/", label: "Home" },
          { href: "/pricing", label: "Pricing" },
          { href: "/affiliate", label: "Earn 10% 💸" },
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

  const getLinkClass = (href: string) => {
    const isActive = variant === "page" ? pathname === href : false;
    return cn(
      "relative text-sm font-medium transition-colors",
      "text-muted-foreground hover:text-[#5e3d2a]",
      isActive && "text-[#5e3d2a] font-semibold"
    );
  };

  return (
    <div className="sticky top-0 z-[100] w-full">
      {/* Promo banner — sits ABOVE the navbar */}
      <YearlyDiscountBanner />

      <div className="w-full bg-white border-b border-gray-100">
        <div className="w-full py-3 px-4">
          <nav className="relative mx-auto max-w-6xl bg-white rounded-full border border-gray-200 shadow-sm px-4 sm:px-6">
            <div className="flex h-14 items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                <Image
                  src="/humanify.png"
                  alt="HumanifyLab logo"
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
                <span className="text-base sm:text-lg font-bold tracking-tight text-foreground">
                  Humanify<span className="text-[#5e3d2a]">Lab</span>
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden items-center gap-6 lg:flex">
                <div className="flex items-center gap-5">
                  {navLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={getLinkClass(item.href)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  {isHydrated && isSignedIn ? (
                    <>
                      {isTeamMember && (
                        <span className="rounded-full bg-[#5e3d2a]/10 px-3 py-1 text-xs font-semibold text-[#5e3d2a] border border-[#5e3d2a]/30">
                          Team
                        </span>
                      )}
                      {currentCredits !== undefined && (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600 border border-gray-200">
                          <span className="text-[#5e3d2a] font-bold">{currentCredits}</span> credits
                        </span>
                      )}
                      {onHistoryClick && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={onHistoryClick}
                          className="gap-2 rounded-full text-muted-foreground hover:bg-gray-100 hover:text-[#5e3d2a]"
                        >
                          <History className="h-4 w-4" />
                          History
                        </Button>
                      )}
                      <UserButton
                        appearance={{
                          elements: { avatarBox: "w-9 h-9 border-2 border-white shadow-sm" },
                        }}
                      />
                    </>
                  ) : !isHydrated ? (
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-16 bg-gray-100 rounded-full animate-pulse" />
                      <div className="h-8 w-20 bg-gray-100 rounded-full animate-pulse" />
                    </div>
                  ) : (
                    <>
                      <SignInButton mode="modal">
                        <Button
                          variant="ghost"
                          className="text-muted-foreground hover:text-[#5e3d2a] hover:bg-transparent font-medium"
                        >
                          Sign In
                        </Button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <Button className="rounded-full bg-gradient-to-r from-[#5e3d2a] to-[#8b6f47] px-5 py-2 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:from-[#5e3d2a]/90 hover:to-[#8b6f47]/90">
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
                className="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-[#5e3d2a] lg:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>

            {/* Mobile dropdown — positioned inside the relative nav */}
            {mobileMenuOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl border border-gray-200 bg-white shadow-xl lg:hidden overflow-hidden">
                <div className="flex flex-col p-4 gap-1">
                  {navLinks.map((item) => {
                    const isActive =
                      variant === "page" ? pathname === item.href : false;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-[#5e3d2a]/10 text-[#5e3d2a]"
                            : "text-gray-600 hover:bg-gray-50 hover:text-[#5e3d2a]"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    );
                  })}

                  <div className="mt-3 pt-3 border-t border-gray-100">
                    {isHydrated && isSignedIn ? (
                      <div className="flex flex-col gap-3">
                        {isTeamMember && (
                          <div className="rounded-xl bg-[#5e3d2a]/10 px-4 py-2 text-center text-sm font-semibold text-[#5e3d2a] border border-[#5e3d2a]/20">
                            Team Member Account
                          </div>
                        )}
                        {currentCredits !== undefined && (
                          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 border border-gray-200">
                            <span className="text-sm text-gray-500">Credits</span>
                            <span className="text-sm font-bold text-[#5e3d2a]">{currentCredits}</span>
                          </div>
                        )}
                        {onHistoryClick && (
                          <Button
                            variant="outline"
                            className="w-full gap-2 rounded-xl border-gray-200 hover:border-[#5e3d2a] hover:text-[#5e3d2a] h-11"
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
                        <div className="h-11 bg-gray-100 rounded-xl animate-pulse" />
                        <div className="h-11 bg-gray-100 rounded-xl animate-pulse" />
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        <SignInButton mode="modal">
                          <Button
                            variant="outline"
                            className="w-full rounded-xl h-11 border-gray-200 text-gray-600 hover:border-[#5e3d2a] hover:text-[#5e3d2a]"
                          >
                            Sign In
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
      </div>
    </div>
  );
}
