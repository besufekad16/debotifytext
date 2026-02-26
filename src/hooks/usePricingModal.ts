"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";

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

    // Show modal every time for free users
    // Delay to let the page load first
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 2000); // Show after 2 seconds

    return () => clearTimeout(timer);
  }, [user, isLoaded]);

  const closeModal = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    closeModal,
  };
}
