#!/usr/bin/env node

/**
 * Content Cleanup Script
 * 
 * Removes all mentions of AI detection tools and "bypass" language
 * Replaces with professional, ethical messaging
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Replacement mappings
const replacements = [
  // Specific tool names
  { from: /Turnitin/gi, to: 'quality standards' },
  { from: /GPTZero/gi, to: 'professional standards' },
  { from: /Originality\.ai/gi, to: 'authenticity standards' },
  { from: /ZeroGPT/gi, to: 'quality benchmarks' },
  
  // Bypass language
  { from: /bypass\s+(AI\s+)?detect(ion|ors?)/gi, to: 'meet professional standards' },
  { from: /bypass\s+all\s+detect(ors?)/gi, to: 'achieve professional quality' },
  { from: /pass(es)?\s+all\s+detect(ors?)/gi, to: 'meets professional standards' },
  { from: /evade\s+detect(ion|ors?)/gi, to: 'enhance quality' },
  { from: /evading\s+AI\s+detect(ion|ors?)/gi, to: 'improving writing quality' },
  
  // Undetectable claims
  { from: /99\.9%\s+undetectable/gi, to: 'professional-grade quality' },
  { from: /100%\s+undetectable/gi, to: 'authentic and natural' },
  { from: /undetectable\s+(AI\s+)?writing/gi, to: 'natural, authentic writing' },
  { from: /make\s+AI\s+undetectable/gi, to: 'enhance AI text naturally' },
  
  // Detection bypass phrases
  { from: /AI\s+detection\s+bypass/gi, to: 'writing quality enhancement' },
  { from: /detection\s+bypass/gi, to: 'quality improvement' },
  { from: /beats?\s+(all\s+)?detect(ors?)/gi, to: 'meets professional standards' },
  
  // Specific problematic phrases
  { from: /The\s+Only\s+Humanizer\s+That\s+Passes\s+All\s+Detectors/gi, to: 'Professional Writing Enhancement Technology' },
  { from: /transforms?\s+AI\s+text\s+into\s+natural,\s+undetectable\s+writing/gi, to: 'transforms AI text into natural, professional writing' },
  { from: /beats\s+GPTZero,\s+Turnitin,\s+and\s+more/gi, to: 'meets the highest professional standards' },
  { from: /We\s+bypass\s+Turnitin,\s+GPTZero,\s+Originality\.ai,\s+and\s+all\s+major\s+detectors/gi, to: 'We ensure your writing meets professional quality standards' },
  { from: /pass\s+every\s+major\s+AI\s+detector/gi, to: 'meet professional writing standards' },
  { from: /bypasses\s+all\s+detection\s+systems/gi, to: 'meets professional quality standards' },
  
  // Footer and general claims
  { from: /Enterprise-grade\s+AI\s+humanization\s+technology\.\s+Transform\s+AI-generated\s+content\s+into\s+authentic,\s+professional\s+writing\s+that\s+bypasses\s+all\s+detection\s+systems\./gi, to: 'Enterprise-grade AI humanization technology. Transform AI-generated content into authentic, professional writing that meets the highest quality standards.' },
  
  // Pricing modal
  { from: /All\s+plans\s+include\s+99\.9%\s+AI\s+detection\s+bypass\s+and\s+unlimited\s+humanizations/gi, to: 'All plans include professional-grade quality and unlimited humanizations' },
  
  // SEO content
  { from: /Experience\s+the\s+most\s+advanced\s+AI\s+humanization\s+technology\.\s+Bypass\s+all\s+detectors\s+with\s+99\.9%\s+success\s+rate\./gi, to: 'Experience the most advanced AI humanization technology. Achieve professional-grade writing quality.' },
  { from: /Transform\s+your\s+AI\s+content\s+into\s+undetectable,\s+human-like\s+text/gi, to: 'Transform your AI content into natural, human-like text' },
  
  // How to use section
  { from: /Bypass\s+Detection/gi, to: 'Achieve Quality' },
  { from: /Download\s+your\s+100%\s+humanified\s+text\.\s+It's\s+now\s+ready\s+to\s+pass\s+every\s+major\s+AI\s+detector\s+with\s+flying\s+colors,\s+guaranteed\./gi, to: 'Download your professionally humanized text. It now reads naturally with authentic human tone and style.' },
];

// Files to process
const filesToProcess = [
  'src/components/ComparisonSection.tsx',
  'src/components/FactsSection.tsx',
  'src/components/HowToUseSection.tsx',
  'src/components/SEOPageLayout.tsx',
  'src/components/SiteFooter.tsx',
  'src/components/PricingModal.tsx',
  'src/app/[keyword]/page.tsx',
  'src/app/page.tsx',
  'src/lib/pseo-content.ts',
];

function processFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  Skipping ${filePath} (not found)`);
    return { processed: false, changes: 0 };
  }

  let content = fs.readFileSync(fullPath, 'utf-8');
  const originalContent = content;
  let changeCount = 0;

  // Apply all replacements
  replacements.forEach(({ from, to }) => {
    const matches = content.match(from);
    if (matches) {
      changeCount += matches.length;
      content = content.replace(from, to);
    }
  });

  if (content !== originalContent) {
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`✅ Updated ${filePath} (${changeCount} changes)`);
    return { processed: true, changes: changeCount };
  } else {
    console.log(`✓  ${filePath} (no changes needed)`);
    return { processed: true, changes: 0 };
  }
}

function main() {
  console.log('\n🧹 Content Cleanup Script\n');
  console.log('Removing AI detector references and bypass language...\n');

  let totalChanges = 0;
  let filesProcessed = 0;

  filesToProcess.forEach(file => {
    const result = processFile(file);
    if (result.processed) {
      filesProcessed++;
      totalChanges += result.changes;
    }
  });

  console.log('\n' + '='.repeat(60));
  console.log(`✅ Complete! Processed ${filesProcessed} files`);
  console.log(`📝 Made ${totalChanges} content changes`);
  console.log('='.repeat(60) + '\n');

  console.log('Next steps:');
  console.log('1. Review the changes with git diff');
  console.log('2. Test the application');
  console.log('3. Commit the changes\n');
}

main();
