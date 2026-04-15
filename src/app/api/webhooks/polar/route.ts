import { type NextRequest, NextResponse } from "next/server";
import { validateEvent } from "@polar-sh/sdk/webhooks";
import { db } from "~/server/db";
import { env } from "~/env";

export const dynamic = "force-dynamic";

type PolarWebhookPayload = {
  type: string;
  data: {
    id: string;
    created_at: string;
    modified_at: string | null;
    subscription_id?: string;
    product: {
      id: string;
      name: string;
      created_at: string;
      modified_at: string | null;
    };
    product_price: {
      id: string;
      created_at: string;
      modified_at: string | null;
      type: string;
      price_amount: number;
      price_currency: string;
    };
    customer: {
      id: string;
      email: string;
      name: string | null;
      created_at: string;
    };
    customer_metadata?: {
      clerkId?: string;
    };
    metadata?: {
      clerkId?: string;
      ref?: string;
    };
  };
};

function getPlanConfig(productId: string): { credits: number; plan: string; maxWords: number; type: string; isTopUp?: boolean } | null {
  // Credits now represent word count (1 credit = 1 word)
  // All plans get monthly word credits, reset monthly for annual plans
  if (productId === env.POLAR_PRODUCT_SMALL || productId === env.POLAR_PRODUCT_YEARLY_SMALL) {
    return { credits: 7000, plan: 'basic', maxWords: 600, type: productId === env.POLAR_PRODUCT_SMALL ? 'monthly' : 'annual' };
  }
  if (productId === env.POLAR_PRODUCT_MEDIUM || productId === env.POLAR_PRODUCT_YEARLY_MEDIUM) {
    return { credits: 25000, plan: 'pro', maxWords: 2000, type: productId === env.POLAR_PRODUCT_MEDIUM ? 'monthly' : 'annual' };
  }
  if (productId === env.POLAR_PRODUCT_LARGE || productId === env.POLAR_PRODUCT_YEARLY_LARGE) {
    return { credits: 50000, plan: 'ultra', maxWords: 3000, type: productId === env.POLAR_PRODUCT_LARGE ? 'monthly' : 'annual' };
  }

  // Top-up packs (One-time purchases)
  if (productId === env.POLAR_CREDITS_5000) {
    return { credits: 5000, plan: 'topup', maxWords: 0, type: 'one_time', isTopUp: true };
  }
  if (productId === env.POLAR_CREDITS_20000) {
    return { credits: 20000, plan: 'topup', maxWords: 0, type: 'one_time', isTopUp: true };
  }
  if (productId === env.POLAR_CREDITS_45000) {
    return { credits: 45000, plan: 'topup', maxWords: 0, type: 'one_time', isTopUp: true };
  }

  // Unlimited 2-Month Plan — subscription billed every 2 months, $150
  // Treated exactly like other subscription plans: sets credits, plan, maxWords
  if (productId === env.POLAR_PRODUCT_UNLIMITED_2M) {
    return { credits: 999999999, plan: 'unlimited', maxWords: 2000, type: 'monthly' };
  }

  return null;
}

/**
 * Returns the price in cents for a given product ID.
 * Used as a reliable fallback when Polar doesn't include price in the webhook payload.
 */
function getPlanPriceCents(productId: string): number {
  if (productId === env.POLAR_PRODUCT_SMALL)         return 699;   // $6.99/mo
  if (productId === env.POLAR_PRODUCT_MEDIUM)        return 2399;  // $23.99/mo
  if (productId === env.POLAR_PRODUCT_LARGE)         return 4299;  // $42.99/mo
  if (productId === env.POLAR_PRODUCT_YEARLY_SMALL)  return Math.round(699  * 12 * 0.5); // yearly 50% off
  if (productId === env.POLAR_PRODUCT_YEARLY_MEDIUM) return Math.round(2399 * 12 * 0.5);
  if (productId === env.POLAR_PRODUCT_YEARLY_LARGE)  return Math.round(4299 * 12 * 0.5);
  if (productId === env.POLAR_CREDITS_5000)          return 500;   // approximate
  if (productId === env.POLAR_CREDITS_20000)         return 1500;
  if (productId === env.POLAR_CREDITS_45000)         return 3000;
  if (productId === env.POLAR_PRODUCT_UNLIMITED_2M || productId === '683dbfe2-edf6-454b-95a7-a69f489a2ba6') return 15000; // $150.00
  return 0;
}

