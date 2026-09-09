const fs = require('fs');
const code = fs.readFileSync('/tmp/app_code.js', 'utf8');

const slices = [
  { name: 'tb_header', start: 33543, end: 38970 },
  { name: 'lb_tabs', start: 38970, end: 40077 },
  { name: 'ab_branch_selector', start: 40077, end: 45502 },
  { name: 'sb_dashboard', start: 45502, end: 61751 },
  { name: 'nb_students', start: 61751, end: 74646 },
  { name: 'cb_teachers', start: 74646, end: 84823 },
  { name: 'ib_specialists', start: 84823, end: 95292 },
  { name: 'ub_admin_staff', start: 95292, end: 105359 },
  { name: 'db_expenses', start: 105359, end: 114956 },
  { name: 'rb_treasury', start: 114956, end: 128081 },
  { name: 'ob_reports', start: 128081, end: 147703 },
  { name: 'fb_audit', start: 147703, end: 154939 },
  { name: 'xb_receipt_modal', start: 154939, end: 163392 },
  { name: 'hb_staff_voucher_modal', start: 163392, end: 171373 },
  { name: 'mb_add_payment_modal', start: 171373, end: 175218 },
  { name: 'bb_add_student_modal', start: 175218, end: 179467 },
  { name: 'pb_add_expense_modal', start: 179467, end: 183727 },
  { name: 'gb_pay_staff_modal', start: 183727, end: 187487 },
  { name: 'vb_treasury_transfer_modal', start: 187487, end: 190586 },
  { name: 'jb_add_staff_modal', start: 190586, end: 196800 },
  { name: 'yb_app', start: 196800, end: code.length }
];

if (!fs.existsSync('./extracted_raw')) {
  fs.mkdirSync('./extracted_raw');
}

for (const s of slices) {
  fs.writeFileSync(`./extracted_raw/${s.name}.js`, code.slice(s.start, s.end));
  console.log(`Saved ${s.name} (${s.end - s.start} bytes)`);
}
