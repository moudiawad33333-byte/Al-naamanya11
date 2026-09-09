const fs = require('fs');
const code = fs.readFileSync('/tmp/app_code.js', 'utf8');

// Find all occurrences of JSX/createElement where an icon or button or title is used
// Specifically let us find the names of subcomponents in the bundle
const matchComponents = code.match(/const ([A-Z][a-zA-Z0-9_]*)\s*=\s*\(/g) || [];
console.log('Capitalized components found:', matchComponents);

// Let us find how App is structured
const appIndex = code.lastIndexOf('function App(') > -1 ? code.lastIndexOf('function App(') : code.lastIndexOf('App=()=>');
console.log('App function index:', appIndex);
if (appIndex > -1) {
  console.log(code.slice(appIndex, appIndex + 500));
}
