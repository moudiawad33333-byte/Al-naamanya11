const fs = require('fs');
const code = fs.readFileSync('/tmp/app_code.js', 'utf8');

const components = [
  { name: 'tb', desc: 'Header/Navbar' },
  { name: 'ab', desc: 'Branch selector banner' },
  { name: 'lb', desc: 'Navigation tabs' },
  { name: 'sb', desc: 'Dashboard view' },
  { name: 'nb', desc: 'Students view' },
  { name: 'cb', desc: 'Teachers view' },
  { name: 'ib', desc: 'Specialists view' },
  { name: 'ub', desc: 'Admin staff view' },
  { name: 'db', desc: 'Expenses view' },
  { name: 'rb', desc: 'Treasury view' },
  { name: 'ob', desc: 'Reports view' },
  { name: 'fb', desc: 'Audit view' },
  { name: 'xb', desc: 'Receipt print modal' },
  { name: 'hb', desc: 'Staff payment voucher modal' },
  { name: 'mb', desc: 'Add payment modal' },
  { name: 'bb', desc: 'Add student modal' },
  { name: 'pb', desc: 'Add expense modal' },
  { name: 'gb', desc: 'Pay staff modal' },
  { name: 'vb', desc: 'Treasury transfer modal' },
  { name: 'jb', desc: 'Add staff modal' },
  { name: '$h', desc: 'ContextProvider' }
];

for (const c of components) {
  // Find "const c.name =" or "c.name=(" or "c.name={"
  const patterns = [
    new RegExp('const ' + c.name.replace('$', '\\$') + '\\s*=\\s*\\('),
    new RegExp('const ' + c.name.replace('$', '\\$') + '\\s*=\\s*\\{'),
    new RegExp(c.name.replace('$', '\\$') + '\\s*=\\s*\\(')
  ];
  let foundIdx = -1;
  for (const p of patterns) {
    const m = code.search(p);
    if (m !== -1) {
      foundIdx = m;
      break;
    }
  }
  console.log(`${c.name} (${c.desc}): index = ${foundIdx}`);
}
