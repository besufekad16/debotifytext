#!/usr/bin/env node

/**
 * Verification Script for Sitemap Redirect Fixes
 * 
 * This script verifies that:
 * 1. Sitemap doesn't contain auth/redirect pages
 * 2. Robots.txt has proper disallow rules
 * 3. All sitemap URLs are valid
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  if (!fs.existsSync(fullPath)) {
    log(`❌ File not found: ${filePath}`, 'red');
    return null;
  }
  return fs.readFileSync(fullPath, 'utf-8');
}

// Pages that should NOT be in sitemap (they redirect or require auth)
const FORBIDDEN_PAGES = [
  '/sign-in',
  '/sign-up',
  '/account',
  '/dashboard',
  '/team',
  '/api-keys',
  '/admin',
];

// Pages that SHOULD be in main sitemap
const REQUIRED_PAGES = [
  '/',
  '/pricing',
  '/faq',
  '/contact',
  '/terms',
  '/privacy',
  '/responsible-use',
];

// Required disallow rules in robots.txt
const REQUIRED_DISALLOWS = [
  '/api/',
  '/_next/',
  '/admin/',
  '/account/',
  '/team/',
  '/api-keys/',
  '/sign-in',
  '/sign-up',
  '/dashboard',
];

function verifySitemap() {
  log('\n📄 Checking public/sitemap.xml...', 'blue');
  
  const sitemap = checkFile('public/sitemap.xml');
  if (!sitemap) return false;

  let hasErrors = false;

  // Check for forbidden pages
  log('\n🔍 Checking for forbidden pages (should NOT be in sitemap):', 'yellow');
  FORBIDDEN_PAGES.forEach(page => {
    if (sitemap.includes(`<loc>https://www.humanifylab.com${page}</loc>`)) {
      log(`  ❌ FOUND: ${page} (should be removed!)`, 'red');
      hasErrors = true;
    } else {
      log(`  ✅ NOT FOUND: ${page}`, 'green');
    }
  });

  // Check for required pages
  log('\n🔍 Checking for required pages (should be in sitemap):', 'yellow');
  REQUIRED_PAGES.forEach(page => {
    const url = page === '/' 
      ? '<loc>https://www.humanifylab.com</loc>'
      : `<loc>https://www.humanifylab.com${page}</loc>`;
    
    if (sitemap.includes(url)) {
      log(`  ✅ FOUND: ${page}`, 'green');
    } else {
      log(`  ❌ MISSING: ${page}`, 'red');
      hasErrors = true;
    }
  });

  // Check XML validity
  log('\n🔍 Checking XML validity:', 'yellow');
  if (sitemap.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
    log('  ✅ Valid XML declaration', 'green');
  } else {
    log('  ❌ Invalid XML declaration', 'red');
    hasErrors = true;
  }

  if (sitemap.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) {
    log('  ✅ Valid urlset namespace', 'green');
  } else {
    log('  ❌ Invalid urlset namespace', 'red');
    hasErrors = true;
  }

  // Count URLs
  const urlCount = (sitemap.match(/<loc>/g) || []).length;
  log(`\n📊 Total URLs in sitemap: ${urlCount}`, 'blue');
  if (urlCount === REQUIRED_PAGES.length) {
    log(`  ✅ Correct count (expected ${REQUIRED_PAGES.length})`, 'green');
  } else {
    log(`  ⚠️  Expected ${REQUIRED_PAGES.length} URLs, found ${urlCount}`, 'yellow');
  }

  return !hasErrors;
}

function verifyRobotsTxt() {
  log('\n🤖 Checking public/robots.txt...', 'blue');
  
  const robotsTxt = checkFile('public/robots.txt');
  if (!robotsTxt) return false;

  let hasErrors = false;

  log('\n🔍 Checking for required Disallow rules:', 'yellow');
  REQUIRED_DISALLOWS.forEach(rule => {
    if (robotsTxt.includes(`Disallow: ${rule}`)) {
      log(`  ✅ FOUND: Disallow: ${rule}`, 'green');
    } else {
      log(`  ❌ MISSING: Disallow: ${rule}`, 'red');
      hasErrors = true;
    }
  });

  // Check for sitemap references
  log('\n🔍 Checking for sitemap references:', 'yellow');
  const sitemapRefs = [
    'Sitemap: https://www.humanifylab.com/sitemap.xml',
    'Sitemap: https://www.humanifylab.com/sitemaps/sitemap-index.xml',
  ];

  sitemapRefs.forEach(ref => {
    if (robotsTxt.includes(ref)) {
      log(`  ✅ FOUND: ${ref}`, 'green');
    } else {
      log(`  ⚠️  MISSING: ${ref}`, 'yellow');
    }
  });

  return !hasErrors;
}

function verifyKeywordSitemaps() {
  log('\n📚 Checking keyword sitemaps...', 'blue');
  
  let hasErrors = false;

  for (let i = 1; i <= 8; i++) {
    const sitemap = checkFile(`public/sitemaps/sitemap-${i}.xml`);
    if (!sitemap) {
      log(`  ❌ Missing: sitemap-${i}.xml`, 'red');
      hasErrors = true;
      continue;
    }

    // Check for forbidden pages in keyword sitemaps
    let foundForbidden = false;
    FORBIDDEN_PAGES.forEach(page => {
      if (sitemap.includes(`<loc>https://www.humanifylab.com${page}</loc>`)) {
        log(`  ❌ sitemap-${i}.xml contains forbidden page: ${page}`, 'red');
        foundForbidden = true;
        hasErrors = true;
      }
    });

    if (!foundForbidden) {
      const urlCount = (sitemap.match(/<loc>/g) || []).length;
      log(`  ✅ sitemap-${i}.xml is clean (${urlCount} URLs)`, 'green');
    }
  }

  return !hasErrors;
}

function verifySitemapIndex() {
  log('\n📑 Checking sitemap index...', 'blue');
  
  const sitemapIndex = checkFile('public/sitemaps/sitemap-index.xml');
  if (!sitemapIndex) return false;

  let hasErrors = false;

  // Check for main sitemap reference
  if (sitemapIndex.includes('<loc>https://www.humanifylab.com/sitemap.xml</loc>')) {
    log('  ✅ References main sitemap.xml', 'green');
  } else {
    log('  ❌ Missing reference to main sitemap.xml', 'red');
    hasErrors = true;
  }

  // Check for keyword sitemap references
  for (let i = 1; i <= 8; i++) {
    if (sitemapIndex.includes(`<loc>https://www.humanifylab.com/sitemaps/sitemap-${i}.xml</loc>`)) {
      log(`  ✅ References sitemap-${i}.xml`, 'green');
    } else {
      log(`  ❌ Missing reference to sitemap-${i}.xml`, 'red');
      hasErrors = true;
    }
  }

  return !hasErrors;
}

// Main execution
function main() {
  log('\n' + '='.repeat(60), 'bold');
  log('🔍 SITEMAP REDIRECT FIX VERIFICATION', 'bold');
  log('='.repeat(60) + '\n', 'bold');

  const results = {
    sitemap: verifySitemap(),
    robotsTxt: verifyRobotsTxt(),
    keywordSitemaps: verifyKeywordSitemaps(),
    sitemapIndex: verifySitemapIndex(),
  };

  // Summary
  log('\n' + '='.repeat(60), 'bold');
  log('📊 VERIFICATION SUMMARY', 'bold');
  log('='.repeat(60), 'bold');

  Object.entries(results).forEach(([check, passed]) => {
    const status = passed ? '✅ PASSED' : '❌ FAILED';
    const color = passed ? 'green' : 'red';
    log(`${status}: ${check}`, color);
  });

  const allPassed = Object.values(results).every(r => r);

  log('\n' + '='.repeat(60), 'bold');
  if (allPassed) {
    log('✅ ALL CHECKS PASSED! Ready for deployment.', 'green');
    log('\nNext steps:', 'blue');
    log('1. Deploy to production (git push or vercel --prod)');
    log('2. Submit sitemap to Google Search Console');
    log('3. Monitor "Page with redirect" errors over 1-2 weeks');
  } else {
    log('❌ SOME CHECKS FAILED! Please fix the issues above.', 'red');
    log('\nReview DEPLOYMENT_CHECKLIST.md for guidance.', 'yellow');
  }
  log('='.repeat(60) + '\n', 'bold');

  process.exit(allPassed ? 0 : 1);
}

main();
