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

export default function AffiliateDashboard({ affiliate: initialAffiliate }: Props) {
  const [affiliate, setAffiliate] = useState<AffiliateData | null>(initialAffiliate);
  const [registering, setRegistering] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [network, setNetwork] = useState("TRX");
  const [payingOut, setPayingOut] = useState(false);
  const [copied, setCopied] = useState(false);

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
      toast.success("You're now an affiliate!");
    } else {
      toast.error(result.error ?? "Registration failed");
    }
  };

  const handleCopy = async () => {
    if (!affiliate) return;
    await navigator.clipboard.writeText(affiliate.referralUrl);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
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
      toast.success(`Payout of $${result.amount} USDT initiated! It will arrive in your wallet shortly.`);
      setWalletAddress("");
      window.location.reload();
    } else {
      toast.error(result.error ?? "Payout failed");
    }
  };

  const statusColor = (status: string) => {
    if (status === "completed") return "text-green-600";
    if (status === "failed") return "text-red-500";
    return "text-yellow-600";
  };

  if (!affiliate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Affiliate Program</h1>
          <p className="text-gray-500 mb-6">
            Earn 25% commission on every user you refer. Payouts in USDT once you reach $15.
          </p>
          <button
            onClick={handleRegister}
            disabled={registering}
            className="w-full bg-black text-white rounded-xl py-3 font-medium hover:bg-gray-800 disabled:opacity-50 transition"
          >
            {registering ? "Joining..." : "Join Affiliate Program"}
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
        <h1 className="text-2xl font-semibold text-gray-900">Affiliate Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Referral Code", value: affiliate.referralCode },
            { label: "Conversions", value: String(affiliate.conversionCount) },
            { label: "Pending ($)", value: `$${affiliate.pendingBalance}` },
            { label: "Available ($)", value: `$${affiliate.availableBalance}` },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className="text-lg font-semibold text-gray-900 truncate">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Referral link */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-700 mb-2">Your Referral Link</p>
          <div className="flex gap-2">
            <input
              readOnly
              value={affiliate.referralUrl}
              className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-700 truncate"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition whitespace-nowrap"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Share this link. When someone signs up and pays, you earn 25% commission.
          </p>
        </div>

        {/* Payout request */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-700 mb-1">Withdraw USDT</p>
          <p className="text-xs text-gray-400 mb-4">
            Minimum $15.00 available. Choose your network, enter your wallet address, and click Withdraw.
          </p>

          <form onSubmit={handlePayout} className="space-y-3">
            {/* Network selector */}
            <div>
              <p className="text-xs text-gray-500 mb-2 font-medium">1. Select Network</p>
              <div className="grid grid-cols-3 gap-2">
                {NETWORKS.map((n) => (
                  <button
                    key={n.value}
                    type="button"
                    onClick={() => setNetwork(n.value)}
                    disabled={!canPayout || payingOut}
                    className={`rounded-lg border px-3 py-2.5 text-left transition disabled:opacity-40 ${
                      network === n.value
                        ? "border-black bg-black text-white"
                        : "border-gray-200 text-gray-700 hover:border-gray-400 bg-white"
                    }`}
                  >
                    <span className="block text-xs font-bold">{n.label}</span>
                    <span className={`block text-[10px] mt-0.5 ${network === n.value ? "text-white/70" : "text-gray-400"}`}>
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
                placeholder={`Your USDT ${NETWORKS.find(n => n.value === network)?.label} address`}
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                disabled={!canPayout || payingOut}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 disabled:bg-gray-50 disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10"
              />
              <p className="text-[10px] text-gray-400 mt-1">
                Double-check your address — crypto transactions are irreversible.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!canPayout || payingOut || !walletAddress.trim()}
              className="w-full py-3 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 disabled:opacity-40 transition"
            >
              {payingOut
                ? "Processing withdrawal..."
                : canPayout
                ? `Withdraw $${affiliate.availableBalance} USDT`
                : `Need $15.00 minimum (you have $${affiliate.availableBalance})`}
            </button>
          </form>
        </div>

        {/* Payout history */}
        {affiliate.payouts.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm font-medium text-gray-700 mb-4">Withdrawal History</p>
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
                    <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full ${
                      p.status === "completed" ? "bg-green-50 text-green-700" :
                      p.status === "failed" ? "bg-red-50 text-red-600" :
                      "bg-yellow-50 text-yellow-700"
                    }`}>
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
