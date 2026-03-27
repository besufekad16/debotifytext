"use client";

import { useState } from "react";
import Image from "next/image";

const detectors = [
  {
    name: "GPTZero",
    logo: "/logo/GPTZero.png",
    screenshot: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774644876/Screenshot_from_2026-03-27_20-54-12_gluntg.png"
  },
  {
    name: "Pangram",
    logo: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774646001/Screenshot_from_2026-03-27_21-13-07_d32x0e.png",
    screenshot: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774644948/Screenshot_from_2026-03-27_20-55-35_x9mfov.png"
  },
  {
    name: "QuillBot",
    logo: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774646069/Screenshot_from_2026-03-27_21-14-17_axg4vz.png",
    screenshot: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774645013/Screenshot_from_2026-03-27_20-56-41_hkpuqo.png"
  },
  {
    name: "Winston AI",
    logo: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774646117/Screenshot_from_2026-03-27_21-15-03_o9lvth.png",
    screenshot: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774645083/Screenshot_from_2026-03-27_20-57-36_jcdvjs.png"
  },
  {
    name: "Copyleaks",
    logo: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774646189/Screenshot_from_2026-03-27_21-16-02_pnczgd.png",
    screenshot: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774645131/Screenshot_from_2026-03-27_20-58-38_wnxvqj.png"
  },
  {
    name: "Smodin",
    logo: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774646258/Screenshot_from_2026-03-27_21-17-25_hjrpew.png",
    screenshot: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774645192/Screenshot_from_2026-03-27_20-59-39_kbz2w5.png"
  },
  {
    name: "Originality.ai",
    logo: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774646354/Screenshot_from_2026-03-27_21-18-59_jibsem.png",
    screenshot: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774645244/Screenshot_from_2026-03-27_21-00-27_qi8arb.png"
  },
  {
    name: "Undetectable.ai",
    logo: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774646403/Screenshot_from_2026-03-27_21-19-51_r7rz5o.png",
    screenshot: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774645296/Screenshot_from_2026-03-27_21-01-22_hmnjzy.png"
  },
  {
    name: "Scribbr",
    logo: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774646450/Screenshot_from_2026-03-27_21-20-36_fp4zfq.png",
    screenshot: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774645347/Screenshot_from_2026-03-27_21-02-14_gtynuw.png"
  },
  {
    name: "Grammarly AI",
    logo: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774646507/Screenshot_from_2026-03-27_21-21-36_s7tfbj.png",
    screenshot: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774645439/Screenshot_from_2026-03-27_21-03-45_r5uqus.png"
  }
];

export default function DetectorShowcase() {
  const [activeDetector, setActiveDetector] = useState(0);

  return (
    <div className="space-y-8">
      {/* Detector Logo Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {detectors.map((detector, index) => (
          <button
            key={detector.name}
            onClick={() => setActiveDetector(index)}
            className={`
              relative px-4 py-3 border-2 transition-all duration-300
              ${activeDetector === index 
                ? 'border-[#8B6F47] bg-[#F5E6D3] shadow-md' 
                : 'border-gray-200 bg-white hover:border-[#D4C4B0] hover:bg-gray-50'
              }
            `}
          >
            <Image
              src={detector.logo}
              alt={detector.name}
              width={80}
              height={28}
              className={`
                object-contain h-7 w-auto transition-all duration-300
                ${activeDetector === index ? '' : 'grayscale opacity-60'}
              `}
            />
          </button>
        ))}
      </div>

      {/* Screenshot Display */}
      <div className="relative w-full bg-gray-50 border border-gray-200 overflow-hidden" style={{ minHeight: '500px' }}>
        <Image
          src={detectors[activeDetector].screenshot}
          alt={`${detectors[activeDetector].name} screenshot`}
          width={1200}
          height={700}
          className="w-full h-auto object-contain"
          priority
        />
      </div>

      {/* Pagination Dots */}
      <div className="flex items-center justify-center gap-2">
        {detectors.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveDetector(index)}
            className={`
              h-2 transition-all duration-300
              ${activeDetector === index 
                ? 'w-8 bg-[#8B6F47]' 
                : 'w-2 bg-gray-300 hover:bg-gray-400'
              }
            `}
            aria-label={`Go to detector ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
