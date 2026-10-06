import fs from 'fs';

const rootFiles = ['README.md', 'next.config.js', 'vercel.json'];

for (const file of rootFiles) {
    if (fs.existsSync(file)) {
        try {
            let content = fs.readFileSync(file, 'utf8');
            if (/humanify/i.test(content)) {
                content = content.replace(/HumanifyLab's/g, "DebotifyText's");
                content = content.replace(/HumanifyLab/g, "DebotifyText");
                content = content.replace(/Humanify Lab/g, "Debotify Text");
                content = content.replace(/Humanify lab/g, "Debotify Text");
                content = content.replace(/humanifylab/g, "debotifytext");
                content = content.replace(/HUMANIFYLAB/g, "DEBOTIFYTEXT");
                content = content.replace(/Humanify/g, "Debotify");
                content = content.replace(/humanify/g, "debotify");
                
                fs.writeFileSync(file, content, 'utf8');
                console.log(`Updated ${file}`);
            }
        } catch (err) {}
    }
}
