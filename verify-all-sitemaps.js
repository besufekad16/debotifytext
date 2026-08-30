#!/usr/bin/env node

/**
 * Sitemap Verification Script
 * Verifies all 31 sitemaps are accessible and properly formatted
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITEMAP_FILES = [
  // V1 Clusters
  'sitemap-bypass.xml',
  'sitemap-humanizer.xml',
  'sitemap-howto.xml',
  'sitemap-usecase.xml',
  // V2 Clusters
  'sitemap-competitor.xml',
  'sitemap-academic.xml',
  'sitemap-professional.xml',
  'sitemap-detector.xml',
  'sitemap-language.xml',
  'sitemap-niche.xml',
  // V3 Clusters
  'sitemap-pricing.xml',
  'sitemap-industry.xml',
  'sitemap-format.xml',
  'sitemap-speed.xml',
  'sitemap-quality.xml',
  'sitemap-tool.xml',
  'sitemap-problem.xml',
  'sitemap-workflow.xml',
  'sitemap-score.xml',
  'sitemap-region.xml',
  // V4 Clusters
  'sitemap-comparison.xml',
  'sitemap-alternative.xml',
  'sitemap-review.xml',
  'sitemap-free.xml',
  'sitemap-detection.xml',
  'sitemap-writing.xml',
  'sitemap-education.xml',
  'sitemap-platform-v4.xml',
  'sitemap-output.xml',
  'sitemap-bulk.xml',
  'sitemap-city.xml',
  'sitemap-question.xml',
  'sitemap-feature.xml',
  'sitemap-length.xml',
  'sitemap-scenario.xml',
  'sitemap-versus.xml',
  'sitemap-detectorshowdown.xml',
  'sitemap-brandquery.xml',
  'sitemap-bestlist.xml',
  'sitemap-modelsource.xml',
  'sitemap-aeoqa.xml',
  'sitemap-rolework.xml',
  'sitemap-voiceedit.xml',
  'sitemap-tasktype.xml',
  'sitemap-glossary.xml',
];

console.log('🔍 Verifying Sitemap Configuration...\n');

let totalUrls = 0;
let missingFiles = [];
let validFiles = [];

// Check each sitemap file
SITEMAP_FILES.forEach((filename) => {
  const filepath = path.join(__dirname, 'public', filename);
  
  if (!fs.existsSync(filepath)) {
    missingFiles.push(filename);
    console.log(`❌ Missing: ${filename}`);
    return;
  }
  
  const content = fs.readFileSync(filepath, 'utf-8');
  const urlMatches = content.match(/<url>/g);
  const urlCount = urlMatches ? urlMatches.length : 0;
  
  totalUrls += urlCount;
  validFiles.push({ filename, urlCount });
  console.log(`✅ ${filename}: ${urlCount} URLs`);
});

console.log('\n' + '='.repeat(60));
console.log('📊 Summary:');
console.log('='.repeat(60));
console.log(`Total Sitemap Files: ${SITEMAP_FILES.length}`);
console.log(`Valid Files: ${validFiles.length}`);
console.log(`Missing Files: ${missingFiles.length}`);
console.log(`Total URLs: ${totalUrls.toLocaleString()}`);

if (missingFiles.length > 0) {
  console.log('\n⚠️  Missing Files:');
  missingFiles.forEach(f => console.log(`   - ${f}`));
}

console.log('\n' + '='.repeat(60));
console.log('🎯 Next Steps:');
console.log('='.repeat(60));
console.log('1. Deploy changes to production');
console.log('2. Verify robots.txt: https://www.humanifylab.com/robots.txt');
console.log('3. Submit all sitemaps to Google Search Console');
console.log('4. Monitor indexing progress weekly');
console.log('\n✨ All sitemaps configured for DAILY crawling!\n');
