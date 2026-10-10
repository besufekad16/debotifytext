"use client";

import { useState, useEffect } from "react";
import { X, Feather, GraduationCap, Zap } from "lucide-react";

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
    // Fetch live prices from Polar API to update the global PLANS array
    fetch("/api/polar/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const basic = data.find((p) => p.key === "small");
          if (basic?.monthly?.displayPrice) PLANS[0]!.price = basic.monthly.displayPrice.replace('/month', '');

          const pro = data.find((p) => p.key === "medium");
          if (pro?.monthly?.displayPrice) PLANS[1]!.price = pro.monthly.displayPrice.replace('/month', '');

          const ultra = data.find((p) => p.key === "large");
          if (ultra?.monthly?.displayPrice) PLANS[2]!.price = ultra.monthly.displayPrice.replace('/month', '');
        }
      })
      .catch((err) => console.error("[SocialProof] Failed to fetch prices:", err));

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
    <div className="pointer-events-none fixed bottom-4 left-4 right-4 z-[9999] flex flex-col-reverse gap-3 sm:bottom-6 sm:left-6 sm:right-auto">
      {notifications.map((notification, index) => {
        const isExiting = index < notifications.length - 1;
        const isLifetime = notification.plan === "Lifetime";

        return (
          <div
            key={notification.id}
            className={`pointer-events-auto w-full sm:max-w-[320px] ${
              isExiting ? "animate-[fadeOut_0.4s_ease_forwards]" : "animate-[slideInLeft_0.5s_cubic-bezier(0.16,1,0.3,1)]"
            }`}
          >
            <div
              className={`relative rounded-[1.25rem] border p-3.5 pr-10 transition-all duration-300 ${
                isLifetime
                  ? "border-green-400/30 bg-slate-900/90 backdrop-blur-xl shadow-[0_12px_40px_-10px_rgba(34,197,94,0.3)]"
                  : "border-slate-100 bg-white/80 backdrop-blur-xl shadow-[0_12px_30px_-10px_rgba(34,197,94,0.15)]"
              }`}
            >
              <button
                onClick={() => handleClose(notification.id)}
                className={`absolute right-2 top-2 rounded-full p-1.5 transition-colors ${
                  isLifetime ? "text-white/40 hover:bg-white/10 hover:text-white" : "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                }`}
                aria-label="Close notification"
              >
                <X className="h-3.5 w-3.5" strokeWidth={2.5} />
              </button>

              <div className="flex items-center gap-3.5">
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl shadow-inner ${
                    isLifetime
                      ? "bg-gradient-to-br from-green-400 to-green-600 border border-green-300/50"
                      : "bg-green-50 border border-green-100/50"
                  }`}
                >
                  {isLifetime ? (
                    <GraduationCap className="h-5 w-5 text-slate-900" />
                  ) : (
                    <Feather className="h-4 w-4 text-green-600" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  {notification.type === "humanized" ? (
                    <>
                      <p className={`text-[13px] leading-tight ${isLifetime ? "text-white" : "text-slate-700"}`}>
                        <span className="hidden sm:inline">Someone humanized </span>
                        <span className="sm:hidden">Humanized </span>
                        <span className={`font-bold ${isLifetime ? "text-green-400" : "text-slate-900"}`}>
                          {notification.words?.toLocaleString()} words
                        </span>{" "}
                        <span className="hidden sm:inline">with </span>
                        <span className="sm:hidden">• </span>
                        <span className={`font-bold ${isLifetime ? "text-green-400" : "text-green-600"}`}>
                          {notification.plan}
                        </span>
                      </p>
                      <p className={`mt-1 truncate text-[11px] font-medium ${isLifetime ? "text-slate-400" : "text-slate-500"}`}>
                        {notification.price}/month
                      </p>
                    </>
                  ) : (
                    <>
                      <p className={`text-[13px] leading-tight ${isLifetime ? "text-white" : "text-slate-700"}`}>
                        {isLifetime ? (
                          <>
                            <span className="font-bold text-green-400">Claimed Lifetime</span>
                            <span className="text-white/80"> — Back-to-School</span>
                          </>
                        ) : (
                          <>
                            <span className="hidden sm:inline">Someone subscribed to </span>
                            <span className="sm:hidden">Subscribed • </span>
                            <span className="font-bold text-green-600">{notification.plan}</span>
                          </>
                        )}
                      </p>
                      <p className={`mt-1 flex items-center gap-1 truncate text-[11px] font-medium ${isLifetime ? "text-slate-400" : "text-slate-500"}`}>
                        {isLifetime && <Zap className="h-3.5 w-3.5 flex-shrink-0 text-green-400" />}
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
