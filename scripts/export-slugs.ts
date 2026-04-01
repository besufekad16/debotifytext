/**
 * Exports all pSEO slugs grouped by cluster to public/data/pseo-slugs.json
 * Run: npx tsx scripts/export-slugs.ts
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { getClusterKeywords } from '../src/lib/pseo-data';

const out = {
  bypass:   getClusterKeywords('bypass').map(e => e.slug),
  humanizer: getClusterKeywords('humanizer').map(e => e.slug),
  howto:    getClusterKeywords('howto').map(e => e.slug),
  usecase:  getClusterKeywords('usecase').map(e => e.slug),
};

const total = Object.values(out).reduce((s, a) => s + a.length, 0);

mkdirSync(join(process.cwd(), 'public/data'), { recursive: true });
writeFileSync(join(process.cwd(), 'public/data/pseo-slugs.json'), JSON.stringify(out, null, 2), 'utf-8');

console.log(`✅ Exported ${total} slugs to public/data/pseo-slugs.json`);
console.log(`   bypass:    ${out.bypass.length}`);
console.log(`   humanizer: ${out.humanizer.length}`);
console.log(`   howto:     ${out.howto.length}`);
console.log(`   usecase:   ${out.usecase.length}`);
