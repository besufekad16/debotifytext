const fs = require('fs');
const path = require('path');

const REGISTRY_PATH = path.join(process.cwd(), 'src/data/pseo-registry.json');
const BACKUP_PATH = path.join(process.cwd(), 'src/data/pseo-registry.backup.json');
const CONTENT_DIR = path.join(process.cwd(), 'src/content/pseo');

console.log('--- Starting PSEO Pruning to 1,000 High-Authority Keywords ---');

// 1. Read existing registry
const rawData = fs.readFileSync(REGISTRY_PATH, 'utf-8');
const registry = JSON.parse(rawData);
const allSlugs = Object.keys(registry);
console.log(`Original registry size: ${allSlugs.length} slugs`);

// Backup if not already backed up
if (!fs.existsSync(BACKUP_PATH)) {
  fs.writeFileSync(BACKUP_PATH, rawData);
  console.log(`Created backup at: ${BACKUP_PATH}`);
}

// 2. Filter valid candidates
const existingContentFiles = new Set(fs.readdirSync(CONTENT_DIR).map(f => f.replace('.json', '')));

const cleanCandidates = allSlugs.filter(slug => {
  if (slug.includes('humanifylab')) return false;
  if (!existingContentFiles.has(slug)) return false;

  const item = registry[slug];
  if (!item || item.decision !== 'GENERATE' || !item.indexing?.indexEligibility) return false;
  if (item.primaryKeyword?.toLowerCase().includes('humanifylab')) return false;
  if (item.content?.directAnswer?.toLowerCase().includes('humanifylab')) return false;

  return true;
});

console.log(`Clean, valid candidates with existing content: ${cleanCandidates.length}`);

// 3. Define target dimensions for maximum semantic diversity
const detectors = [
  'turnitin',
  'gptzero',
  'originality',
  'copyleaks',
  'zerogpt',
  'safeassign',
  'quillbot',
  'crossplag',
  'sapling',
  'scribbr',
  'canvas',
  'winston'
];

const docTypes = [
  'essay',
  'dissertation',
  'thesis',
  'paper',
  'report',
  'assignment',
  'case-study',
  'literature-review',
  'capstone',
  'coursework',
  'cover-letter',
  'personal-statement',
  'speech',
  'article',
  'creative-writing',
  'annotated-bibliography'
];

// Target allocation: ~83-84 keywords per detector across diverse docTypes
const selectedSlugs = new Set();
const perDetectorTarget = Math.floor(1000 / detectors.length); // 83

for (const detector of detectors) {
  let detectorPool = cleanCandidates.filter(s => s.includes(detector));
  
  // Sort pool by shortest slug (cleanest intent, least spammy permutation)
  detectorPool.sort((a, b) => a.length - b.length);

  let pickedForDetector = 0;

  // First pass: pick one per docType for this detector
  for (const doc of docTypes) {
    if (pickedForDetector >= perDetectorTarget) break;
    const match = detectorPool.find(s => !selectedSlugs.has(s) && s.includes(doc));
    if (match) {
      selectedSlugs.add(match);
      pickedForDetector++;
    }
  }

  // Second pass: fill remaining detector quota from diverse query styles
  for (const slug of detectorPool) {
    if (pickedForDetector >= perDetectorTarget) break;
    if (!selectedSlugs.has(slug)) {
      selectedSlugs.add(slug);
      pickedForDetector++;
    }
  }
}

// Fill any remainder up to exactly 1,000 from cleanCandidates
let idx = 0;
while (selectedSlugs.size < 1000 && idx < cleanCandidates.length) {
  const candidate = cleanCandidates[idx++];
  if (!selectedSlugs.has(candidate)) {
    selectedSlugs.add(candidate);
  }
}

console.log(`Total uniquely selected slugs: ${selectedSlugs.size}`);

// 4. Construct pruned registry object
const prunedRegistry = {};
for (const slug of selectedSlugs) {
  const item = registry[slug];
  
  // Ensure canonicalSlug and references are clean
  prunedRegistry[slug] = {
    ...item,
    slug,
    canonicalSlug: slug,
    indexing: {
      indexEligibility: true,
      canonicalSlug: slug
    }
  };
}

// 5. Write pruned registry
fs.writeFileSync(REGISTRY_PATH, JSON.stringify(prunedRegistry, null, 2));
const newSizeBytes = fs.statSync(REGISTRY_PATH).size;
console.log(`Updated ${REGISTRY_PATH} successfully!`);
console.log(`New registry size: ${(newSizeBytes / 1024 / 1024).toFixed(2)} MB (down from ~48 MB)`);
console.log(`Pruning complete! Exactly ${Object.keys(prunedRegistry).length} premium keyword pages configured.`);
