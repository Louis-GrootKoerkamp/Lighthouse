const fs = require('fs');
const path = require('path');

const htmlPath = 'lighthouse_4.html';
const assetsDir = 'assets';

if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
}

let html = fs.readFileSync(htmlPath, 'utf8');
const base64Regex = /data:image\/[^;]+;base64,[^"') ]+/g;

let match;
let count = 3; // Starting from 3 since we extracted 1 and 2 (or 3 and 4 based on previous logs)
// Actually let's just find ALL and replace them if they are still there.

const matches = html.match(base64Regex);
if (!matches) {
    console.log('No base64 images found.');
    process.exit(0);
}

console.log(`Found ${matches.length} base64 images.`);

matches.forEach((base64, index) => {
    const extMatch = base64.match(/data:image\/([^;]+);base64,/);
    let ext = extMatch ? extMatch[1] : 'webp';
    if (ext === 'jpeg') ext = 'jpg';
    
    const fileName = `extracted_image_${index + 1}.${ext}`;
    const filePath = path.join(assetsDir, fileName);
    
    const data = base64.split(',')[1];
    fs.writeFileSync(filePath, data, 'base64');
    
    html = html.split(base64).join(`./assets/${fileName}`);
    console.log(`Extracted ${fileName}`);
});

fs.writeFileSync(htmlPath, html);
console.log('Finished updating html.');
