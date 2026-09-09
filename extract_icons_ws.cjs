const fs = require('fs');
const bundle = fs.readFileSync('/tmp/index_bundle.js', 'utf8');

const matches = [...bundle.matchAll(/([a-zA-Z0-9_$]+)=ge\("([^"]+)"/g)];
const iconMap = {};
for (const m of matches) {
  iconMap[m[1]] = m[2];
}
fs.writeFileSync('./icon_map.json', JSON.stringify(iconMap, null, 2));
console.log('Saved icon_map.json in workspace');
