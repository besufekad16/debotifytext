"use client";

/**
 * ReferralCodeStep
 * A lightweight inline step shown before checkout.
 * Asks the user for an optional referral code.
 * Non-blocking: wrong code or skip → onProceed() is called regardless.
 */

import { useState } from "react";

interface Props {
  onProceed: () => void;   // called after code is applied (or skipped)
  onCancel: () => void;    // called if user dismisses entirely
  isLoading?: boolean;     // true while checkout is being created
}

export default function ReferralCodeStep({ onProceed, onCancel, isLoading }: Props) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "applying" | "applied" | "invalid">("idle");
  const [message, setMessage] = useState("");

  const applyCode = async () => {
    const trimmed = code.trim().toLowerCase();
    if (!trimmed) {
      // Empty — just proceed
      onProceed();
      return;
    }

    setStatus("applying");
    try {
      const res = await fetch("/api/affiliate/apply-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referralCode: trimmed }),
      });
      const data = await res.json() as { success?: boolean; error?: string; alreadySet?: boolean };

      if (res.ok && data.success) {
        setStatus("applied");
        setMessage(data.alreadySet ? "Code already applied to your account." : "Referral code applied!");
        // Short delay so user sees the success, then proceed
        setTimeout(() => onProceed(), 800);
      } else {
        // Invalid code — show error but still allow proceeding
        setStatus("invalid");
        setMessage(data.error ?? "Invalid code");
      }
    } catch {
      // Network error — don't block checkout
      setStatus("invalid");
      setMessage("Could not verify code. You can still proceed.");
    }
  };

  const handleSkip = () => {
    onProceed();
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in fade-in slide-in-from-bottom-4 duration-200">

        {/* Header */}
        <div className="text-center mb-5">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#5e3d2a]/10">
            <svg className="h-6 w-6 text-[#5e3d2a]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900">Have a referral code?</h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter a friend&apos;s code to credit them. Completely optional.
          </p>
        </div>

        {/* Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="e.g. humanify-005"
            value={code}
            onChange={(e) => { setCode(e.target.value); setStatus("idle"); }}
            disabled={status === "applying" || status === "applied" || isLoading}
            onKeyDown={(e) => { if (e.key === "Enter") applyCode(); }}
            className={
              "w-full text-sm border rounded-xl px-4 py-3 font-mono tracking-wide focus:outline-none focus:ring-2 transition " +
              (status === "applied"
                ? "border-green-400 bg-green-50 text-green-700 focus:ring-green-300"
                : status === "invalid"
                ? "border-red-300 bg-red-50 text-red-700 focus:ring-red-200"
                : "border-gray-200 focus:ring-gray-300")
            }
            autoFocus
          />
          {/* Status message */}
          {status === "applied" && (
            <p className="text-xs text-green-600 mt-1.5 font-medium">✓ {message}</p>
          )}
          {status === "invalid" && (
            <p className="text-xs text-red-500 mt-1.5">{message}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          {/* Primary: Apply & Continue */}
          <button
            onClick={applyCode}
            disabled={status === "applying" || status === "applied" || isLoading}
            className="w-full py-3 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 disabled:opacity-50 transition"
          >
            {status === "applying"
              ? "Applying..."
              : status === "applied"
              ? "✓ Applied — continuing..."
              : isLoading
              ? "Processing..."
              : code.trim()
              ? "Apply Code & Continue"
              : "Continue to Checkout"}
          </button>

          {/* Secondary: Skip */}
          {status !== "applied" && (
            <button
              onClick={handleSkip}
              disabled={status === "applying" || isLoading}
              className="w-full py-2.5 text-sm text-gray-400 hover:text-gray-600 transition"
            >
              Skip — I don&apos;t have a code
            </button>
          )}

          {/* Cancel */}
          <button
            onClick={onCancel}
            disabled={status === "applying" || isLoading}
            className="w-full py-2 text-xs text-gray-300 hover:text-gray-500 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
