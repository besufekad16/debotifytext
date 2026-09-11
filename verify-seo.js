#!/usr/bin/env node

/**
 * SEO Verification Script
 * 
 * This script verifies that all SEO pages are properly configured and accessible.
 * Run with: node verify-seo.js
 */

const https = require('https');

const BASE_URL = 'https://www.humanifylab.com';

// Test URLs from different clusters
const TEST_URLS = [
  '/',
  '/pricing',
  '/faq',
  '/contact',
  '/guides/chatgpt-humanizer',
  '/guides/free-ai-humanizer',
  '/guides/ai-humanizer-for-students',
  '/guides/bypass-gptzero',
  '/topics',
  '/topics/humanizer',
];

console.log('🔍 SEO Verification Script\n');
console.log('Testing HumanifyLab SEO configuration...\n');

let passed = 0;
let failed = 0;

function checkUrl(url) {
  return new Promise((resolve) => {
    const fullUrl = `${BASE_URL}${url}`;
    
    https.get(fullUrl, (res) => {
      const { statusCode } = res;
      
      if (statusCode === 200) {
        console.log(`✅ ${url} - OK (${statusCode})`);
        passed++;
      } else {
        console.log(`❌ ${url} - FAILED (${statusCode})`);
        failed++;
      }
      
      resolve();
    }).on('error', (err) => {
      console.log(`❌ ${url} - ERROR: ${err.message}`);
      failed++;
      resolve();
    });
  });
}

async function checkRobotsTxt() {
  return new Promise((resolve) => {
    https.get(`${BASE_URL}/robots.txt`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('\n📄 Robots.txt Check:');
        
        // Check for problematic blocks
        if (data.includes('Disallow: /sign-in') || data.includes('Disallow: /sign-up')) {
          console.log('❌ Still blocking /sign-in or /sign-up');
          failed++;
        } else {
          console.log('✅ Not blocking sign-in/sign-up pages');
          passed++;
        }
        
        if (data.includes('Disallow: /_next/') && !data.includes('Disallow: /_next/static/')) {
          console.log('❌ Blocking entire /_next/ directory');
          failed++;
        } else {
          console.log('✅ Only blocking /_next/static/');
          passed++;
        }
        
        if (data.includes('sitemap.xml')) {
          console.log('✅ Sitemap reference found');
          passed++;
        } else {
          console.log('❌ No sitemap reference');
          failed++;
        }
        
        resolve();
      });
    }).on('error', (err) => {
      console.log(`❌ Error checking robots.txt: ${err.message}`);
      failed++;
      resolve();
    });
  });
}

async function checkSitemap() {
  return new Promise((resolve) => {
    https.get(`${BASE_URL}/sitemap.xml`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        console.log('\n🗺️  Sitemap Check:');
        
        const urlCount = (data.match(/<url>/g) || []).length;
        console.log(`   Found ${urlCount} URLs in sitemap`);
        
        if (urlCount > 100) {
          console.log('✅ Sitemap has substantial URLs');
          passed++;
        } else {
          console.log('❌ Sitemap has too few URLs');
          failed++;
        }
        
        if (data.includes('<changefreq>weekly</changefreq>')) {
          console.log('✅ Using realistic change frequency');
          passed++;
        } else if (data.includes('<changefreq>daily</changefreq>')) {
          console.log('⚠️  Using daily change frequency (consider weekly)');
        }
        
        resolve();
      });
    }).on('error', (err) => {
      console.log(`❌ Error checking sitemap: ${err.message}`);
      failed++;
      resolve();
    });
  });
}

async function runTests() {
  console.log('🌐 Testing Page Accessibility:\n');
  
  for (const url of TEST_URLS) {
    await checkUrl(url);
  }
  
  await checkRobotsTxt();
  await checkSitemap();
  
  console.log('\n' + '='.repeat(50));
  console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
  
  if (failed === 0) {
    console.log('🎉 All checks passed! SEO configuration is correct.\n');
    process.exit(0);
  } else {
    console.log('⚠️  Some checks failed. Please review the errors above.\n');
    process.exit(1);
  }
}

runTests();
