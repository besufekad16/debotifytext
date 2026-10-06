"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export default function AnimatedLogo() {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={containerRef}
      className="relative flex items-center justify-center cursor-pointer group"
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
        {/* Container for the logo with glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#997cf0] via-[#8b6ee8] to-[#7d5fd6] rounded-full opacity-0 blur-xl group-hover:opacity-20 transition-opacity duration-500" />
        
        <div className="relative h-20 w-20 sm:h-24 sm:w-24">
            <Image
                src="/debotify.png"
                alt="DebotifyText Logo"
                fill
                className="object-contain rounded-full"
            />
        </div>
    </div>
  );
}
