const fs = require('fs');
const code = fs.readFileSync('./extracted_context_logic.js', 'utf8');

// Print methods like Rc=..., rn=..., kc=..., Hc=..., etc.
const methodNames = ['Rc', 'rn', 'kc', 'Hc', 'Kl', 'dt', 'Jt', 'ft', 'qc', 'Sl', 'Lc', 'Yc', 'Oc', 'dn', 'ma', 'ba', 'pa', 'tl', 'ga', 'Jl', 'Gc', 'on'];
for (const m of methodNames) {
  const idx = code.indexOf(`${m}=`);
  if (idx !== -1) {
    console.log(`=== Method ${m} ===`);
    console.log(code.slice(idx, idx + 350));
  }
}
