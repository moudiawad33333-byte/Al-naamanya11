const fs = require('fs');
const bundle = fs.readFileSync('/tmp/index_bundle.js', 'utf8');

// Find where lucide-react or createLucideIcon or icon definitions are
const lucideMatches = bundle.match(/([a-zA-Z0-9_$]+)=u\("([A-Za-z0-9]+)"/g) || 
                      bundle.match(/([a-zA-Z0-9_$]+)=c\("([A-Za-z0-9]+)"/g) ||
                      bundle.match(/const ([a-zA-Z0-9_$]+)=([a-zA-Z0-9_$]+)\("([A-Za-z0-9]+)"/g) || [];

console.log('Icon matches found:', lucideMatches.length);
if (lucideMatches.length > 0) {
  console.log('Sample icon mappings:', lucideMatches.slice(0, 20));
} else {
  // Let us search for "createLucideIcon" or similar in the first 195000 chars
  const lucideSection = bundle.slice(0, 195000);
  const iconDefs = [...lucideSection.matchAll(/([a-zA-Z0-9_$]+)=[^=]*?"([A-Z][A-Za-z0-9]+)"/g)];
  console.log('Potential icon defs:', iconDefs.slice(0, 20).map(m => m[1] + ' -> ' + m[2]));
}
