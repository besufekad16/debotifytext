/**
 * Verify Polar Checkout Fix
 * This script checks if the fix was properly applied
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Polar Checkout Fix');
console.log('================================\n');

const checkoutFilePath = path.join(__dirname, 'src/app/api/polar/checkout/route.ts');

try {
  const content = fs.readFileSync(checkoutFilePath, 'utf8');
  
  let allGood = true;
  
  // Check 1: Should use productId (not products)
  console.log('✓ Check 1: Using productId instead of products array');
  if (content.includes('productId: productId')) {
    console.log('  ✅ PASS - Found: productId: productId\n');
  } else if (content.includes('products: [productId]')) {
    console.log('  ❌ FAIL - Still using: products: [productId]');
    console.log('  Fix: Change to productId: productId\n');
    allGood = false;
  } else {
    console.log('  ⚠️  WARNING - Could not verify productId parameter\n');
  }
  
  // Check 2: Should use customerMetadata (not metadata)
  console.log('✓ Check 2: Using customerMetadata instead of metadata');
  if (content.includes('customerMetadata:')) {
    console.log('  ✅ PASS - Found: customerMetadata\n');
  } else if (content.includes('metadata:') && !content.includes('customerMetadata:')) {
    console.log('  ❌ FAIL - Still using: metadata');
    console.log('  Fix: Change to customerMetadata\n');
    allGood = false;
  } else {
    console.log('  ⚠️  WARNING - Could not verify metadata parameter\n');
  }
  
  // Check 3: Should NOT have "as any"
  console.log('✓ Check 3: Removed "as any" type assertion');
  if (content.includes('} as any)')) {
    console.log('  ❌ FAIL - Still has: } as any)');
    console.log('  Fix: Remove the "as any" type assertion\n');
    allGood = false;
  } else {
    console.log('  ✅ PASS - No "as any" found\n');
  }
  
  // Check 4: Verify the complete correct pattern
  console.log('✓ Check 4: Complete checkout.create pattern');
  const correctPattern = /checkouts\.create\(\{[\s\S]*?productId:[\s\S]*?customerMetadata:/;
  if (correctPattern.test(content)) {
    console.log('  ✅ PASS - Checkout creation looks correct\n');
  } else {
    console.log('  ⚠️  WARNING - Pattern might not be correct\n');
  }
  
  console.log('================================');
  if (allGood) {
    console.log('✅ ALL CHECKS PASSED!');
    console.log('\nThe fix has been properly applied.');
    console.log('You can now test the checkout flow.\n');
    console.log('Next steps:');
    console.log('1. Start dev server: npm run dev');
    console.log('2. Follow MANUAL_CHECKOUT_TEST.md');
  } else {
    console.log('❌ SOME CHECKS FAILED');
    console.log('\nThe fix was not properly applied.');
    console.log('Please review POLAR_CHECKOUT_FIX.md for the correct code.\n');
  }
  
} catch (error) {
  console.error('❌ Error reading file:', error.message);
  console.log('\nMake sure you are running this from the project root directory.');
}
