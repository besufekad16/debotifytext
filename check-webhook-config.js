#!/usr/bin/env node

/**
 * Webhook Configuration Checker
 * 
 * This script verifies your Polar webhook configuration
 * Run with: node check-webhook-config.js
 */

require('dotenv').config();

const REQUIRED_ENV_VARS = [
  'POLAR_ACCESS_TOKEN',
  'POLAR_WEBHOOK_SECRET',
  'POLAR_ENV',
];

const PRODUCT_ENV_VARS = [
  'POLAR_PRODUCT_SMALL',
  'POLAR_PRODUCT_MEDIUM',
  'POLAR_PRODUCT_LARGE',
  'POLAR_PRODUCT_YEARLY_SMALL',
  'POLAR_PRODUCT_YEARLY_MEDIUM',
  'POLAR_PRODUCT_YEARLY_LARGE',
  'POLAR_CREDITS_5000',
  'POLAR_CREDITS_20000',
  'POLAR_CREDITS_45000',
];

console.log('🔍 Checking Polar Webhook Configuration...\n');

// Check required environment variables
console.log('📋 Required Environment Variables:');
let hasAllRequired = true;
for (const varName of REQUIRED_ENV_VARS) {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✅ ${varName}: ${value.substring(0, 20)}...`);
  } else {
    console.log(`  ❌ ${varName}: MISSING`);
    hasAllRequired = false;
  }
}

if (!hasAllRequired) {
  console.log('\n❌ Missing required environment variables!');
  process.exit(1);
}

// Check product IDs
console.log('\n📦 Product IDs:');
let productCount = 0;
const products = {};

for (const varName of PRODUCT_ENV_VARS) {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✅ ${varName}: ${value}`);
    products[varName] = value;
    productCount++;
  } else {
    console.log(`  ⚠️  ${varName}: Not configured`);
  }
}

if (productCount === 0) {
  console.log('\n❌ No products configured! Add at least one product ID.');
  process.exit(1);
}

console.log(`\n✅ ${productCount} products configured`);

// Check for duplicates
console.log('\n🔄 Checking for duplicate product IDs...');
const productIds = Object.values(products);
const uniqueIds = new Set(productIds);

if (productIds.length !== uniqueIds.size) {
  console.log('  ❌ Duplicate product IDs found!');
  const duplicates = productIds.filter((id, index) => productIds.indexOf(id) !== index);
  console.log('  Duplicates:', [...new Set(duplicates)]);
} else {
  console.log('  ✅ No duplicates found');
}

// Validate product ID format
console.log('\n🔍 Validating product ID format...');
const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
let allValidFormat = true;

for (const [varName, id] of Object.entries(products)) {
  if (!uuidRegex.test(id)) {
    console.log(`  ❌ ${varName}: Invalid UUID format`);
    allValidFormat = false;
  }
}

if (allValidFormat) {
  console.log('  ✅ All product IDs have valid UUID format');
}

// Check Polar environment
console.log('\n🌍 Polar Environment:');
const polarEnv = process.env.POLAR_ENV;
if (polarEnv === 'production') {
  console.log('  ✅ Production mode');
} else if (polarEnv === 'sandbox') {
  console.log('  ⚠️  Sandbox mode (test mode)');
} else {
  console.log(`  ❌ Invalid environment: ${polarEnv}`);
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📊 Configuration Summary:');
console.log('='.repeat(50));
console.log(`Environment: ${polarEnv}`);
console.log(`Products configured: ${productCount}/9`);
console.log(`Webhook secret: ${process.env.POLAR_WEBHOOK_SECRET ? 'Set' : 'Missing'}`);
console.log(`Access token: ${process.env.POLAR_ACCESS_TOKEN ? 'Set' : 'Missing'}`);

// Product mapping
console.log('\n📋 Product Mapping:');
console.log('Monthly Plans:');
if (products.POLAR_PRODUCT_SMALL) {
  console.log(`  Basic:  ${products.POLAR_PRODUCT_SMALL} → 5,000 words`);
}
if (products.POLAR_PRODUCT_MEDIUM) {
  console.log(`  Pro:    ${products.POLAR_PRODUCT_MEDIUM} → 20,000 words`);
}
if (products.POLAR_PRODUCT_LARGE) {
  console.log(`  Ultra:  ${products.POLAR_PRODUCT_LARGE} → 45,000 words`);
}

console.log('\nYearly Plans:');
if (products.POLAR_PRODUCT_YEARLY_SMALL) {
  console.log(`  Basic:  ${products.POLAR_PRODUCT_YEARLY_SMALL} → 5,000 words`);
}
if (products.POLAR_PRODUCT_YEARLY_MEDIUM) {
  console.log(`  Pro:    ${products.POLAR_PRODUCT_YEARLY_MEDIUM} → 20,000 words`);
}
if (products.POLAR_PRODUCT_YEARLY_LARGE) {
  console.log(`  Ultra:  ${products.POLAR_PRODUCT_YEARLY_LARGE} → 45,000 words`);
}

console.log('\nTop-ups:');
if (products.POLAR_CREDITS_5000) {
  console.log(`  5K:     ${products.POLAR_CREDITS_5000} → 5,000 words`);
}
if (products.POLAR_CREDITS_20000) {
  console.log(`  20K:    ${products.POLAR_CREDITS_20000} → 20,000 words`);
}
if (products.POLAR_CREDITS_45000) {
  console.log(`  45K:    ${products.POLAR_CREDITS_45000} → 45,000 words`);
}

// Next steps
console.log('\n' + '='.repeat(50));
console.log('📝 Next Steps:');
console.log('='.repeat(50));
console.log('1. Verify webhook endpoint in Polar Dashboard:');
console.log('   URL: https://yourdomain.com/api/webhooks/polar');
console.log('   Secret: (should match POLAR_WEBHOOK_SECRET)');
console.log('');
console.log('2. Test webhook with a purchase or use Polar test events');
console.log('');
console.log('3. Monitor server logs for:');
console.log('   [Polar Webhook] ========== WEBHOOK RECEIVED ==========');
console.log('');
console.log('4. If issues persist, check WEBHOOK_TROUBLESHOOTING.md');

console.log('\n✅ Configuration check complete!\n');
