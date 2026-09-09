const fs = require('fs');
const lines = fs.readFileSync('/tmp/app_code_formatted.js', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('label:') || line.includes('ad=[{') || line.includes('educational_association')) {
    console.log('Line ' + i + ': ' + line.slice(0, 140));
  }
}
