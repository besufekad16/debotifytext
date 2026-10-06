"use client";

import { useState } from "react";

interface Props {
  alreadyApplied?: boolean;
}

export default function ReferralCodeInput({ alreadyApplied }: Props) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  if (alreadyApplied || status === "success") {
    return (
      <p className="text-xs text-green-700 font-medium">
        ✓ {status === "success" ? message : "Referral code already applied to your account."}
      </p>
    );
  }

  const apply = async () => {
    const trimmed = code.trim().toLowerCase();
    if (!trimmed) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/affiliate/apply-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referralCode: trimmed }),
      });
      const data = await res.json() as { success?: boolean; error?: string; message?: string; alreadySet?: boolean };
      if (res.ok && data.success) {
        setStatus("success");
        setMessage(data.alreadySet ? "Already applied." : "Referral code applied!");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Invalid code");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong.");
    }
  };

  return (
    <div className="mt-3">
      <p className="text-xs text-slate-400 mb-1.5">Have a referral code from a friend?</p>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="e.g. debotify-002"
          value={code}
          onChange={(e) => { setCode(e.target.value); setStatus("idle"); }}
          disabled={status === "loading"}
          className="flex-1 text-sm border border-slate-100 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-300 disabled:opacity-50"
        />
        <button
          onClick={apply}
          disabled={!code.trim() || status === "loading"}
          className="px-3 py-2 text-xs font-semibold bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-40 transition whitespace-nowrap"
        >
          {status === "loading" ? "..." : "Apply"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-xs text-red-500 mt-1">{message}</p>
      )}
    </div>
  );
}