function getNextResetDate(_type: string, plan?: string): Date {
  const now = new Date();
  const nextDate = new Date(now);
  // unlimited plan: expires 2 months from now (not 1 month like regular subscriptions)
  if (plan === 'unlimited' || _type === 'unlimited_2m') {
    nextDate.setMonth(now.getMonth() + 2);
  } else {
    nextDate.setMonth(now.getMonth() + 1);
  }
  nextDate.setDate(1);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
}

/**
 * Processes affiliate commission for an order.
 * Wrapped in try/catch — MUST NEVER throw or affect order fulfillment.
 */
async function processAffiliateCommission(params: {
  orderId: string;
  buyerClerkId: string;
  priceAmountCents: number;
}): Promise<void> {
  const { orderId, buyerClerkId, priceAmountCents } = params;

  if (!buyerClerkId) {
    console.log("[Affiliate] Skipping — no buyer clerkId");
    return;
  }

  try {
    // Look up the buyer's referral code from their user record
    const buyer = await db.user.findUnique({
      where: { clerkId: buyerClerkId },
      select: { referredByCode: true },
    });

    const refCode = buyer?.referredByCode;

    if (!refCode) {
      console.log(`[Affiliate] No referral code on buyer ${buyerClerkId} — skipping`);
      return;
    }

    // Look up affiliate by referral code
    const affiliate = await db.affiliate.findUnique({
      where: { referralCode: refCode },
    });

    if (!affiliate) {
      console.log(`[Affiliate] No affiliate found for code: ${refCode}`);
      return;
    }

    // Block self-referral (extra safety — should be blocked at apply-code time too)
    if (affiliate.clerkId === buyerClerkId) {
      console.warn(`[Affiliate] Self-referral blocked for affiliate ${affiliate.id}`);
      return;
    }

    // Calculate 10% commission
    const commissionAmount = priceAmountCents > 0
      ? Math.round((priceAmountCents / 100) * 0.10 * 100) / 100
      : 0;

    const availableAt = new Date();
    availableAt.setDate(availableAt.getDate() + 7);

    console.log(`[Affiliate] Creating commission $${commissionAmount} for ${refCode} (buyer: ${buyerClerkId}, order: ${orderId})`);

    // Atomic: create conversion + increment pendingBalance
    // orderId @unique = idempotency key (safe to retry)
    // @@unique([affiliateId, referredClerkId]) = one commission per referred user per affiliate
    await db.$transaction(async (tx) => {
      await tx.affiliateConversion.create({
        data: {
          affiliateId: affiliate.id,
          referredClerkId: buyerClerkId,
          orderId,
          commission: commissionAmount,
          status: "pending",
          availableAt,
        },
      });

      if (commissionAmount > 0) {
        await tx.affiliate.update({
          where: { id: affiliate.id },
          data: { pendingBalance: { increment: commissionAmount } },
        });
      }
    });

    console.log(`[Affiliate] ✅ Commission $${commissionAmount} created for ${refCode}`);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (msg.includes("Unique constraint") || msg.includes("unique constraint")) {
      console.log(`[Affiliate] Duplicate — orderId ${orderId} or buyer already converted. Skipping.`);
    } else {
      console.error("[Affiliate] Commission error:", error);
    }
  }
}

