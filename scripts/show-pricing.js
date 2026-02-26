#!/usr/bin/env node

/**
 * Display Current Pricing from Polar
 * 
 * This script fetches and displays all product prices from Polar
 */

import { Polar } from "@polar-sh/sdk";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const POLAR_ACCESS_TOKEN = process.env.POLAR_ACCESS_TOKEN;
const POLAR_ENV = process.env.POLAR_ENV || "sandbox";

// Product IDs from environment
const PRODUCTS = {
  "Basic (Monthly)": process.env.POLAR_PRODUCT_SMALL,
  "Basic (Yearly)": process.env.POLAR_PRODUCT_YEARLY_SMALL,
  "Pro (Monthly)": process.env.POLAR_PRODUCT_MEDIUM,
  "Pro (Yearly)": process.env.POLAR_PRODUCT_YEARLY_MEDIUM,
  "Ultra (Monthly)": process.env.POLAR_PRODUCT_LARGE,
  "Ultra (Yearly)": process.env.POLAR_PRODUCT_YEARLY_LARGE,
};

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function formatPrice(priceAmount, currency) {
  if (!priceAmount) return "N/A";
  const amount = (priceAmount / 100).toFixed(2);
  return `$${amount} ${currency || 'USD'}`;
}

async function fetchProductDetails(productId) {
  if (!productId) return null;

  try {
    const polar = new Polar({
      accessToken: POLAR_ACCESS_TOKEN,
      server: POLAR_ENV,
    });

    const product = await polar.products.get({ id: productId });
    const price = product.prices?.find((p) => p.amountType === "fixed" && !p.isArchived) ?? product.prices?.[0];

    return {
      name: product.name,
      priceAmount: price?.priceAmount,
      currency: price?.priceCurrency,
      interval: price?.recurringInterval,
      type: price?.type,
    };
  } catch (error) {
    console.error(`Error fetching product ${productId}:`, error.message);
    return null;
  }
}

async function main() {
  log('\n' + '='.repeat(70), 'bold');
  log('💰 CURRENT PRICING FROM POLAR', 'bold');
  log('='.repeat(70) + '\n', 'bold');

  if (!POLAR_ACCESS_TOKEN) {
    log('❌ POLAR_ACCESS_TOKEN not found in environment variables', 'yellow');
    log('Please set POLAR_ACCESS_TOKEN in your .env file\n');
    process.exit(1);
  }

  log(`Environment: ${POLAR_ENV}`, 'cyan');
  log('');

  const results = {};

  for (const [planName, productId] of Object.entries(PRODUCTS)) {
    if (!productId) {
      log(`⚠️  ${planName}: Not configured`, 'yellow');
      continue;
    }

    log(`Fetching ${planName}...`, 'blue');
    const details = await fetchProductDetails(productId);

    if (details) {
      results[planName] = details;
      const price = formatPrice(details.priceAmount, details.currency);
      const interval = details.interval ? `/${details.interval}` : '';
      log(`✅ ${planName}: ${price}${interval}`, 'green');
    } else {
      log(`❌ ${planName}: Failed to fetch`, 'yellow');
    }
  }

  // Display summary table
  log('\n' + '='.repeat(70), 'bold');
  log('📊 PRICING SUMMARY', 'bold');
  log('='.repeat(70) + '\n', 'bold');

  // Group by plan
  const plans = {
    Basic: {
      monthly: results["Basic (Monthly)"],
      yearly: results["Basic (Yearly)"],
    },
    Pro: {
      monthly: results["Pro (Monthly)"],
      yearly: results["Pro (Yearly)"],
    },
    Ultra: {
      monthly: results["Ultra (Monthly)"],
      yearly: results["Ultra (Yearly)"],
    },
  };

  for (const [planName, pricing] of Object.entries(plans)) {
    log(`\n${planName} Plan:`, 'cyan');
    
    if (pricing.monthly) {
      const monthlyPrice = formatPrice(pricing.monthly.priceAmount, pricing.monthly.currency);
      log(`  Monthly: ${monthlyPrice}/month`, 'green');
    } else {
      log(`  Monthly: Not configured`, 'yellow');
    }

    if (pricing.yearly) {
      const yearlyTotal = formatPrice(pricing.yearly.priceAmount, pricing.yearly.currency);
      const yearlyMonthly = pricing.yearly.priceAmount 
        ? formatPrice(pricing.yearly.priceAmount / 12, pricing.yearly.currency)
        : "N/A";
      log(`  Yearly:  ${yearlyTotal}/year (${yearlyMonthly}/month)`, 'green');
      
      // Calculate savings
      if (pricing.monthly && pricing.yearly) {
        const monthlyCost = pricing.monthly.priceAmount * 12;
        const yearlyCost = pricing.yearly.priceAmount;
        const savings = ((monthlyCost - yearlyCost) / monthlyCost * 100).toFixed(0);
        log(`  Savings: ${savings}% when billed yearly`, 'blue');
      }
    } else {
      log(`  Yearly:  Not configured`, 'yellow');
    }
  }

  log('\n' + '='.repeat(70), 'bold');
  log('✅ Pricing fetch complete!', 'green');
  log('='.repeat(70) + '\n', 'bold');
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
