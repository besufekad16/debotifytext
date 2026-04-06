"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";

export function usePricingModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoaded } = useUser();
  // Track the last userId so the modal re-triggers on every fresh sign-in
  const lastUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;

    // Don't show for paid users
    const userPlan = user.publicMetadata?.subscriptionPlan as string | undefined;
    if (userPlan && userPlan !== "free") return;

    // Only show once per userId session — resets when a different user signs in
    if (lastUserIdRef.current === user.id) return;
    lastUserIdRef.current = user.id;

    const timer = setTimeout(() => setIsOpen(true), 1500);
    return () => clearTimeout(timer);
  }, [user, isLoaded]);

  const closeModal = () => setIsOpen(false);

  return { isOpen, closeModal };
}