export async function POST(req: NextRequest) {
  console.log("[Polar Webhook] Received webhook");

  try {
    const body = await req.text();
    const webhookSecret = env.POLAR_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error("[Polar Webhook] POLAR_WEBHOOK_SECRET not configured");
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    // Log secret info for debugging (first deploy only)
    console.log("[Polar Webhook] Secret configured:", {
      length: webhookSecret.length,
      prefix: webhookSecret.substring(0, 15),
      startsCorrectly: webhookSecret.startsWith("polar_whs_"),
    });

    const payload = JSON.parse(body) as PolarWebhookPayload;

    // Validate webhook signature
    // Convert Headers to plain object - validateEvent expects Record<string, string>
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      headers[key] = value; // Keep original casing from Polar
    });
    
    // Debug: Log headers for troubleshooting
    console.log("[Polar Webhook] Headers received:", {
      'webhook-id': headers['webhook-id'],
      'webhook-timestamp': headers['webhook-timestamp'],
      'webhook-signature': headers['webhook-signature'] ? 'present' : 'missing',
      allWebhookHeaders: Object.keys(headers).filter(k => k.toLowerCase().startsWith('webhook')),
    });
    
    // validateEvent returns the validated payload or throws WebhookVerificationError
    // NOTE: The Polar SDK automatically base64 encodes the secret internally
    try {
      validateEvent(body, headers, webhookSecret);
      console.log("[Polar Webhook] ✅ Signature validated successfully");
    } catch (validationError) {
      console.error("[Polar Webhook] ❌ Signature validation FAILED");
      console.error("[Polar Webhook] Error:", validationError);
      console.error("[Polar Webhook] Body preview:", body.substring(0, 100) + "...");
      console.error("[Polar Webhook] Body length:", body.length);
      
      // Check if secret might have issues
      const secretIssues = [];
      if (!webhookSecret.startsWith("polar_whs_")) {
        secretIssues.push("Secret doesn't start with 'polar_whs_'");
      }
      if (webhookSecret.includes(" ")) {
        secretIssues.push("Secret contains spaces");
      }
      if (webhookSecret.includes('"') || webhookSecret.includes("'")) {
        secretIssues.push("Secret contains quotes");
      }
      if (webhookSecret.length < 40) {
        secretIssues.push("Secret seems too short");
      }
      
      if (secretIssues.length > 0) {
        console.error("[Polar Webhook] ⚠️  Potential secret issues:", secretIssues);
      }
      
      return NextResponse.json(
        { 
          error: "Invalid signature",
          details: validationError instanceof Error ? validationError.message : String(validationError),
          hint: secretIssues.length > 0 ? "Check webhook secret configuration" : "Secret format looks OK, verify it matches Polar dashboard"
        },
        { status: 401 }
      );
    }

    console.log("[Polar Webhook] Event type:", payload.type);

    // Handle successful payment completion events only
    if (payload.type === "checkout.completed" || payload.type === "order.created" || payload.type === "subscription.created") {
      const { data } = payload;

      // DEBUG: Log full payload structure for troubleshooting
      console.log("[Polar Webhook] Full payload data keys:", Object.keys(data));
      console.log("[Polar Webhook] Payload data (first 800 chars):", JSON.stringify(data).substring(0, 800));
      
      // Safely extract productId — try all known Polar payload structures
      const productId =
        (data as any).product_id ||
        (data as any).product?.id ||
        (data as any).items?.[0]?.product_id ||
        (data as any).items?.[0]?.product?.id ||
        (data as any).products?.[0]?.id ||
        (data as any).line_items?.[0]?.product_id;

      const customerId = (data as any).customer_id || (data as any).customer?.id;

      console.log("[Polar Webhook] Extracted productId:", productId, "customerId:", customerId);
      const subscriptionId = (data as any).subscription_id || (data as any).id; // For subscription events, id is subscription_id

      console.log(`[Polar Webhook] Processing product ID: ${productId}`);

      if (!productId) {
         console.error("[Polar Webhook] Could not find product ID in payload data:", Object.keys(data));
         return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
      }

      const planConfig = getPlanConfig(productId);

      if (!planConfig) {
        // Last resort: try to match by checking if this looks like the unlimited product
        // by checking the product name in the payload
        const productName = (data as any).product?.name?.toLowerCase() ?? '';
        const isUnlimitedByName = productName.includes('unlimited');

        console.error("[Polar Webhook] Unknown product ID:", productId);
        console.error("[Polar Webhook] Product name from payload:", productName);
        console.error("[Polar Webhook] POLAR_PRODUCT_UNLIMITED_2M env:", env.POLAR_PRODUCT_UNLIMITED_2M);
        console.error("[Polar Webhook] Product ID matches unlimited env?", productId === env.POLAR_PRODUCT_UNLIMITED_2M);
        console.error("[Polar Webhook] Available products:", {
            small: env.POLAR_PRODUCT_SMALL,
            medium: env.POLAR_PRODUCT_MEDIUM,
            large: env.POLAR_PRODUCT_LARGE,
            topup5k: env.POLAR_CREDITS_5000,
            topup20k: env.POLAR_CREDITS_20000,
            topup45k: env.POLAR_CREDITS_45000,
            unlimited2m: env.POLAR_PRODUCT_UNLIMITED_2M,
        });

        // Fallback: if product name contains "unlimited", treat as unlimited plan
        if (isUnlimitedByName) {
          console.log("[Polar Webhook] ⚠️ Falling back to unlimited plan by product name match");
          // Process as unlimited plan
          const clerkIdFallback =
            data.customer_metadata?.clerkId ||
            data.metadata?.clerkId ||
            (data as any).checkout?.metadata?.clerkId;

          if (clerkIdFallback) {
            const now = new Date();
            const twoMonths = new Date(now);
            twoMonths.setMonth(now.getMonth() + 2);
            twoMonths.setDate(1);
            twoMonths.setHours(0, 0, 0, 0);

            await db.user.update({
              where: { clerkId: clerkIdFallback },
              data: {
                credits: 999999999,
                subscriptionPlan: 'unlimited',
                subscriptionType: 'monthly',
                maxWordsPerRequest: 2000,
                nextResetDate: twoMonths,
                polarCustomerId: (data as any).customer_id || (data as any).customer?.id || undefined,
              },
            });
            console.log("[Polar Webhook] ✅ Unlimited plan granted via name fallback for:", clerkIdFallback);
            return NextResponse.json({ success: true, message: "Unlimited plan granted via fallback" });
          }
        }

        return NextResponse.json(
          { error: "Unknown product" },
          { status: 400 }
        );
      }

      // Get clerkId from metadata
      // Check multiple possible locations for metadata depending on event type
      const clerkId = 
        data.customer_metadata?.clerkId || 
        data.metadata?.clerkId || 
        (data as any).checkout?.metadata?.clerkId ||
        (data as any).order?.metadata?.clerkId;

      if (!clerkId) {
        console.error("[Polar Webhook] No clerkId in metadata. Data keys:", Object.keys(data));
        return NextResponse.json(
          { error: "No clerkId in metadata" },
          { status: 400 }
        );
      }

      console.log("[Polar Webhook] Processing purchase:", {
        clerkId,
        polarCustomerId: customerId,
        polarSubscriptionId: subscriptionId,
        productId,
        plan: planConfig.plan,
        credits: planConfig.credits,
        type: planConfig.type,
        isTopUp: planConfig.isTopUp,
      });

      // Update user credits and plan info
      try {
        if (planConfig.isTopUp) {
          // For top-ups: INCREMENT extraCredits, do NOT change subscription plan
          const user = await db.user.update({
            where: { clerkId },
            data: {
              extraCredits: { increment: planConfig.credits },
              polarCustomerId: customerId,
            },
          });

          console.log("[Polar Webhook] Top-up successful:", {
            userId: user.id,
            addedExtraCredits: planConfig.credits,
            newExtraBalance: user.extraCredits,
          });
        } else {
          // For subscriptions: SET credits (replace old value) and update plan
          // unlimited plan always gets a 2-month reset date; annual gets 1-month; monthly gets null
          const shouldSetResetDate = planConfig.type === 'annual' || planConfig.plan === 'unlimited';
          const nextReset = shouldSetResetDate ? getNextResetDate(planConfig.type, planConfig.plan) : null;
          
          const user = await db.user.update({
            where: { clerkId },
            data: {
              credits: planConfig.credits,
              subscriptionPlan: planConfig.plan,
              subscriptionType: planConfig.type,
              productId: productId,
              polarCustomerId: customerId,
              polarSubscriptionId: subscriptionId || null,
              maxWordsPerRequest: planConfig.maxWords,
              nextResetDate: nextReset,
            },
          });

          console.log("[Polar Webhook] Subscription updated successfully:", {
            userId: user.id,
            newBalance: user.credits,
            plan: user.subscriptionPlan,
            type: user.subscriptionType,
            nextReset: user.nextResetDate,
          });
        }

        // Process affiliate commission AFTER successful fulfillment
        // Read referredByCode from the user's DB record — reliable, no cookies needed
        const orderId = (data as any).order?.id ?? (data as any).id ?? (data as any).order_id;

        // Use our hardcoded price map as primary source (most reliable)
        // Fall back to what Polar sends in the payload
        const polarPrice =
          data.product_price?.price_amount ??
          (data as any).amount ??
          (data as any).order?.amount ??
          (data as any).net_amount ??
          0;

        const finalPriceCents = (typeof polarPrice === 'number' && polarPrice > 0)
          ? polarPrice
          : getPlanPriceCents(productId); // reliable fallback from our config

        console.log("[Affiliate] Commission check — clerkId:", clerkId, "orderId:", String(orderId), "priceCents:", finalPriceCents, "productId:", productId);

        await processAffiliateCommission({
          orderId: String(orderId),
          buyerClerkId: clerkId,
          priceAmountCents: finalPriceCents,
        });

        return NextResponse.json({
          success: true,
          message: "Credits updated successfully",
        });
      } catch (error) {
        console.error("[Polar Webhook] Database error:", error);
        return NextResponse.json(
          { error: "Failed to update user credits" },
          { status: 500 }
        );
      }
    }

    // Acknowledge other events
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Polar Webhook] Error processing webhook:", error);
    return NextResponse.json(
      {
        error: "Webhook processing failed",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
