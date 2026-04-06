import { createHash } from "crypto";
import { env } from "~/env";

const CRYPTOMUS_PAYOUT_URL = "https://api.cryptomus.com/v1/payout";

/**
 * Signs a Cryptomus API request.
 * Signature = md5( base64(body) + CRYPTOMUS_API_KEY )
 */
export function signRequest(body: string): string {
  const base64Body = Buffer.from(body).toString("base64");
  return createHash("md5")
    .update(base64Body + (env.CRYPTOMUS_API_KEY ?? ""))
    .digest("hex");
}

export interface CryptomusPayoutParams {
  amount: string;
  walletAddress: string;
  orderId: string;
  network?: string;
}

export interface CryptomusPayoutResult {
  success: boolean;
  cryptomusId?: string;
  error?: string;
}

/**
 * Sends a USDT payout via the Cryptomus Mass Payout API.
 * Network defaults to TRON (TRC-20) — lowest fees, fastest settlement.
 */
export async function sendPayout(
  params: CryptomusPayoutParams
): Promise<CryptomusPayoutResult> {
  const { amount, walletAddress, orderId, network = "TRON" } = params;

  const body = JSON.stringify({
    amount,
    currency: "USDT",
    network,
    order_id: orderId,
    address: walletAddress,
  });

  const sign = signRequest(body);

  try {
    const response = await fetch(CRYPTOMUS_PAYOUT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        merchant: env.CRYPTOMUS_MERCHANT_ID ?? "",
        sign,
      },
      body,
    });

    const data = await response.json() as {
      state?: number;
      result?: { uuid?: string };
      message?: string;
      errors?: Record<string, string[]>;
    };

    if (!response.ok || data.state !== 0) {
      const errorMsg =
        data.message ??
        Object.values(data.errors ?? {}).flat().join(", ") ??
        `Cryptomus error: HTTP ${response.status}`;
      console.error("[Cryptomus] Payout failed:", errorMsg);
      return { success: false, error: errorMsg };
    }

    return {
      success: true,
      cryptomusId: data.result?.uuid,
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[Cryptomus] Request failed:", msg);
    return { success: false, error: msg };
  }
}
