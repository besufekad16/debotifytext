"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, GraduationCap, Zap } from "lucide-react";

type NotificationType = "humanized" | "subscribed";

interface Notification {
  id: string;
  words?: number;
  plan: "Basic" | "Pro" | "Ultra" | "Lifetime";
  price: string;
  type: NotificationType;
}

const PLANS = [
  { name: "Basic" as const, price: "$6.99", minWords: 0, maxWords: 7000 },
  { name: "Pro" as const, price: "$23.99", minWords: 7000, maxWords: 20000 },
  { name: "Ultra" as const, price: "$42.99", minWords: 20000, maxWords: 50000 },
  { name: "Lifetime" as const, price: "Pay once", minWords: 50000, maxWords: 100000 },
];

function generateRandomNotification(): Notification {
  const type: NotificationType = Math.random() < 0.65 ? "humanized" : "subscribed";

  if (type === "subscribed") {
    const isLifetime = Math.random() < 0.7;
    const plan = isLifetime ? PLANS[3]! : PLANS[Math.floor(Math.random() * 3)]!;
    return {
      id: Math.random().toString(36).substring(7),
      plan: plan.name,
      price: plan.price,
      type: "subscribed",
    };
  }

  const words = Math.floor(Math.random() * (45000 - 500 + 1)) + 500;
  let selectedPlan = PLANS[0]!;
  for (const plan of PLANS.slice(0, 3)) {
    if (words >= plan.minWords && words < plan.maxWords) {
      selectedPlan = plan;
      break;
    }
  }

  return {
    id: Math.random().toString(36).substring(7),
    words,
    plan: selectedPlan.name,
    price: selectedPlan.price,
    type: "humanized",
  };
}

export default function SocialProofNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const showNotification = () => {
      const notification = generateRandomNotification();
      setNotifications((prev) => [...prev, notification]);
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
      }, 5000);
    };

    const initialTimer = setTimeout(showNotification, Math.random() * 5000 + 3000);
    const interval = setInterval(showNotification, 7000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const handleClose = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 right-4 z-40 flex flex-col-reverse gap-2 sm:bottom-6 sm:left-6 sm:right-auto sm:gap-3">
      {notifications.map((notification, index) => {
        const isExiting = index < notifications.length - 1;
        const isLifetime = notification.plan === "Lifetime";

        return (
          <div
            key={notification.id}
            className={`pointer-events-auto w-full sm:max-w-sm ${
              isExiting ? "animate-[fadeIn_0.4s_ease_forwards] opacity-0" : "animate-[slideInLeft_0.45s_ease]"
            }`}
          >
            <div
              className={`relative rounded-2xl border px-3 py-2.5 pr-10 shadow-xl sm:px-4 sm:py-3 ${
                isLifetime
                  ? "border-[var(--hl-offer)]/40 bg-[var(--hl-ink)]"
                  : "border-gray-200 bg-white"
              }`}
            >
              <button
                onClick={() => handleClose(notification.id)}
                className={`absolute right-2 top-2 rounded-full p-1 transition-colors ${
                  isLifetime ? "text-white/50 hover:bg-white/10 hover:text-white" : "text-gray-400 hover:bg-gray-100"
                }`}
                aria-label="Close notification"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              <div className="flex items-center gap-2.5 sm:gap-3">
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full sm:h-9 sm:w-9 ${
                    isLifetime
                      ? "bg-gradient-to-br from-[#E8B84B] to-[#C8922A]"
                      : "bg-[var(--hl-mint-deep)]"
                  }`}
                >
                  {isLifetime ? (
                    <GraduationCap className="h-4 w-4 text-[var(--hl-ink)]" />
                  ) : (
                    <Sparkles className="h-4 w-4 text-white" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  {notification.type === "humanized" ? (
                    <>
                      <p className={`text-xs leading-snug sm:text-sm ${isLifetime ? "text-white" : "text-gray-700"}`}>
                        <span className="hidden sm:inline">Someone just humanized </span>
                        <span className="sm:hidden">Humanized </span>
                        <span className={`font-bold ${isLifetime ? "text-[var(--hl-offer)]" : "text-gray-900"}`}>
                          {notification.words?.toLocaleString()} words
                        </span>{" "}
                        <span className="hidden sm:inline">with </span>
                        <span className="sm:hidden">• </span>
                        <span className={`font-bold ${isLifetime ? "text-[var(--hl-offer)]" : "text-[var(--hl-mint-deep)]"}`}>
                          {notification.plan}
                        </span>
                      </p>
                      <p className={`mt-0.5 truncate text-[10px] sm:text-xs ${isLifetime ? "text-white/55" : "text-gray-500"}`}>
                        {notification.price}/month
                      </p>
                    </>
                  ) : (
                    <>
                      <p className={`text-xs leading-snug sm:text-sm ${isLifetime ? "text-white" : "text-gray-700"}`}>
                        {isLifetime ? (
                          <>
                            <span className="font-bold text-[var(--hl-offer)]">Claimed Lifetime</span>
                            <span className="text-white/80"> — Back-to-School deal</span>
                          </>
                        ) : (
                          <>
                            <span className="hidden sm:inline">Someone subscribed to </span>
                            <span className="sm:hidden">Subscribed • </span>
                            <span className="font-bold text-[var(--hl-mint-deep)]">{notification.plan}</span>
                          </>
                        )}
                      </p>
                      <p className={`mt-0.5 flex items-center gap-1 truncate text-[10px] sm:text-xs ${isLifetime ? "text-white/55" : "text-gray-500"}`}>
                        {isLifetime && <Zap className="h-3 w-3 flex-shrink-0 text-[var(--hl-offer)]" />}
                        <span className="truncate">
                          {isLifetime ? "20k words/mo forever — pay once" : `${notification.price}/month`}
                        </span>
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
