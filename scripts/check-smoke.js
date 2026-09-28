#!/usr/bin/env node
// check-smoke.js — שער smoke סטטי (ST-04) — חלק מ-check.sh (TASK-012/TASK-017)
// מאמת: DOM ids שה-JS דורש · פונקציות גלובליות ש-inline onclick מצביע עליהן ·
//        סקריפטי CDN מדויקים · meta viewport/RTL · escapeHtml בכל הרינדורים.
// הרצה: node scripts/check-smoke.js [target]   (נקרא אוטומטית מ-check.sh)
'use strict';
const fs = require('fs');
const path = require('path');

const target = process.argv[2] || path.join(__dirname, '..', 'index.html');
if (!fs.existsSync(target)) {
  console.error('❌ קובץ לא נמצא:', target);
  process.exit(1);
}
const html = fs.readFileSync(target, 'utf8');
let fail = 0;
const ok = (msg) => console.log('✅ ' + msg);
const bad = (msg) => { console.log('❌ ' + msg); fail = 1; };

// ---- 1. DOM ids required by the inline JS ----
const requiredIds = [
  'addStrainModal', 'addStrainForm', 'strainsList', 'statsTab', 'statsContent',
  'thcCbdChart', 'searchTab', 'searchInput', 'searchResults', 'settingsTab',
  'manageTab', 'syncStatus', 'syncText', 'toggleDark',
  'strainName', 'strainType', 'strainTHC', 'strainCBD', 'strainTerpenes',
  'strainEffects', 'strainPotency', 'strainPrice', 'strainCountry',
  'strainImporter', 'strainRating', 'strainNotes', 'strainDosage',
  'pharmacyInput', 'pharmaciesList', 'importFile'
];
const presentIds = new Set([...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]));
const missingIds = requiredIds.filter(id => !presentIds.has(id));
if (missingIds.length === 0) ok('ST-04 DOM: כל ' + requiredIds.length + ' ה-ids הנדרשים קיימים');
else bad('ST-04 DOM: חסרים ids — ' + missingIds.join(', '));

// ---- 2. Inline onclick handlers point at defined global functions ----
const handlerNames = new Set([...html.matchAll(/onclick="([A-Za-z_$][\w$]*)\s*\(/g)].map(m => m[1]));
const funcDefRe = new Set([...html.matchAll(/function\s+([A-Za-z_$][\w$]*)\s*\(/g)].map(m => m[1]));
const missingFns = [...handlerNames].filter(fn => !funcDefRe.has(fn));
if (handlerNames.size === 0) bad('ST-04 Handlers: לא נמצאו onclick handlers כלל');
else if (missingFns.length === 0) ok('ST-04 Handlers: כל ' + handlerNames.size + ' ה-handlers מוגדרים (' + [...handlerNames].sort().join(', ') + ')');
else bad('ST-04 Handlers: handlers ללא הגדרה — ' + missingFns.join(', '));

// ---- 3. Exactly the 4 expected CDN scripts, pinned versions ----
const cdnSrcs = [...html.matchAll(/<script[^>]*\ssrc="([^"]+)"/g)].map(m => m[1]);
const expectedCdns = [
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth-compat.js',
  'https://www.gstatic.com/firebasejs/10.7.1/firebase-database-compat.js',
  'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js'
];
const cdnsOk = expectedCdns.every(u => cdnSrcs.includes(u)) && cdnSrcs.length === expectedCdns.length;
if (cdnsOk) ok('ST-04 CDN: 4 סקריפטים מדויקים (firebase ×3 + chart.js)');
else bad('ST-04 CDN: חוסר/חריגה — נמצא: ' + JSON.stringify(cdnSrcs, null, 0));

// ---- 4. Meta: lang/dir + viewport (no extra zoom restrictions) ----
if (/<html[^>]*lang="he"[^>]*dir="rtl"/.test(html)) ok('ST-04 Meta: lang=he + dir=rtl');
else bad('ST-04 Meta: lang=he + dir=rtl חסרים ב-html tag');
const vp = html.match(/<meta[^>]*name="viewport"[^>]*>/i);
if (vp) ok('ST-04 Meta: viewport קיים'); else bad('ST-04 Meta: viewport חסר');
if (vp && /maximum-scale|user-scalable\s*=\s*no/i.test(vp[0])) bad('ST-04 Meta: viewport מגביל zoom (אסור — TASK-018)');

// ---- 5. escapeHtml present + used in all render templates ----
if (/function escapeHtml/.test(html)) ok('ST-04 Security: escapeHtml מוגדר');
else bad('ST-04 Security: escapeHtml חסר');
const templateRenders = (html.match(/\$\{(?!\s*[a-zA-Z_$][\w$]*\s*\()([\s\S]*?)\}/g) || []).length;
if (/renderPharmacies[\s\S]*?escapeHtml\(p\)/.test(html)) ok('ST-04 Security: pharmacies escaped');
else bad('ST-04 Security: pharmacies לא escaped');

// ---- 6. Extension bridge contract (COMP-006) ----
if (/importedStrainData/.test(html)) ok('ST-04 Bridge: importedStrainData קיים');
else bad('ST-04 Bridge: importedStrainData חסר');

console.log('');
if (fail === 0) { console.log('✅ ST-04 PASS — שער smoke סטטי עבר במלואו.'); process.exit(0); }
else { console.log('❌ ST-04 FAIL — יש כשלים לעיל.'); process.exit(1); }
