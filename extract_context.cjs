const fs = require('fs');
const code = fs.readFileSync('/tmp/app_code.js', 'utf8');

// Find code between $h declaration and context value
const startIdx = code.indexOf('$h=({children:j})=>{');
const endIdx = code.indexOf('value:{currentUser:');

console.log('Context definition length:', endIdx - startIdx);
fs.writeFileSync('./extracted_context_logic.js', code.slice(startIdx, endIdx));
console.log('Written extracted_context_logic.js');
