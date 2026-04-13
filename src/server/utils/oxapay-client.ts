import { env } from "~/env";

const OXAPAY_PAYOUT_URL = "https://api.oxapay.com/api/send";

export interface OxaPayPayoutParams {
  amount: string;
  walletAddress: string;
  orderId: string;
  /** Blockchain network — defaults to TRX (TRON/TRC-20), lowest fees */
  network?: string;
}

export interface OxaPayPayoutResult {
  success: boolean;
  /** OxaPay trackId — stored as the external payout reference */
  trackId?: string;
  error?: string;
}

/**
 * Sends a USDT payout via the OxaPay Payout API.
 * No signature required — authentication is via the Payout API Key in the body.
 * Network defaults to TRX (TRON TRC-20) — lowest fees, fastest settlement.
 * Docs: https://docs.oxapay.com/api-reference/payout/generate-payout
 */
export async function sendPayout(
  params: OxaPayPayoutParams
): Promise<OxaPayPayoutResult> {
  const { amount, walletAddress, network = "TRX" } = params;

  const body = JSON.stringify({
    payout_api_key: env.OXAPAY_PAYOUT_API_KEY ?? "",
    address: walletAddress,
    currency: "USDT",
    network,
    amount: parseFloat(amount),
    description: `HumanifyLab affiliate payout`,
  });

  try {
    const response = await fetch(OXAPAY_PAYOUT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    const data = await response.json() as {
      result?: number;
      message?: string;
      trackId?: string;
      data?: { trackId?: string };
    };

    // OxaPay returns result=100 on success
    if (!response.ok || data.result !== 100) {
      const errorMsg = data.message ?? `OxaPay error: HTTP ${response.status}`;
      console.error("[OxaPay] Payout failed:", errorMsg);
      return { success: false, error: errorMsg };
    }

    const trackId = data.trackId ?? data.data?.trackId;
    return { success: true, trackId };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[OxaPay] Request failed:", msg);
    return { success: false, error: msg };
  }
}
