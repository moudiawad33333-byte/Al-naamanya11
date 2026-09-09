const fs = require('fs');
const code = fs.readFileSync('/tmp/app_code.js', 'utf8');

// Let us find the context object returned:
const contextValueStart = code.indexOf('value:{');
if (contextValueStart !== -1) {
  const contextValueEnd = code.indexOf('}', contextValueStart + 10);
  // Find balanced closing brace
  let depth = 0;
  let endIdx = contextValueStart;
  for (let i = contextValueStart + 6; i < code.length; i++) {
    if (code[i] === '{') depth++;
    else if (code[i] === '}') {
      if (depth === 0) {
        endIdx = i;
        break;
      }
      depth--;
    }
  }
  console.log('Context Value keys/methods:');
  console.log(code.slice(contextValueStart, endIdx + 1));
}
