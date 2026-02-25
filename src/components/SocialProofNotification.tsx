"use client";

import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";

interface Notification {
  id: string;
  words: number;
  plan: "Basic" | "Pro" | "Ultra";
  price: string;
}

const PLANS = [
  { name: "Basic" as const, price: "$6.99" },
  { name: "Pro" as const, price: "$23.99" },
  { name: "Ultra" as const, price: "$42.99" },
];

// Random word counts that look realistic
const WORD_COUNTS = [150, 250, 350, 500, 750, 1000, 1250, 1500, 2000, 2500, 3000];

function generateRandomNotification(): Notification {
  const plan = PLANS[Math.floor(Math.random() * PLANS.length)]!;
  // Generate random word count between 800 and 50,000
  const words = Math.floor(Math.random() * (50000 - 800 + 1)) + 800;
  
  return {
    id: Math.random().toString(36).substring(7),
    words,
    plan: plan.name,
    price: plan.price,
  };
}

export default function SocialProofNotification() {
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Function to show a notification
    const showNotification = () => {
      const notification = generateRandomNotification();
      setCurrentNotification(notification);
      setIsVisible(true);
      setIsClosing(false);

      // Auto-dismiss after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);
    };

    // Show first notification after a random delay (3-8 seconds)
    const initialDelay = Math.random() * 5000 + 3000;
    const initialTimer = setTimeout(showNotification, initialDelay);

    // Set up interval for subsequent notifications (2s display + 1.1s wait = 3.1s total cycle)
    const interval = setInterval(() => {
      showNotification();
    }, 3100); // 2000ms display + 1100ms wait

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      setCurrentNotification(null);
      setIsClosing(false);
    }, 300); // Match animation duration
  };

  if (!isVisible || !currentNotification) return null;

  return (
    <div
      className={`fixed bottom-6 left-6 z-40 max-w-sm transition-all duration-300 ease-out ${
        isClosing ? "opacity-0 -translate-x-8" : "opacity-100 translate-x-0"
      }`}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-4 pr-12 relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close notification"
        >
          <X className="h-4 w-4 text-gray-400" />
        </button>

        {/* Content */}
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>

          {/* Text */}
          <div className="flex-1 pt-1">
            <p className="text-sm text-gray-700 leading-relaxed">
              Someone just humanized{" "}
              <span className="font-bold text-gray-900">{currentNotification.words} words</span>{" "}
              using{" "}
              <span
                className={`font-bold ${
                  currentNotification.plan === "Basic"
                    ? "text-green-600"
                    : currentNotification.plan === "Pro"
                    ? "text-blue-600"
                    : currentNotification.plan === "Ultra"
                    ? "text-purple-600"
                    : "text-gray-600"
                }`}
              >
                {currentNotification.plan}
              </span>
              !
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Unlock {currentNotification.plan} — {currentNotification.price}/month
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
