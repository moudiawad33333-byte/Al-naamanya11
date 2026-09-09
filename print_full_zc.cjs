const fs = require('fs');
const code = fs.readFileSync('/tmp/app_code.js', 'utf8');

const zcIdx = code.indexOf('zc=');
const nextConst = code.indexOf('const ', zcIdx + 10);
console.log(code.slice(zcIdx, nextConst));
