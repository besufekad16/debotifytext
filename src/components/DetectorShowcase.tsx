"use client";

import { useState } from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

const detectors = [
  {
    name: "GPTZero",
    logo: "/logo/GPTZero.png",
    screenshot: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774644876/Screenshot_from_2026-03-27_20-54-12_gluntg.png",
  },
  {
    name: "Pangram",
    logo: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774646001/Screenshot_from_2026-03-27_21-13-07_d32x0e.png",
    screenshot: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774644948/Screenshot_from_2026-03-27_20-55-35_x9mfov.png",
  },
  {
    name: "QuillBot",
    logo: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774646069/Screenshot_from_2026-03-27_21-14-17_axg4vz.png",
    screenshot: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774645013/Screenshot_from_2026-03-27_20-56-41_hkpuqo.png",
  },
  {
    name: "Winston AI",
    logo: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774646117/Screenshot_from_2026-03-27_21-15-03_o9lvth.png",
    screenshot: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774645083/Screenshot_from_2026-03-27_20-57-36_jcdvjs.png",
  },
  {
    name: "Copyleaks",
    logo: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774646189/Screenshot_from_2026-03-27_21-16-02_pnczgd.png",
    screenshot: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774645131/Screenshot_from_2026-03-27_20-58-38_wnxvqj.png",
  },
  {
    name: "Smodin",
    logo: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774646258/Screenshot_from_2026-03-27_21-17-25_hjrpew.png",
    screenshot: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774645192/Screenshot_from_2026-03-27_20-59-39_kbz2w5.png",
  },
  {
    name: "Originality.ai",
    logo: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774646354/Screenshot_from_2026-03-27_21-18-59_jibsem.png",
    screenshot: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774645244/Screenshot_from_2026-03-27_21-00-27_qi8arb.png",
  },
  {
    name: "Undetectable.ai",
    logo: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774646403/Screenshot_from_2026-03-27_21-19-51_r7rz5o.png",
    screenshot: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774645296/Screenshot_from_2026-03-27_21-01-22_hmnjzy.png",
  },
  {
    name: "Scribbr",
    logo: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774646450/Screenshot_from_2026-03-27_21-20-36_fp4zfq.png",
    screenshot: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774645347/Screenshot_from_2026-03-27_21-02-14_gtynuw.png",
  },
  {
    name: "Grammarly AI",
    logo: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774646507/Screenshot_from_2026-03-27_21-21-36_s7tfbj.png",
    screenshot: "https://res.cloudinary.com/dgns6xxwo/image/upload/v1774645439/Screenshot_from_2026-03-27_21-03-45_r5uqus.png",
  },
];

export default function DetectorShowcase() {
  const [activeDetector, setActiveDetector] = useState(0);
  const active = detectors[activeDetector]!;

  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--hl-mint)]/20 bg-[var(--hl-mint-deep)]/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--hl-mint-deep)]">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Proven on live detectors
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-[var(--hl-ink)] sm:text-3xl">
          Built to pass the detectors people actually use
        </h2>
        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Tap a detector to see real HumanifyLab output scoring as human.
        </p>
      </div>

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 sm:flex-wrap sm:items-center sm:justify-center sm:overflow-visible sm:pb-0">
        {detectors.map((detector, index) => {
          const isActive = activeDetector === index;
          return (
            <button
              key={detector.name}
              type="button"
              onClick={() => setActiveDetector(index)}
              className={`
                flex flex-shrink-0 items-center gap-2 rounded-2xl border px-3.5 py-2.5 transition-all duration-300
                ${
                  isActive
                    ? "border-[var(--hl-mint-deep)] bg-[var(--hl-mint-deep)] text-white shadow-[0_10px_30px_-12px_rgba(94,61,42,0.65)]"
                    : "border-black/5 bg-white text-gray-600 hover:border-[var(--hl-mint)]/30 hover:bg-[var(--hl-surface)]"
                }
              `}
            >
              <Image
                src={detector.logo}
                alt=""
                width={72}
                height={24}
                className={`h-5 w-auto object-contain ${isActive ? "brightness-0 invert" : "opacity-70"}`}
              />
              <span className="hidden text-xs font-semibold sm:inline">{detector.name}</span>
            </button>
          );
        })}
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-black/5 bg-[var(--hl-surface)] shadow-[0_24px_80px_-32px_rgba(94,61,42,0.35)]">
        <div className="flex items-center justify-between border-b border-black/5 bg-white/80 px-4 py-3 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-[var(--hl-mint-bright)]/80" />
          </div>
          <span className="text-xs font-semibold text-gray-500">{active.name} · Human score</span>
          <span className="rounded-full bg-[var(--hl-mint)]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[var(--hl-mint-deep)]">
            Pass
          </span>
        </div>
        <div className="relative min-h-[280px] sm:min-h-[420px]">
          <Image
            src={active.screenshot}
            alt={`${active.name} detector result for HumanifyLab output`}
            width={1200}
            height={700}
            className="h-auto w-full object-contain"
            priority
          />
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        {detectors.map((d, index) => (
          <button
            key={d.name}
            type="button"
            onClick={() => setActiveDetector(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              activeDetector === index
                ? "w-8 bg-[var(--hl-mint-deep)]"
                : "w-2 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Show ${d.name}`}
          />
        ))}
      </div>
    </div>
  );
}
