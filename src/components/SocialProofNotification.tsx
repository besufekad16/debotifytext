"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Infinity as InfinityIcon, Zap } from "lucide-react";

type NotificationType = "humanized" | "subscribed";

interface Notification {
  id: string;
  words?: number;
  plan: "Basic" | "Pro" | "Ultra" | "Unlimited";
  price: string;
  type: NotificationType;
  action: string;
}

const PLANS = [
  { name: "Basic" as const, price: "$6.99", minWords: 0, maxWords: 7000 },
  { name: "Pro" as const, price: "$23.99", minWords: 7000, maxWords: 20000 },
  { name: "Ultra" as const, price: "$42.99", minWords: 20000, maxWords: 50000 },
  { name: "Unlimited" as const, price: "$100", minWords: 50000, maxWords: 100000 },
];

function generateRandomNotification(): Notification {
  // 70% chance of "humanized" notification, 30% chance of "subscribed"
  const type: NotificationType = Math.random() < 0.7 ? "humanized" : "subscribed";
  
  if (type === "subscribed") {
    // For subscribed notifications, show Unlimited plan more often (60% of the time)
    const isUnlimited = Math.random() < 0.6;
    const plan = isUnlimited 
      ? PLANS[3]! // Unlimited
      : PLANS[Math.floor(Math.random() * 3)]!; // Basic, Pro, or Ultra
    
    return {
      id: Math.random().toString(36).substring(7),
      plan: plan.name,
      price: plan.price,
      type: "subscribed",
      action: "subscribed to",
    };
  } else {
    // For humanized notifications, generate word count and match to appropriate plan
    const words = Math.floor(Math.random() * (100000 - 500 + 1)) + 500;
    
    // Determine plan based on word count
    let selectedPlan = PLANS[0]!; // Default to Basic
    for (const plan of PLANS) {
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
      action: "humanized",
    };
  }
}

export default function SocialProofNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Function to show a notification
    const showNotification = () => {
      const notification = generateRandomNotification();
      
      // Add new notification to the stack
      setNotifications(prev => [...prev, notification]);

      // Auto-dismiss after 5 seconds (longer display time)
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== notification.id));
      }, 5000);
    };

    // Show first notification after a random delay (3-8 seconds)
    const initialDelay = Math.random() * 5000 + 3000;
    const initialTimer = setTimeout(showNotification, initialDelay);

    // Set up interval for subsequent notifications (every 6 seconds)
    const interval = setInterval(() => {
      showNotification();
    }, 6000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  const handleClose = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-auto z-40 flex flex-col-reverse gap-2 sm:gap-3 pointer-events-none">
      <style>{`
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes floatUpAndDissolve {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
          50% {
            opacity: 0.5;
            transform: translateY(-30px) scale(0.95);
            filter: blur(1px);
          }
          100% {
            opacity: 0;
            transform: translateY(-60px) scale(0.85);
            filter: blur(3px);
          }
        }
        
        .notification-enter {
          animation: slideInLeft 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .notification-exit {
          animation: floatUpAndDissolve 0.8s cubic-bezier(0.4, 0, 0.6, 1) forwards;
        }
      `}</style>
      
      {notifications.map((notification, index) => {
        const isExiting = index < notifications.length - 1;
        
        return (
          <div
            key={notification.id}
            className={`w-full sm:max-w-sm pointer-events-auto transition-all duration-500 ${
              isExiting ? 'notification-exit' : 'notification-enter'
            }`}
          >
            <div className={`rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl border px-3 py-2.5 sm:px-4 sm:py-3 pr-10 sm:pr-12 relative ${
              notification.plan === "Unlimited" 
                ? "bg-gradient-to-br from-[#2a1a06] via-[#3d2508] to-[#2e1c07] border-[#D4A855]/60" 
                : "bg-white border-gray-200"
            }`}>
              {/* Close Button */}
              <button
                onClick={() => handleClose(notification.id)}
                className={`absolute top-2 sm:top-2.5 right-2 sm:right-2.5 p-1 rounded-full transition-colors ${
                  notification.plan === "Unlimited"
                    ? "hover:bg-white/10 text-white/60 hover:text-white/80"
                    : "hover:bg-gray-100 text-gray-400"
                }`}
                aria-label="Close notification"
              >
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>

              {/* Content */}
              <div className="flex items-center gap-2.5 sm:gap-3">
                {/* Icon */}
                <div className={`flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center ${
                  notification.plan === "Unlimited"
                    ? "bg-gradient-to-br from-[#E8B84B] to-[#C8922A]"
                    : "bg-[#5e3d2a]"
                }`}>
                  {notification.plan === "Unlimited" ? (
                    <InfinityIcon className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-[#1a0e00]" />
                  ) : (
                    <Sparkles className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-white" />
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  {notification.type === "humanized" ? (
                    <>
                      <p className={`text-xs sm:text-sm leading-snug ${
                        notification.plan === "Unlimited" ? "text-white" : "text-gray-700"
                      }`}>
                        <span className="hidden sm:inline">Someone just humanized </span>
                        <span className="sm:hidden">Humanized </span>
                        <span className={`font-bold ${
                          notification.plan === "Unlimited" ? "text-[#E8B84B]" : "text-gray-900"
                        }`}>
                          {notification.words?.toLocaleString()} words
                        </span>{" "}
                        <span className="hidden sm:inline">with </span>
                        <span className="sm:hidden">• </span>
                        <span className={`font-bold ${
                          notification.plan === "Unlimited" ? "text-[#E8B84B]" : "text-[#5e3d2a]"
                        }`}>
                          {notification.plan}
                        </span>
                      </p>
                      <p className={`text-[10px] sm:text-xs mt-0.5 truncate ${
                        notification.plan === "Unlimited" ? "text-white/60" : "text-gray-500"
                      }`}>
                        {notification.plan === "Unlimited" 
                          ? "Unlimited — $100/2mo"
                          : `${notification.price}/month`
                        }
                      </p>
                    </>
                  ) : (
                    <>
                      <p className={`text-xs sm:text-sm leading-snug ${
                        notification.plan === "Unlimited" ? "text-white" : "text-gray-700"
                      }`}>
                        {notification.plan === "Unlimited" ? (
                          <>
                            <span className="font-bold text-[#E8B84B]">
                              <span className="hidden sm:inline">Someone subscribed</span>
                              <span className="sm:hidden">Subscribed</span>
                            </span>
                            <span className="hidden sm:inline"> to </span>
                            <span className="sm:hidden"> • </span>
                            <span className="font-bold text-[#E8B84B]">Unlimited</span>!
                          </>
                        ) : (
                          <>
                            <span className="hidden sm:inline">Someone subscribed to </span>
                            <span className="sm:hidden">Subscribed • </span>
                            <span className="font-bold text-[#5e3d2a]">{notification.plan}</span>!
                          </>
                        )}
                      </p>
                      <p className={`text-[10px] sm:text-xs mt-0.5 flex items-center gap-1 truncate ${
                        notification.plan === "Unlimited" ? "text-white/60" : "text-gray-500"
                      }`}>
                        {notification.plan === "Unlimited" && (
                          <Zap className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-[#E8B84B] flex-shrink-0" />
                        )}
                        <span className="truncate">
                          {notification.plan === "Unlimited" 
                            ? "14 spots left at $100"
                            : `${notification.price}/month`
                          }
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
