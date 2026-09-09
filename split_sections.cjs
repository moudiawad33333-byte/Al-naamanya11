const fs = require('fs');
const lines = fs.readFileSync('/tmp/app_code_formatted.js', 'utf8').split('\n');

// Find major section markers
console.log('Total lines:', lines.length);

// Let us inspect lines 0 - 200
fs.writeFileSync('/tmp/section_context.js', lines.slice(0, 770).join('\n'));
fs.writeFileSync('/tmp/section_header.js', lines.slice(770, 920).join('\n'));
fs.writeFileSync('/tmp/section_rest.js', lines.slice(920, 2000).join('\n'));
fs.writeFileSync('/tmp/section_end.js', lines.slice(2000).join('\n'));
console.log('Sections written successfully');
