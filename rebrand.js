// @ts-nocheck
import fs from 'fs';
import path from 'path';

const excludePaths = [
    'src/server',
    'src/app/api',
    'src/middleware.ts',
    'src/env.js',
    'src/lib/clerk-server.ts',
    'src/lib/polar-products.ts',
    'node_modules',
    'prisma',
    '.git',
    '.vscode',
    'SEO_and_PSEO_fix',
    '.kiro',
    '.next'
];

function isExcluded(filePath) {
    const normalized = filePath.replace(/\\/g, '/');
    return excludePaths.some(ex => normalized.includes(ex)) ||
           normalized.includes('.xml') ||
           normalized.includes('.csv') ||
           normalized.includes('.png') ||
           normalized.includes('.jpg') ||
           normalized.includes('.webp') ||
           normalized.includes('.ico') ||
           normalized.includes('human_texts_sample.json') ||
           normalized.includes('package-lock.json');
}

function processDirectory(directory) {
    let count = 0;
    const entries = fs.readdirSync(directory, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = path.join(directory, entry.name);
        
        if (isExcluded(fullPath)) continue;
        
        if (entry.isDirectory()) {
            count += processDirectory(fullPath);
        } else if (entry.isFile()) {
            try {
                let content = fs.readFileSync(fullPath, 'utf8');
                if (/humanify/i.test(content)) {
                    content = content.replace(/HumanifyLab's/g, "DebotifyText's");
                    content = content.replace(/HumanifyLab/g, "DebotifyText");
                    content = content.replace(/Humanify Lab/g, "Debotify Text");
                    content = content.replace(/Humanify lab/g, "Debotify Text");
                    content = content.replace(/humanifylab/g, "debotifytext");
                    content = content.replace(/HUMANIFYLAB/g, "DEBOTIFYTEXT");
                    content = content.replace(/Humanify/g, "Debotify");
                    content = content.replace(/humanify/g, "debotify");
                    
                    fs.writeFileSync(fullPath, content, 'utf8');
                    count++;
                }
            } catch (err) {
                // Ignore read/write errors
            }
        }
    }
    return count;
}

const targets = ['src', 'public', 'scripts', 'seo'];
let totalCount = 0;

for (const target of targets) {
    if (fs.existsSync(target)) {
        totalCount += processDirectory(target);
    }
}

console.log(`Updated ${totalCount} files.`);
