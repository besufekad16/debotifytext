"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Check, Copy, Wallet, Users, TrendingUp, AlertTriangle } from "lucide-react";
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
  { plan: "Basic", monthly: 6.99, yearlyAnnual: 6.99 * 12 * 0.5 },
  { plan: "Pro", monthly: 23.99, yearlyAnnual: 23.99 * 12 * 0.5 },
  { plan: "Ultra", monthly: 42.99, yearlyAnnual: 42.99 * 12 * 0.5 },
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
      <div className="flex min-h-[70vh] items-center justify-center bg-[#faf7f4] p-4">
        <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5e3d2a]">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <h1 className="mb-2 text-2xl font-semibold tracking-tight text-gray-900">Affiliate Program</h1>
          <p className="mb-2 text-sm text-gray-600">
            Earn <span className="font-semibold text-gray-900">10% commission</span> on every user you refer.
          </p>
          <p className="mb-7 text-xs leading-relaxed text-gray-500">
            You get a unique referral code. Share it with friends — when they sign up and pay, you earn 10% of their
            first payment in USDT. Minimum $15 to withdraw.
          </p>
          <button
            onClick={handleRegister}
            disabled={registering}
            className="w-full rounded-xl bg-[#5e3d2a] py-3.5 text-sm font-semibold text-white transition hover:bg-[#4a2f1f] disabled:opacity-50"
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
    <div className="min-h-screen bg-[#faf7f4] px-4 py-10 md:py-14">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b6f47]">Affiliates</span>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
            Affiliate Dashboard
          </h1>
          <p className="mt-1.5 text-sm text-gray-600">Earn 10% on every first payment from users you refer.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Your Code", value: affiliate.referralCode, mono: true },
            { label: "Conversions", value: String(affiliate.conversionCount) },
            { label: "Pending", value: "$" + affiliate.pendingBalance },
            { label: "Available", value: "$" + affiliate.availableBalance },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-gray-200 bg-white p-4">
              <p className="mb-1 text-xs text-gray-500">{stat.label}</p>
              <p className={"truncate text-lg font-bold text-gray-900" + (stat.mono ? " font-mono" : "")}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Referral code */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="mb-1 flex items-center gap-2">
            <Users className="h-4 w-4 text-[#8b6f47]" />
            <p className="text-sm font-semibold text-gray-900">Your Referral Code</p>
          </div>
          <p className="mb-4 text-xs leading-relaxed text-gray-500">
            Share this code with anyone. When they sign up on HumanifyLab and enter your code, you earn 10% of their
            first payment.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1 select-all rounded-xl bg-[#0f1419] px-5 py-4 text-center font-mono text-xl font-bold tracking-[0.2em] text-white">
              {affiliate.referralCode}
            </div>
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(affiliate.referralCode);
                setCodeCopied(true);
                toast.success("Code copied to clipboard!");
                setTimeout(() => setCodeCopied(false), 2500);
              }}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#5e3d2a] px-5 py-4 text-sm font-semibold text-white transition hover:bg-[#4a2f1f]"
            >
              {codeCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {codeCopied ? "Copied" : "Copy Code"}
            </button>
          </div>

          <div className="mt-4 rounded-xl border border-[#e8ddd5] bg-[#faf7f4] px-4 py-3">
            <p className="text-xs font-semibold text-[#5e3d2a]">How it works</p>
            <ol className="mt-1 list-inside list-decimal space-y-0.5 text-xs text-gray-600">
              <li>Share your code with a friend</li>
              <li>They sign up on HumanifyLab and enter your code</li>
              <li>When they pay for any plan, you earn 10%</li>
              <li>Commission is held 7 days, then available to withdraw</li>
            </ol>
          </div>
        </div>

        {/* Earnings breakdown */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="mb-1 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#8b6f47]" />
            <p className="text-sm font-semibold text-gray-900">What You Earn Per Referral</p>
          </div>
          <p className="mb-4 text-xs text-gray-500">
            10% of the referred user&apos;s first payment — one time per user.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {PLANS.map((tier) => {
              const me = (tier.monthly * COMMISSION_RATE).toFixed(2);
              const ye = (tier.yearlyAnnual * COMMISSION_RATE).toFixed(2);
              const m10 = (tier.monthly * COMMISSION_RATE * 10).toFixed(2);
              const y10 = (tier.yearlyAnnual * COMMISSION_RATE * 10).toFixed(2);
              return (
                <div key={tier.plan} className="flex flex-col gap-2 rounded-xl border border-gray-200 p-4">
                  <span className="self-start rounded-full bg-[#5e3d2a]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#5e3d2a]">
                    {tier.plan}
                  </span>
                  <div className="mt-1">
                    <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-400">
                      Monthly plan
                    </p>
                    <p className="text-2xl font-bold text-gray-900">${me}</p>
                  </div>
                  <div>
                    <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wide text-gray-400">Yearly plan</p>
                    <p className="text-xl font-bold text-[#5e3d2a]">${ye}</p>
                  </div>
                  <div className="mt-1 border-t border-gray-100 pt-3">
                    <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                      If 10 users buy
                    </p>
                    <div className="flex justify-between text-sm">
                      <span className="font-bold text-gray-700">${m10}</span>
                      <span className="self-end text-xs text-gray-400">monthly</span>
                    </div>
                    <div className="mt-0.5 flex justify-between text-sm">
                      <span className="font-bold text-[#5e3d2a]">${y10}</span>
                      <span className="self-end text-xs text-gray-400">yearly</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-center text-[10px] text-gray-400">
            Yearly = 50% discounted annual price · 7-day hold before funds are available to withdraw
          </p>
        </div>

        {/* Withdraw */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="mb-1 flex items-center gap-2">
            <Wallet className="h-4 w-4 text-[#8b6f47]" />
            <p className="text-sm font-semibold text-gray-900">Withdraw USDT</p>
          </div>
          <p className="mb-4 text-xs text-gray-500">
            Minimum $15.00 available balance. Paid directly to your crypto wallet.
          </p>

          <form onSubmit={handlePayout} className="space-y-4">
            {/* Network */}
            <div>
              <p className="mb-2 text-xs font-medium text-gray-500">1. Select Network</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {NETWORKS.map((n) => (
                  <button
                    key={n.value}
                    type="button"
                    onClick={() => setNetwork(n.value)}
                    disabled={!canPayout || payingOut}
                    className={
                      "rounded-xl border px-3 py-2.5 text-left transition disabled:opacity-40 " +
                      (network === n.value
                        ? "border-[#5e3d2a] bg-[#5e3d2a] text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-[#8b6f47]")
                    }
                  >
                    <span className="block text-xs font-bold">{n.label}</span>
                    <span
                      className={"mt-0.5 block text-[10px] " + (network === n.value ? "text-white/70" : "text-gray-400")}
                    >
                      {n.sublabel}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Wallet address */}
            <div>
              <p className="mb-2 text-xs font-medium text-gray-500">2. Enter Your USDT Wallet Address</p>
              <input
                type="text"
                placeholder={"Your USDT " + (NETWORKS.find((n) => n.value === network)?.label ?? "") + " address"}
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                disabled={!canPayout || payingOut}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm transition focus:border-[#8b6f47] focus:outline-none disabled:bg-gray-50 disabled:text-gray-400"
              />
              <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-gray-500">
                <AlertTriangle className="h-3 w-3 text-amber-500" />
                Double-check your address — crypto transactions are irreversible.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!canPayout || payingOut || !walletAddress.trim()}
              className="w-full rounded-xl bg-[#5e3d2a] py-3.5 text-sm font-semibold text-white transition hover:bg-[#4a2f1f] disabled:opacity-40"
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
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="mb-4 text-sm font-semibold text-gray-900">Withdrawal History</p>
            <div className="space-y-3">
              {affiliate.payouts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between border-b border-gray-100 pb-3 text-sm last:border-0 last:pb-0"
                >
                  <div>
                    <span className="font-semibold text-gray-900">${p.amount} USDT</span>
                    <span className="ml-2 text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-right">
                    <span
                      className={
                        "rounded-full px-2 py-0.5 text-xs font-semibold capitalize " +
                        (p.status === "completed"
                          ? "bg-green-50 text-green-700"
                          : p.status === "failed"
                            ? "bg-red-50 text-red-600"
                            : "bg-yellow-50 text-yellow-700")
                      }
                    >
                      {p.status}
                    </span>
                    {p.cryptomusId && (
                      <p className="mt-1 max-w-[140px] truncate text-[10px] text-gray-400">ID: {p.cryptomusId}</p>
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
