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

export default function AffiliateDashboard({ affiliate: initialAffiliate }: Props) {
  const [affiliate, setAffiliate] = useState<AffiliateData | null>(initialAffiliate);
  const [registering, setRegistering] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
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
    const result = await requestPayout(walletAddress.trim());
    setPayingOut(false);
    if (result.success) {
      toast.success(`Payout of $${result.amount} initiated!`);
      setWalletAddress("");
      // Refresh page to show updated balances
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
            { label: "Pending", value: `$${affiliate.pendingBalance}` },
            { label: "Available", value: `$${affiliate.availableBalance}` },
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
        </div>

        {/* Payout request */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-700 mb-1">Request Payout</p>
          <p className="text-xs text-gray-400 mb-4">
            Minimum $15.00 available balance. Paid in USDT (TRC-20).
          </p>
          <form onSubmit={handlePayout} className="flex gap-2">
            <input
              type="text"
              placeholder="Your USDT (TRC-20) wallet address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              disabled={!canPayout || payingOut}
              className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 disabled:bg-gray-50 disabled:text-gray-400"
            />
            <button
              type="submit"
              disabled={!canPayout || payingOut}
              className="px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 disabled:opacity-40 transition whitespace-nowrap"
            >
              {payingOut ? "Processing..." : `Withdraw $${affiliate.availableBalance}`}
            </button>
          </form>
          {!canPayout && (
            <p className="text-xs text-gray-400 mt-2">
              You need at least $15.00 available to request a payout. Current: ${affiliate.availableBalance}
            </p>
          )}
        </div>

        {/* Payout history */}
        {affiliate.payouts.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm font-medium text-gray-700 mb-4">Payout History</p>
            <div className="space-y-3">
              {affiliate.payouts.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium text-gray-900">${p.amount}</span>
                    <span className="text-gray-400 ml-2">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`font-medium capitalize ${statusColor(p.status)}`}>
                      {p.status}
                    </span>
                    {p.cryptomusId && (
                      <p className="text-xs text-gray-400 truncate max-w-[120px]">
                        {p.cryptomusId}
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
