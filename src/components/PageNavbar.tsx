"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "./ui/button";
import { History, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import LifetimeOfferBar from "./LifetimeOfferBar";

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

  const baseNavLinks = [
    { href: homeBase, label: "Home" },
    { href: "/pricing", label: "Pricing" },
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
      <LifetimeOfferBar />

      <div className="w-full border-b border-black/5 bg-white/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex flex-shrink-0 items-center gap-2.5" aria-label="HumanifyLab home">
            <Image src="/humanify.png" alt="" width={34} height={34} className="h-8 w-8" />
            <span className="text-lg font-bold tracking-tight text-[var(--hl-ink)]">
              Humanify<span className="text-[var(--hl-mint-deep)]">Lab</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                  isActiveLink(item.href)
                    ? "bg-[var(--hl-mint-deep)]/10 text-[var(--hl-mint-deep)]"
                    : "text-gray-600 hover:bg-black/[0.03] hover:text-[var(--hl-ink)]",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            {isHydrated && isSignedIn ? (
              <>
                {isTeamMember && (
                  <span className="rounded-full border border-[var(--hl-mint)]/30 bg-[var(--hl-mint)]/10 px-3 py-1 text-xs font-semibold text-[var(--hl-mint-deep)]">
                    Team
                  </span>
                )}
                {currentCredits !== undefined && (
                  <span className="rounded-full border border-black/5 bg-[var(--hl-surface)] px-3 py-1 text-sm font-medium text-gray-600">
                    <span className="font-bold text-[var(--hl-mint-deep)]">
                      {currentCredits.toLocaleString()}
                    </span>{" "}
                    credits
                  </span>
                )}
                {onHistoryClick && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onHistoryClick}
                    className="gap-2 rounded-xl text-gray-600 hover:bg-black/[0.03] hover:text-[var(--hl-ink)]"
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
                  <Button
                    variant="ghost"
                    className="font-medium text-gray-600 hover:bg-black/[0.03] hover:text-[var(--hl-ink)]"
                  >
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="rounded-2xl bg-[var(--hl-mint-deep)] px-5 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(94,61,42,0.65)] transition-all hover:bg-[var(--hl-mint)]">
                    Get Started Free
                  </Button>
                </SignUpButton>
              </>
            )}
          </div>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl text-gray-600 transition hover:bg-black/[0.04] hover:text-[var(--hl-ink)] lg:hidden"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 top-0 z-40 bg-black/40"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute inset-x-0 top-full z-50 border-b border-black/5 bg-white shadow-2xl">
            <div className="flex flex-col gap-1 p-4">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-2xl px-4 py-3.5 text-sm font-medium transition-colors",
                    isActiveLink(item.href)
                      ? "bg-[var(--hl-mint-deep)]/10 text-[var(--hl-mint-deep)]"
                      : "text-gray-700 hover:bg-[var(--hl-surface)]",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              <div className="mt-3 border-t border-black/5 pt-3">
                {isHydrated && isSignedIn ? (
                  <div className="flex flex-col gap-3">
                    {currentCredits !== undefined && (
                      <div className="flex items-center justify-between rounded-2xl border border-black/5 bg-[var(--hl-surface)] px-4 py-3">
                        <span className="text-sm text-gray-500">Credits</span>
                        <span className="text-sm font-bold text-[var(--hl-mint-deep)]">
                          {currentCredits.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {onHistoryClick && (
                      <Button
                        variant="outline"
                        className="h-11 w-full gap-2 rounded-2xl"
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
                    <div className="h-11 animate-pulse rounded-2xl bg-gray-100" />
                    <div className="h-11 animate-pulse rounded-2xl bg-gray-100" />
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <SignInButton mode="modal">
                      <Button variant="outline" className="h-11 w-full rounded-2xl">
                        Sign In
                      </Button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <Button className="h-11 w-full rounded-2xl bg-[var(--hl-mint-deep)] font-semibold text-white hover:bg-[var(--hl-mint)]">
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
