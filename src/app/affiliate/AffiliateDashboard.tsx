"use client";

import { useState } from "react";
import { toast } from "sonner";
import { registerAffiliate, requestPayout } from "./actions";

interface Payout {
  id: string;
  amount: string;
  status: string;
  cryptomusId: string | null;
  createdAt: string;
}

interface AffiliateData {
  referralCode: string;
  referralUrl: string;
  conversionCount: number;
  pendingBalance: string;
  availableBalance: string;
  payouts: Payout[];
}

interface Props {
  affiliate: AffiliateData | null;
}

const NETWORKS = [
  { value: "TRX", label: "TRON", sublabel: "TRC-20 · Lowest fees" },
  { value: "ETH", label: "Ethereum", sublabel: "ERC-20 · Higher fees" },
  { value: "BSC", label: "BNB Chain", sublabel: "BEP-20 · Low fees" },
];

const COMMISSION_RATE = 0.10;

const PLANS = [
  { plan: "Basic",  monthly: 6.99,  yearlyAnnual: 6.99  * 12 * 0.5, borderColor: "border-gray-200",   badgeClass: "bg-gray-100 text-gray-600" },
  { plan: "Pro",    monthly: 23.99, yearlyAnnual: 23.99 * 12 * 0.5, borderColor: "border-violet-200", badgeClass: "bg-violet-50 text-violet-700" },
  { plan: "Ultra",  monthly: 42.99, yearlyAnnual: 42.99 * 12 * 0.5, borderColor: "border-amber-200",  badgeClass: "bg-amber-50 text-amber-700" },
];

