const fs = require('fs');
const bundle = fs.readFileSync('/tmp/index_bundle.js', 'utf8');

const matches = [...bundle.matchAll(/([a-zA-Z0-9_$]+)=ge\("([^"]+)"/g)];
console.log('Total icons mapped:', matches.length);
const iconMap = {};
for (const m of matches) {
  iconMap[m[1]] = m[2];
}
fs.writeFileSync('/tmp/icon_map.json', JSON.stringify(iconMap, null, 2));
console.log('Icon map written to /tmp/icon_map.json');
