const fs = require('fs');
const code = fs.readFileSync('/tmp/app_code.js', 'utf8');

// Find where activeTab or tab switching happens
const tabSwitchMatches = code.match(/case "([a-z_]+)":/g) || code.match(/=== ?"([a-z_]+)"/g) || [];
console.log('Tab switch targets:', [...new Set(tabSwitchMatches)]);

// Let us find the component rendering the tabs
const tabsCondition = code.match(/(dashboard|students|teachers|specialists|admin_staff|expenses|treasury|reports|audit)/g);
console.log('Tab occurrences:', tabsCondition ? tabsCondition.length : 0);
