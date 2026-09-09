const fs = require('fs');
const code = fs.readFileSync('/tmp/app_code.js', 'utf8');
console.log('Last 2000 chars of app_code.js:');
console.log(code.slice(code.length - 2000));
