/**
 * Clerk Configuration Diagnostic Script
 * Run this to verify your Clerk environment variables are loaded correctly
 */

require('dotenv').config();

console.log('\n=== CLERK CONFIGURATION DIAGNOSTIC ===\n');

const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
const secretKey = process.env.CLERK_SECRET_KEY;

// Check if keys exist
if (!publishableKey) {
  console.log('❌ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set!');
} else {
  console.log('✅ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is set');
  console.log(`   Value: ${publishableKey}`);
  
  // Determine key type
  if (publishableKey.startsWith('pk_test_')) {
    console.log('   Type: TEST KEY (for development/localhost) ✅');
    
    // Decode the key to show the domain
    try {
      const base64Part = publishableKey.replace('pk_test_', '');
      const decoded = Buffer.from(base64Part, 'base64').toString('utf-8');
      console.log(`   Domain: ${decoded}`);
      console.log('   ℹ️  This key works on ANY domain (including localhost)');
    } catch (e) {
      console.log('   ℹ️  Could not decode domain from key');
    }
  } else if (publishableKey.startsWith('pk_live_')) {
    console.log('   Type: PRODUCTION KEY (for specific domain only) ⚠️');
    
    // Decode the key to show the domain
    try {
      const base64Part = publishableKey.replace('pk_live_', '');
      const decoded = Buffer.from(base64Part, 'base64').toString('utf-8');
      console.log(`   Domain: ${decoded}`);
      console.log('   ⚠️  This key ONLY works on the domain above!');
      console.log('   ⚠️  For localhost, use TEST keys (pk_test_)');
    } catch (e) {
      console.log('   ℹ️  Could not decode domain from key');
    }
  } else {
    console.log('   Type: UNKNOWN KEY FORMAT ❌');
  }
}

console.log('');

if (!secretKey) {
  console.log('❌ CLERK_SECRET_KEY is not set!');
} else {
  console.log('✅ CLERK_SECRET_KEY is set');
  console.log(`   Value: ${secretKey.substring(0, 20)}...`);
  
  // Determine key type
  if (secretKey.startsWith('sk_test_')) {
    console.log('   Type: TEST KEY (for development/localhost) ✅');
  } else if (secretKey.startsWith('sk_live_')) {
    console.log('   Type: PRODUCTION KEY (for specific domain only) ⚠️');
    console.log('   ⚠️  For localhost, use TEST keys (sk_test_)');
  } else {
    console.log('   Type: UNKNOWN KEY FORMAT ❌');
  }
}

console.log('\n=== RECOMMENDATIONS ===\n');

if (publishableKey?.startsWith('pk_test_') && secretKey?.startsWith('sk_test_')) {
  console.log('✅ You are using TEST keys - perfect for localhost development!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Make sure localhost:3050 is added to Clerk allowed origins');
  console.log('2. Clear browser cache');
  console.log('3. Restart dev server: npm run dev');
  console.log('4. Test sign-in buttons');
} else if (publishableKey?.startsWith('pk_live_') && secretKey?.startsWith('sk_live_')) {
  console.log('⚠️  You are using PRODUCTION keys!');
  console.log('');
  console.log('These keys only work on your production domain.');
  console.log('For localhost development, you need TEST keys.');
  console.log('');
  console.log('To fix:');
  console.log('1. Go to Clerk Dashboard: https://dashboard.clerk.com');
  console.log('2. Go to API Keys section');
  console.log('3. Copy the TEST keys (pk_test_ and sk_test_)');
  console.log('4. Update your .env file with TEST keys');
  console.log('5. Restart dev server');
} else if (publishableKey && secretKey) {
  console.log('⚠️  Key type mismatch detected!');
  console.log('');
  console.log('Your publishable key and secret key are different types.');
  console.log('They should both be TEST keys or both be PRODUCTION keys.');
  console.log('');
  console.log('To fix:');
  console.log('1. Go to Clerk Dashboard: https://dashboard.clerk.com');
  console.log('2. Copy BOTH keys from the same section (either TEST or PRODUCTION)');
  console.log('3. Update your .env file');
  console.log('4. Restart dev server');
} else {
  console.log('❌ One or both Clerk keys are missing!');
  console.log('');
  console.log('To fix:');
  console.log('1. Go to Clerk Dashboard: https://dashboard.clerk.com');
  console.log('2. Go to API Keys section');
  console.log('3. Copy the TEST keys (for localhost) or PRODUCTION keys (for humanifylab.com)');
  console.log('4. Add them to your .env file:');
  console.log('   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...');
  console.log('   CLERK_SECRET_KEY=sk_test_...');
  console.log('5. Restart dev server');
}

console.log('\n=== ENVIRONMENT ===\n');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`Current directory: ${process.cwd()}`);
console.log('');
