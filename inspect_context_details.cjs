const fs = require('fs');
const code = fs.readFileSync('./extracted_context_logic.js', 'utf8');

// Find all state variables in context provider
console.log('--- Context Provider State & Calculations ---');
console.log(code.slice(0, 3000));
