const fs = require('fs');

const files = fs.readdirSync('./extracted_raw');
for (const file of files) {
  const content = fs.readFileSync(`./extracted_raw/${file}`, 'utf8');
  console.log(`=== ${file} (${content.length} chars) ===`);
  console.log(content.slice(0, 300));
  console.log('...\n');
}
