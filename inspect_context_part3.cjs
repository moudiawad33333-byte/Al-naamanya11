const fs = require('fs');
const code = fs.readFileSync('./extracted_context_logic.js', 'utf8');

console.log(code.slice(6500));
