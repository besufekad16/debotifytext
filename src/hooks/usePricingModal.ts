"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

const MODAL_SHOWN_KEY = "humanifylab_pricing_modal_shown";
const MODAL_DISMISSED_KEY = "humanifylab_pricing_modal_dismissed";

export function usePricingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;

    // Check if user is on a paid plan
    const userPlan = user.publicMetadata?.subscriptionPlan as string | undefined;
    const hasPaidPlan = userPlan && userPlan !== "free";

    // Don't show modal if user has a paid plan
    if (hasPaidPlan) return;

    // Check if modal was already shown or dismissed
    const modalShown = localStorage.getItem(MODAL_SHOWN_KEY);
    const modalDismissed = localStorage.getItem(MODAL_DISMISSED_KEY);

    // Show modal if:
    // 1. User is on free plan
    // 2. Modal hasn't been shown before OR was dismissed more than 7 days ago
    if (!modalShown || shouldShowAgain(modalDismissed)) {
      // Delay to let the page load first
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem(MODAL_SHOWN_KEY, new Date().toISOString());
      }, 2000); // Show after 2 seconds

      return () => clearTimeout(timer);
    }
  }, [user, isLoaded]);

  const closeModal = () => {
    setIsOpen(false);
    // Mark as dismissed with timestamp
    localStorage.setItem(MODAL_DISMISSED_KEY, new Date().toISOString());
  };

  return {
    isOpen,
    closeModal,
  };
}

// Helper function to check if modal should show again
function shouldShowAgain(dismissedAt: string | null): boolean {
  if (!dismissedAt) return true;

  const dismissed = new Date(dismissedAt);
  const now = new Date();
  const daysSinceDismissed = (now.getTime() - dismissed.getTime()) / (1000 * 60 * 60 * 24);

  // Show again after 7 days
  return daysSinceDismissed > 7;
}
