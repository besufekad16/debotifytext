/**
 * Test script to verify Polar webhook signature validation
 * 
 * This script helps debug webhook signature issues by:
 * 1. Showing how to properly encode the webhook secret
 * 2. Testing the validateEvent function with sample data
 * 
 * Usage:
 *   node test-webhook-signature.js
 */

const crypto = require('crypto');

// Your webhook secret from Polar dashboard
const WEBHOOK_SECRET = process.env.POLAR_WEBHOOK_SECRET || 'polar_whs_2kt8KqKQerVdmsi5FY5fgKtwkcbxggt3RL10816cGoW';

console.log('=== Polar Webhook Signature Test ===\n');

// Test 1: Check if secret needs base64 encoding
console.log('1. Webhook Secret Analysis:');
console.log('   Raw secret:', WEBHOOK_SECRET);
console.log('   Starts with polar_whs_:', WEBHOOK_SECRET.startsWith('polar_whs_'));
console.log('   Contains = (base64):', WEBHOOK_SECRET.includes('='));

// Base64 encode if needed
let encodedSecret = WEBHOOK_SECRET;
if (!WEBHOOK_SECRET.includes('=') && WEBHOOK_SECRET.startsWith('polar_whs_')) {
  encodedSecret = Buffer.from(WEBHOOK_SECRET).toString('base64');
  console.log('   Base64 encoded:', encodedSecret);
} else {
  console.log('   Already encoded or different format');
}

console.log('\n2. Header Requirements:');
console.log('   Polar webhooks require these headers:');
console.log('   - webhook-id: Unique identifier for the webhook event');
console.log('   - webhook-timestamp: Unix timestamp of when the event occurred');
console.log('   - webhook-signature: HMAC signature of the payload');

console.log('\n3. Common Issues:');
console.log('   ✗ Headers not normalized to lowercase');
console.log('   ✗ Webhook secret not base64 encoded');
console.log('   ✗ Body read multiple times (use req.text() once)');
console.log('   ✗ Wrong webhook secret in environment variables');
console.log('   ✗ Webhook URL not publicly accessible');

console.log('\n4. Debugging Steps:');
console.log('   1. Check Polar dashboard webhook delivery logs');
console.log('   2. Verify webhook secret matches in .env and Polar dashboard');
console.log('   3. Check application logs for detailed error messages');
console.log('   4. Test with ngrok for local development');
console.log('   5. Verify webhook URL is correct in Polar dashboard');

console.log('\n5. Expected Flow:');
console.log('   User clicks "Subscribe" → Polar creates checkout');
console.log('   → Polar sends checkout.created webhook');
console.log('   → Your app validates signature');
console.log('   → Your app acknowledges with 200 OK');
console.log('   → User completes payment');
console.log('   → Polar sends checkout.completed webhook');
console.log('   → Your app updates user credits');

console.log('\n6. Testing:');
console.log('   - Use Polar dashboard "Test" button to send test webhooks');
console.log('   - Check webhook delivery status in Polar dashboard');
console.log('   - Monitor your application logs for debug messages');

console.log('\n=== Test Complete ===\n');
