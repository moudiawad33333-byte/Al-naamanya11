const fs = require('fs');
const code = fs.readFileSync('/tmp/app_code.js', 'utf8');

const zcIdx = code.indexOf('zc=');
console.log('zc definition:');
console.log(code.slice(zcIdx, zcIdx + 600));
