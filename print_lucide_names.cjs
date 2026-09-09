const fs = require('fs');
const bundle = fs.readFileSync('/tmp/index_bundle.js', 'utf8');

const lucideIdx = bundle.indexOf('lucide-react v0.546.0');
const snippet = bundle.slice(lucideIdx + 1200, lucideIdx + 6000);
console.log(snippet);
