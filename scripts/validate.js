const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, '../src/content/pseo');
const files = fs.readdirSync(dir);
let allOk = true;
for (const file of files) {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
    console.log(`✅ ${file} is OK`);
  } catch(e) {
    console.error(`❌ ${file} is INVALID JSON: ${e.message}`);
    allOk = false;
  }
}
process.exit(allOk ? 0 : 1);
