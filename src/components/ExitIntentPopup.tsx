"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Zap, ShieldCheck, Infinity as InfinityIcon } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const EXIT_INTENT_SHOWN_KEY = "exit_intent_shown_v1";
const EXIT_INTENT_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours

export default function ExitIntentPopup() {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    // Check if we've shown the popup recently
    const checkCooldown = () => {
      try {
        const lastShown = localStorage.getItem(EXIT_INTENT_SHOWN_KEY);
        if (lastShown) {
          const timeSince = Date.now() - parseInt(lastShown, 10);
          if (timeSince < EXIT_INTENT_COOLDOWN) {
            setHasShown(true);
            return true;
          }
        }
        return false;
      } catch {
        return false;
      }
    };

    if (checkCooldown()) return;

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse leaves from the top of the page
      if (e.clientY <= 0 && !hasShown && !isVisible) {
        setIsVisible(true);
        setHasShown(true);
        
        // Store timestamp
        try {
          localStorage.setItem(EXIT_INTENT_SHOWN_KEY, Date.now().toString());
        } catch {
          // Ignore storage errors
        }
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hasShown, isVisible]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsClosing(false);
    }, 300);
  };

  const handleCTA = () => {
    handleClose();
    // Scroll to pricing section
    const pricingSection = document.getElementById("pricing");
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/#pricing");
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
      />

      {/* Popup */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4 transition-all duration-300 ${
          isClosing ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white transition-colors shadow-lg"
            aria-label="Close popup"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>

          {/* Content */}
          <div className="relative">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#faf7f4] via-white to-[#f5f0eb]" />
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#8B6F47]/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4A855]/5 rounded-full blur-3xl" />

            {/* Main content */}
            <div className="relative px-8 py-12 sm:px-12 sm:py-16">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#E8B84B] to-[#C8922A] flex items-center justify-center shadow-lg">
                    <Sparkles className="h-10 w-10 text-[#1a0e00]" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center animate-pulse">
                    <span className="text-white text-xs font-bold">🔥</span>
                  </div>
                </div>
              </div>

              {/* Headline */}
              <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-4 leading-tight">
                Wait! Don't Miss Out
              </h2>
              
              <p className="text-center text-gray-600 text-lg mb-8 max-w-xl mx-auto">
                Join <span className="font-bold text-[#5e3d2a]">500,000+ students</span> who trust HumanifyLab for undetectable AI writing
              </p>

              {/* Special Offer Box */}
              <div className="bg-gradient-to-br from-[#2a1a06] via-[#3d2508] to-[#2e1c07] rounded-2xl p-6 sm:p-8 mb-8 border-2 border-[#D4A855]/60 shadow-xl">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <InfinityIcon className="h-6 w-6 text-[#E8B84B]" />
                  <h3 className="text-2xl font-bold text-white">Limited Time Offer</h3>
                </div>
                
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-white/60 text-2xl line-through">$150</span>
                    <span className="text-5xl font-black text-[#E8B84B]">$100</span>
                    <span className="text-white/80 text-lg">/ 2 months</span>
                  </div>
                  <p className="text-[#E8B84B] text-sm font-semibold">
                    Save $50 — Unlimited words for 2 full months
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 mb-6">
                  <div className="flex items-start gap-2 text-white/90 text-sm">
                    <ShieldCheck className="h-4 w-4 text-[#E8B84B] mt-0.5 flex-shrink-0" />
                    <span>Unlimited humanization</span>
                  </div>
                  <div className="flex items-start gap-2 text-white/90 text-sm">
                    <ShieldCheck className="h-4 w-4 text-[#E8B84B] mt-0.5 flex-shrink-0" />
                    <span>No daily limits</span>
                  </div>
                  <div className="flex items-start gap-2 text-white/90 text-sm">
                    <ShieldCheck className="h-4 w-4 text-[#E8B84B] mt-0.5 flex-shrink-0" />
                    <span>Priority processing</span>
                  </div>
                  <div className="flex items-start gap-2 text-white/90 text-sm">
                    <ShieldCheck className="h-4 w-4 text-[#E8B84B] mt-0.5 flex-shrink-0" />
                    <span>Cancel anytime</span>
                  </div>
                </div>

                <div className="bg-orange-500/20 border border-orange-400/30 rounded-lg p-3 text-center">
                  <p className="text-orange-200 text-sm font-semibold flex items-center justify-center gap-2">
                    <Zap className="h-4 w-4" />
                    Only 14 spots left at this price!
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleCTA}
                  className="px-8 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                  style={{
                    background: 'linear-gradient(135deg, #E8B84B 0%, #C8922A 50%, #A87020 100%)',
                    color: '#1a0e00',
                    boxShadow: '0 4px 20px rgba(212,168,85,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
                  }}
                >
                  <Zap className="h-5 w-5" />
                  Claim This Offer Now
                </button>
                
                <button
                  onClick={handleClose}
                  className="px-8 py-4 rounded-xl font-semibold text-lg text-gray-600 hover:text-gray-800 transition-colors"
                >
                  No thanks, I'll pay full price
                </button>
              </div>

              {/* Trust badges */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-[#5e3d2a]" />
                    Secure checkout
                  </span>
                  <span className="hidden sm:block text-gray-300">•</span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-[#5e3d2a]" />
                    Cancel anytime
                  </span>
                  <span className="hidden sm:block text-gray-300">•</span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-[#5e3d2a]" />
                    500,000+ happy users
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
