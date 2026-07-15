"use client";

import PageNavbar from "./PageNavbar";

interface ModernNavbarProps {
  onHistoryClick?: () => void;
  currentCredits?: number;
  isTeamMember?: boolean;
}

/**
 * Home-page navbar. Kept as a thin wrapper around the single PageNavbar
 * implementation (variant="home") so the header stays identical everywhere.
 */
export default function ModernNavbar({ onHistoryClick, currentCredits, isTeamMember = false }: ModernNavbarProps) {
  return (
    <PageNavbar
      variant="home"
      onHistoryClick={onHistoryClick}
      currentCredits={currentCredits}
      isTeamMember={isTeamMember}
    />
  );
}
