const fs = require('fs');
const bundle = fs.readFileSync('/tmp/index_bundle.js', 'utf8');

const matches = [...bundle.matchAll(/([a-zA-Z0-9_$]+)=u\("([^"]+)",/g)];
console.log('Matches with u("name"):', matches.length);
if (matches.length > 0) {
  matches.slice(0, 30).forEach(m => console.log(m[1] + ' = ' + m[2]));
} else {
  // search for "lucide"
  const lucideIdx = bundle.indexOf('lucide');
  console.log('lucide keyword at:', lucideIdx);
  if (lucideIdx !== -1) {
    console.log(bundle.slice(lucideIdx - 50, lucideIdx + 200));
  }
}
