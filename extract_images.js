const fs = require('fs');
const path = require('path');

const filePath = '/Users/mac/Desktop/BUSINESS/WEBSITES/QUIRIJN/lighthouse_4.html';
const assetsDir = '/Users/mac/Desktop/BUSINESS/WEBSITES/QUIRIJN/assets';

if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
}

let content = fs.readFileSync(filePath, 'utf8');
const base64Regex = /data:image\/([a-zA-Z]*);base64,([^\s'"]+)/g;

let match;
let imageCount = 0;

while ((match = base64Regex.exec(content)) !== null) {
    const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
    const data = match[2];
    const fileName = `image_${++imageCount}.${ext}`;
    const filePath = path.join(assetsDir, fileName);

    fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
    console.log(`Extracted ${fileName}`);

    // Update the content (simple replace, regex.exec will continue from the right place)
    const original = `data:image/${match[1]};base64,${data}`;
    content = content.replace(original, `./assets/${fileName}`);
}

fs.writeFileSync(filePath, content);
console.log('Finished extracting images and updating HTML.');
