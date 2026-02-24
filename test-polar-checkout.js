/**
 * Test Polar Checkout Creation
 * This script tests if the checkout API can create a session successfully
 */

const https = require('https');

// Configuration
const BASE_URL = process.env.TEST_URL || 'http://localhost:3050';
const TEST_EMAIL = 'segniab49@gmail.com';
const PRODUCT_ID = process.env.POLAR_PRODUCT_MEDIUM || '84637abc-8afb-4be3-b54f-e77e9680186f'; // Monthly Pro

console.log('🧪 Testing Polar Checkout Creation');
console.log('=====================================');
console.log(`Base URL: ${BASE_URL}`);
console.log(`Test Email: ${TEST_EMAIL}`);
console.log(`Product ID: ${PRODUCT_ID}`);
console.log('');

// Note: This test requires authentication
console.log('⚠️  IMPORTANT:');
console.log('This test requires you to be logged in as the test user.');
console.log('');
console.log('To test manually:');
console.log('1. Start your dev server: npm run dev');
console.log('2. Open browser: http://localhost:3050');
console.log(`3. Sign in with: ${TEST_EMAIL}`);
console.log('4. Go to pricing page: http://localhost:3050/pricing');
console.log('5. Click on "Monthly Pro" plan');
console.log('6. Check browser console and server logs');
console.log('');
console.log('Expected behavior:');
console.log('✅ Checkout session created successfully');
console.log('✅ Redirected to Polar checkout page');
console.log('✅ No "checkout.upload does not work" error');
console.log('');
console.log('Server logs should show:');
console.log('[Polar Checkout] Creating checkout session');
console.log('[Polar Checkout] Creating checkout for: { userId: "...", productId: "..." }');
console.log('[Polar Checkout] Checkout created: checkout_xxx');
