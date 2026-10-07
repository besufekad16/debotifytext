const fs = require('fs');
const path = require('path');

const DIRECTORIES = [
  path.join(__dirname, 'src/content/pseo'),
  path.join(__dirname, 'src/data'),
  path.join(__dirname, 'src/app'),
  path.join(__dirname, 'src/components'),
  path.join(__dirname, 'src/lib')
];

function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const updatedContent = content.replace(/debotifylab/gi, 'DebotifyText');
  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent, 'utf-8');
    return 1;
  }
  return 0;
}

function processDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return 0;
  
  let modifiedCount = 0;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      modifiedCount += processDirectory(fullPath);
    } else if (entry.isFile() && (fullPath.endsWith('.json') || fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.js') || fullPath.endsWith('.md'))) {
      modifiedCount += processFile(fullPath);
    }
  }
  return modifiedCount;
}

let totalModified = 0;
for (const dir of DIRECTORIES) {
  console.log(`Processing ${dir}...`);
  totalModified += processDirectory(dir);
}

// Check root files as well
const rootFiles = ['debotifytext-rebrand-plan.md'];
for (const file of rootFiles) {
  const p = path.join(__dirname, file);
  if (fs.existsSync(p)) {
    totalModified += processFile(p);
  }
}

console.log(`Done! Modified ${totalModified} files to replace DebotifyLab with DebotifyText.`);
