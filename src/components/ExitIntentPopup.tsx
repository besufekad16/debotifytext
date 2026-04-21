"use client";

import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { useRouter } from "next/navigation";

const EXIT_INTENT_SHOWN_KEY = "exit_intent_shown_v1";
const EXIT_INTENT_COOLDOWN = 24 * 60 * 60 * 1000; // 24 hours

export default function ExitIntentPopup() {
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
    }, 200);
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
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-200 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        onClick={handleClose}
      />

      {/* Popup - Mobile First Design */}
      <div
        className={`fixed inset-x-4 bottom-4 sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:inset-x-0 z-50 w-auto sm:w-full sm:max-w-md transition-all duration-200 ${
          isClosing ? "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" : "opacity-100 translate-y-0 sm:scale-100"
        }`}
      >
        <div className="relative bg-white rounded-lg shadow-xl">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Headline */}
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2 pr-8">
              Special Offer
            </h2>
            
            <p className="text-sm sm:text-base text-gray-600 mb-6">
              Get 2 months unlimited access at a discounted rate
            </p>

            {/* Pricing */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-baseline justify-center gap-2 mb-3">
                <span className="text-gray-400 text-lg line-through">$150</span>
                <span className="text-3xl sm:text-4xl font-bold text-gray-900">$100</span>
                <span className="text-gray-600 text-sm">/ 2 months</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="h-4 w-4 text-[#8B6F47] flex-shrink-0" />
                  <span>Unlimited humanization</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="h-4 w-4 text-[#8B6F47] flex-shrink-0" />
                  <span>No daily limits</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Check className="h-4 w-4 text-[#8B6F47] flex-shrink-0" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleCTA}
                className="w-full px-6 py-3 rounded-lg font-semibold text-white transition-colors"
                style={{
                  backgroundColor: '#8B6F47',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#6d5636'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8B6F47'}
              >
                View Pricing
              </button>
              
              <button
                onClick={handleClose}
                className="w-full px-6 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                No thanks
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
