#!/usr/bin/env node
/**
 * check-syntax.js — שער תחביר (ST-01) עבור ה-JS ה-inline של index.html
 * PANDA Deep Audit — TASK-012
 *
 * שימוש: node scripts/check-syntax.js [נתיב-קובץ]
 * יוצאת עם קוד 0 אם התחביר תקין, קוד 1 אם לא.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const target = process.argv[2] || path.join(__dirname, '..', 'index.html');

if (!fs.existsSync(target)) {
  console.error('❌ קובץ לא נמצא:', target);
  process.exit(1);
}

const html = fs.readFileSync(target, 'utf8');

// חילוץ כל בלוקי <script> inline (ללא src)
const scriptRe = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
const scripts = [];
let m;
while ((m = scriptRe.exec(html)) !== null) {
  const attrs = m[1] || '';
  const body = m[2] || '';
  if (/\bsrc\s*=/i.test(attrs)) continue; // דלג על סקריפטי CDN חיצוניים
  if (body.trim() === '') continue;
  scripts.push(body);
}

if (scripts.length === 0) {
  console.error('❌ לא נמצא JS inline לבדיקה בתוך', target);
  process.exit(1);
}

let ok = true;
scripts.forEach((code, i) => {
  try {
    // new Function מאמת תחביר בלי להריץ; vm.compileFunction שקול אך מפורש יותר
    new vm.Script(code, { filename: `${path.basename(target)}#inline-script-${i + 1}` });
    console.log(`✅ inline-script-${i + 1}: תחביר תקין (${code.split('\n').length} שורות)`);
  } catch (err) {
    ok = false;
    console.error(`❌ inline-script-${i + 1}: שגיאת תחביר — ${err.message}`);
  }
});

if (!ok) {
  console.error('\n❌ ST-01 נכשל — תקן את שגיאות התחביר לפני המשך.');
  process.exit(1);
}

console.log('\n✅ ST-01 PASS — כל ה-JS ה-inline תקין תחבירית.');
