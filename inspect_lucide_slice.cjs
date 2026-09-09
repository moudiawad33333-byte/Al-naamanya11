const fs = require('fs');
const bundle = fs.readFileSync('/tmp/index_bundle.js', 'utf8');

const lucideIdx = bundle.indexOf('lucide-react v0.546.0');
const lucideSlice = bundle.slice(lucideIdx, lucideIdx + 25000);

// Look for icon name exports: e.g. const X = createLucideIcon("IconName", ...)
const matches = [...lucideSlice.matchAll(/([a-zA-Z0-9_$]+)=u\("([A-Za-z0-9]+)"/g)]
              .concat([...lucideSlice.matchAll(/const ([a-zA-Z0-9_$]+)=[a-zA-Z0-9_$]+\("([A-Za-z0-9]+)"/g)]);

console.log('Found icon matches:', matches.length);
matches.slice(0, 50).forEach(m => console.log(`${m[1]} = ${m[2]}`));
if (matches.length === 0) {
  console.log('Snippet of lucide section:');
  console.log(lucideSlice.slice(0, 1500));
}