export default function AffiliateDashboard({ affiliate: initialAffiliate }: Props) {
  const [affiliate, setAffiliate] = useState<AffiliateData | null>(initialAffiliate);
  const [registering, setRegistering] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [network, setNetwork] = useState("TRX");
  const [payingOut, setPayingOut] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const handleRegister = async () => {
    setRegistering(true);
    const result = await registerAffiliate();
    setRegistering(false);
    if (result.success && result.referralCode && result.referralUrl) {
      setAffiliate({
        referralCode: result.referralCode,
        referralUrl: result.referralUrl,
        conversionCount: 0,
        pendingBalance: "0.00",
        availableBalance: "0.00",
        payouts: [],
      });
      toast.success("You're now an affiliate! Share your code to start earning.");
    } else {
      toast.error(result.error ?? "Registration failed");
    }
  };

  const handlePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress.trim()) {
      toast.error("Please enter your USDT wallet address");
      return;
    }
    setPayingOut(true);
    const result = await requestPayout(walletAddress.trim(), network);
    setPayingOut(false);
    if (result.success) {
      toast.success(`$${result.amount} USDT withdrawal initiated! It will arrive in your wallet shortly.`);
      setWalletAddress("");
      window.location.reload();
    } else {
      toast.error(result.error ?? "Payout failed");
    }
  };

  // ── Registration screen ───────────────────────────────────────────────────
  if (!affiliate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <div className="text-4xl mb-4">💸</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Affiliate Program</h1>
          <p className="text-gray-500 text-sm mb-2">
            Earn <span className="font-semibold text-gray-900">10% commission</span> on every user you refer.
          </p>
          <p className="text-gray-400 text-xs mb-6">
            You get a unique referral code. Share it with friends — when they sign up and pay, you earn 10% of their first payment in USDT. Minimum $15 to withdraw.
          </p>
          <button
            onClick={handleRegister}
            disabled={registering}
            className="w-full bg-black text-white rounded-xl py-3 font-semibold hover:bg-gray-800 disabled:opacity-50 transition"
          >
            {registering ? "Setting up..." : "Join Affiliate Program"}
          </button>
        </div>
      </div>
    );
  }

  const available = parseFloat(affiliate.availableBalance);
  const canPayout = available >= 15;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Affiliate Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Earn 10% on every first payment from users you refer</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Your Code", value: affiliate.referralCode, mono: true },
            { label: "Conversions", value: String(affiliate.conversionCount) },
            { label: "Pending", value: "$" + affiliate.pendingBalance },
            { label: "Available", value: "$" + affiliate.availableBalance },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className={"text-lg font-bold text-gray-900 truncate" + (stat.mono ? " font-mono" : "")}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Referral Code — code only, no link */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-900 mb-1">🎯 Your Referral Code</p>
          <p className="text-xs text-gray-400 mb-4">
            Share this code with anyone. When they sign up on HumanifyLab and enter your code, you earn 10% of their first payment.
          </p>

          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-950 text-white rounded-xl px-5 py-4 font-mono text-xl font-bold tracking-[0.2em] text-center select-all">
              {affiliate.referralCode}
            </div>
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(affiliate.referralCode);
                setCodeCopied(true);
                toast.success("Code copied to clipboard!");
                setTimeout(() => setCodeCopied(false), 2500);
              }}
              className="px-5 py-4 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition whitespace-nowrap"
            >
              {codeCopied ? "✓ Copied!" : "Copy Code"}
            </button>
          </div>

          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg px-4 py-3">
            <p className="text-xs text-blue-700 font-medium">📋 How it works</p>
            <ol className="text-xs text-blue-600 mt-1 space-y-0.5 list-decimal list-inside">
              <li>Share your code with a friend</li>
              <li>They sign up on HumanifyLab and enter your code</li>
              <li>When they pay for any plan, you earn 10%</li>
              <li>Commission is held 7 days, then available to withdraw</li>
            </ol>
          </div>
        </div>

        {/* Earnings breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-900 mb-1">💰 What You Earn Per Referral</p>
          <p className="text-xs text-gray-400 mb-4">
            10% of the referred user&apos;s first payment — one time per user.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PLANS.map((tier) => {
              const me  = (tier.monthly * COMMISSION_RATE).toFixed(2);
              const ye  = (tier.yearlyAnnual * COMMISSION_RATE).toFixed(2);
              const m10 = (tier.monthly * COMMISSION_RATE * 10).toFixed(2);
              const y10 = (tier.yearlyAnnual * COMMISSION_RATE * 10).toFixed(2);
              return (
                <div key={tier.plan} className={"rounded-xl border-2 p-4 flex flex-col gap-2 " + tier.borderColor}>
                  <span className={"self-start text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full " + tier.badgeClass}>
                    {tier.plan}
                  </span>
                  <div className="mt-1">
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium mb-0.5">Monthly plan</p>
                    <p className="text-2xl font-black text-gray-900">${me}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium mb-0.5">Yearly plan</p>
                    <p className="text-xl font-bold text-green-600">${ye}</p>
                  </div>
                  <div className="mt-1 pt-3 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-1.5">If 10 users buy</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700 font-bold">${m10}</span>
                      <span className="text-xs text-gray-400 self-end">monthly</span>
                    </div>
                    <div className="flex justify-between text-sm mt-0.5">
                      <span className="text-green-600 font-bold">${y10}</span>
                      <span className="text-xs text-gray-400 self-end">yearly</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-gray-400 mt-3 text-center">
            Yearly = 50% discounted annual price · 7-day hold before funds are available to withdraw
          </p>
        </div>

        {/* Withdraw */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-1">💳 Withdraw USDT</p>
          <p className="text-xs text-gray-400 mb-4">
            Minimum $15.00 available balance. Paid directly to your crypto wallet.
          </p>

          <form onSubmit={handlePayout} className="space-y-3">
            {/* Network */}
            <div>
              <p className="text-xs text-gray-500 mb-2 font-medium">1. Select Network</p>
              <div className="grid grid-cols-3 gap-2">
                {NETWORKS.map((n) => (
                  <button
                    key={n.value}
                    type="button"
                    onClick={() => setNetwork(n.value)}
                    disabled={!canPayout || payingOut}
                    className={
                      "rounded-lg border px-3 py-2.5 text-left transition disabled:opacity-40 " +
                      (network === n.value
                        ? "border-black bg-black text-white"
                        : "border-gray-200 text-gray-700 hover:border-gray-400 bg-white")
                    }
                  >
                    <span className="block text-xs font-bold">{n.label}</span>
                    <span className={"block text-[10px] mt-0.5 " + (network === n.value ? "text-white/70" : "text-gray-400")}>
                      {n.sublabel}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Wallet address */}
            <div>
              <p className="text-xs text-gray-500 mb-2 font-medium">2. Enter Your USDT Wallet Address</p>
              <input
                type="text"
                placeholder={"Your USDT " + (NETWORKS.find((n) => n.value === network)?.label ?? "") + " address"}
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                disabled={!canPayout || payingOut}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 disabled:bg-gray-50 disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                ⚠️ Double-check your address — crypto transactions are irreversible.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!canPayout || payingOut || !walletAddress.trim()}
              className="w-full py-3 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 disabled:opacity-40 transition"
            >
              {payingOut
                ? "Processing..."
                : canPayout
                ? "Withdraw $" + affiliate.availableBalance + " USDT"
                : "Need $15.00 minimum (you have $" + affiliate.availableBalance + ")"}
            </button>
          </form>
        </div>

        {/* Payout history */}
        {affiliate.payouts.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm font-semibold text-gray-700 mb-4">Withdrawal History</p>
            <div className="space-y-3">
              {affiliate.payouts.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div>
                    <span className="font-semibold text-gray-900">${p.amount} USDT</span>
                    <span className="text-gray-400 ml-2 text-xs">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={
                      "text-xs font-semibold capitalize px-2 py-0.5 rounded-full " +
                      (p.status === "completed" ? "bg-green-50 text-green-700" :
                       p.status === "failed"    ? "bg-red-50 text-red-600" :
                                                  "bg-yellow-50 text-yellow-700")
                    }>
                      {p.status}
                    </span>
                    {p.cryptomusId && (
                      <p className="text-[10px] text-gray-400 mt-1 truncate max-w-[140px]">
                        ID: {p.cryptomusId}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
