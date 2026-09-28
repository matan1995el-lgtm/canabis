<div dir="rtl">

# CLAUDE.md — Operating Manual

> מדריך הפעלה ל-Claude (או לכל סוכן/מפתח) הנכנס לפרויקט. מטרתו: הבנה מלאה תוך דקות, ומניעת טעויות שכיחות. נוצר במסגרת PANDA Deep Audit (2026-09-24). מקור האמת תמיד הקוד בפועל.

## 1. מהי המערכת
**מערכת ניהול קנאביס רפואי** — יישום דפדפן אישי לקטלוג זנים: ניהול, סטטיסטיקות, חיפוש, יבוא/ייצוא, וסנכרון ל-Firebase Realtime Database. שימוש אישי; ללא משתמשים-מנהלים; עברית/RTL מלא.

## 2. Architecture & Stack
- **Single-file SPA** — הכול ב-`index.html` (~1,419 שורות): HTML + CSS מוטמע + JS inline (Vanilla ES6+, ללא פריימוורק). **סיומות שורה: CRLF — לשמר.**
- **Persistence:** localStorage (`cannabisStrains`, `userKey` — legacy למיגרציה, `canabisDark`, `importedStrainData`) + Firebase RTDB compat SDK 10.7.1 (CDN gstatic, כולל **firebase-auth-compat.js**).
- **גרפים:** Chart.js 4.4.0 (CDN jsdelivr, global `Chart`, עם guard ב-`renderStats`).
- **פונטים:** Heebo (Google Fonts).
- **אין:** framework, tests, CI, שרת, env vars. הקונפיג של Firebase מוטמע בקוד (שורות ~587–596).
- **Wrapper פריסה (2026-09-28):** `package.json` + `vite.config.mjs` מתפקדים אך ורק כ-wrapper סטטי של Vite עבור Freebuff Hosting (דורש framework מזוהה). `bun run build` מעתיק את `index.html` ל-`dist/` ללא טרנספורמציה על הלוגיקה; **אין להוסיף תלויות או טרנספורמציות**. שער: `bun run check` = `sh ./scripts/check.sh`.
- **שער אוטומטי:** `sh ./scripts/check.sh` — תחביר JS inline (ST-01) + שער smoke סטטי (ST-04: DOM ids/handlers/CDN/meta) + grep אימות לתיקונים מרכזיים (ST-02/03).

## 3. Structure — מפת `index.html`
| שורות | תוכן |
|---|---|
| 1–13 | head + 4 סקריפטי CDN (app/auth/database + Chart.js) |
| 14–320 | `<style>` (theme vars, dark mode, responsive, `.tab-content`) |
| 322–413 | DOM של 4 הטאבים + sync status |
| 416–618 | מודל הוספת/עריכת זן (14 שדות) |
| 620–700 | state גלובלי, SAMPLE_DATA, firebaseConfig |
| 700–905 | Firebase init + auth אנונימי + מיגרציה + listener + ולידציית ענן + saveData/loadData |
| 906–1010 | יבוא/ייצוא |
| 1010–1180 | רינדור טבלה, CRUD (כולל עריכת זן), pharmacies |
| 1180–1310 | חיפוש, סטטיסטיקות, Chart.js |
| 1310–1419 | טאבים, מודל, שיתוף, מחיקה, dark mode, init |

## 4. Components (מזהים) & Critical Flows
**רכיבים:** COMP-001 Shell/CSS · 002 Tabs (`switchTab`) · 003 DataLayer (`strains`, `saveData`, `loadData`, `loadFromLocalStorage`) · 004 Table (`renderStrains`) · 005 Firebase (`initializeFirebase`, `signInAnonymously`, `migrateLegacyDataIfNeeded`, `attachCloudListener`, `sanitizeCloudData`, `handleFirebaseError`) · 006 Extension bridge · 007 Stats (`renderStats` + guard) · 008 Search (`performSearch`) · 009 Modal/form (`addStrain`/`editStrain`) · 010 Import/Export · 011 SyncStatus.

**זרימות קריטיות:**
1. **הוספה/עריכה:** form → `addStrain()` (או `editStrain()` למילוי) → `strains.push`/עדכון לפי `id` → `saveData()` (local + cloud `set()` מלא עם מנגנון מנע-דריסה) → `renderStrains()`.
2. **טעינה:** DOMContentLoaded → `initializeFirebase()` → `.info/connected` → `signInAnonymously()` → מיגרציה חד-פעמית מ-`userKey` → `attachCloudListener()` (ענן → UI בזמן-אמת, עם `sanitizeCloudData`) → `loadData()`.
3. **יבוא:** file → normalize+dedupe לפי `name::type` + whitelist ל-type → merge → saveData.
4. **מחיקה/ניקוי:** `deleteStrain`/`clearAllData` → `expectCloudShrink=true` (עוקף את מנגנון המנע-דריסה) → במחיקה גורפת גם גיבוי JSON אוטומטי לפני ה-confirm.

## 5. Data Model (strain)
`id (Date.now) · name* · type ("indica"|"sativa"|"hybrid")* · potency · price · dosage · thc (0–100) · cbd (0–100) · country · importer · terpenes · effects · rating (0–5, clamped) · pharmacies[] · notes · createdAt (ISO) · updatedAt? (ISO — רק לאחר עריכה)`
- **Firebase paths:** `strains/{authUid}` (מערך; uid מ-Firebase Auth האנונימי). `strains/{userKey}` ישן — מועבר אוטומטית ונמחק. `connection_test` — בוטל.
- **ולידציית ענן ממומשת** (`sanitizeCloudData`): name/type מחרוזות תקינות, מספרים, clamp ל-rating, סינון pharmacies; פריט פגום = דילוג. גם ביבוא: whitelist ל-type + clamp ל-rating.

## 6. Frontend/RTL קונבנציות
- `lang="he" dir="rtl"` — חובה לשמור; אין להוסיף ערכי direction ידניים.
- צבעים דרך CSS variables מ-`:root`/`.dark` בלבד; כפתורים: `.btn .btn-primary/.btn-secondary/.btn-danger/.btn-small`.
- הודעות: `showNotification()`; אישורים: `confirm()`; הרינדור דרך template strings + **חובה `escapeHtml()` לכל שדה משתמש** (ממומש בכל הרינדורים, כולל חיפוש).

## 7. Backend/DB/API rules
- כל התקשורת מול Firebase RTDB בלבד; אין endpoints משלנו.
- **Rules נכונים (יעד):** קריאה/כתיבה רק ל-`strains/$uid` עבור `auth.uid === $uid`. הקוד מוכן (auth אנונימי + נתיב uid); **ההחלה ב-Console היא שלב ידני נותר** — ראה README → Firebase.
- אין לכתוב נתונים ל-node ציבורי כלשהו; אין להחזיר כתיבת `connection_test`.

## 8. Integrations
- **תוסף דפדפן חיצוני** כותב `localStorage.importedStrainData` — הקוד בדף מקבל, מציג confirm וממלא טופס. אין להזיז את שם המפתח.
- CDN חיצוני ×4 (Chart.js, firebase-app/auth/database) — אין SRI; אין להוסיף סקריפטים ללא גרסה מדויקת.

## 9. Environment
- אין env vars; `firebaseConfig` מוטמע. שינוי פרויקט Firebase = עריכת ה-config בקוד.
- דרישות רשת בזמן ריצה: fonts.googleapis.com, cdn.jsdelivr.net, www.gstatic.com, RTDB.

## 10. Development
- להריץ: לפתוח `index.html` בדפדפן (או כל static server). אין build/watch.
- עריכה: הקפדה על סגנון הקוד הקיים (פונקציות גלובליות, הערות מחלקות `/* ===== */`).

## 11. Tests & Build
- אין test suite; שער: `sh ./scripts/check.sh` (ST-01 תחביר + ST-04 smoke סטטי + ST-02/03 אימות תיקונים). Smoke checklist: `docs/testing/SMOKE-CHECKLIST.md`; חוזה התוסף: `docs/testing/EXTENSION-BRIDGE.md`; תוכנית מלאה: `docs/audit/24-TEST-PLAN.md`.

## 12. Deployment
- כיום: העלאה ידנית. **חסימת פרסום יחידה שנותרה: החלת ה-rules + Anonymous auth ב-Firebase Console (TASK-002 צד-שרת)** — הצעדים מתועדים ב-README → Firebase. הקוד עצמו מוכן.
- תהליך פריסה מלא (Freebuff Hosting / GitHub Pages / rollback): `docs/audit/26-DEPLOYMENT.md` (TASK-015).
- גישת ניטור: `docs/audit/27-MONITORING.md` (TASK-016).

## 13. קבצים שאסור לשנות ללא בדיקה
- `index.html` — הקובץ היחיד; כל שינוי בו משפיע על הכול. אזורים רגישים במיוחד: firebaseConfig, `saveData`/`loadData` (סמנטיקת סנכרון), `escapeHtml`, viewport meta (חסימת zoom קיימת — לא להוסיף עוד הגבלות).
- אין ליצור קבצים חדשים שמשכפלים לוגיקה במקום לערוך את היחיד.

## 14. Known Issues (מעודכן לאחר Execution 2026-09-25)
**תוקנו בקוד:** 002 (CSS טאבים) · 003 (listeners + מנגנון מנע-דריסה; `suppressCloudEcho` מונה) · 004 (ולידציית ענן) · 005 (connection_test בוטל, `.info/connected`) · 006 (guard ל-Chart) · 007/008 (קוד מת, substr) · 010 (persist מצב כהה) · 011 (גיבוי לפני מחיקה) · 012 (catch ל-copyLink) · 016/017 (XSS + clamp דירוג) · 018 (zoom + focus management) · 020 (polling הוסר) · 021 (חוסן localStorage) · 022 (defer) · 009 (עריכת זן) · 015 (dark mode בטעינה) · ניטים: מונה echo, הסרת `openAddBtn`.
**הושלמו בתיעוד (2026-09-25):** TASK-015 (26-DEPLOYMENT.md) · TASK-016 (27-MONITORING.md) · חוזה התוסף (docs/testing/EXTENSION-BRIDGE.md) · שער ST-04 (scripts/check-smoke.js).
**נותר פתוח (ידני, מחוץ לקוד):** 🔴 001 — החלת ה-rules + הפעלת Anonymous auth ב-Firebase Console (חסימת פרסום; הקוד מוכן). כמו כן: אימות דפדפן מלא (smoke — TASK-017) ובדיקות 401/403 לאחר ה-rules (TEST-R08).

## 15. Regression Map (§48) — אם משנים X, חובה לבדוק Y
| משנים… | חובה לבדוק |
|---|---|
| `saveData`/`loadData`/מבנה strain | FLOW-001–003, 007: הוספה/מחיקה/רענון/מכשיר שני + יבוא+ייצוא (schema!) |
| `firebaseConfig`/init/auth | טעינה מלאה, offline fallback, חיווי סנכרון |
| CSS theme/`.tab-content` | מעבר טאבים, dark mode, responsive 375px |
| `escapeHtml`/רינדורים | טבלה, חיפוש, pharmacies, יבוא עם תווים מיוחדים |
| מודל/טופס | addStrain, סגירת ESC, pharmacies tags |
| CDN שורות 10–12 | גרף, סנכרון, טעינה ראשונית (defer) |

## 16. לפני כל שינוי (חובה)
1. לזהות רכיבים מושפעים (COMP-XXX) ואת הזרימות הקריטיות שנוגעות בהם.
2. לבדוק dependencies: מי קורא לפונקציות שאשנה (הכול גלובלי — חפשו את השם בכל הקובץ).
3. API impact: האם משתנה מבנה הנתונים שנשמר ב-localStorage/ענן? (השפעה על נתונים קיימים של משתמשים!)
4. DB impact: שינוי שדות = צריך normalize גם ביבוא וגם בקליטת ענן.
5. UI impact: RTL, dark mode, responsive.
6. לזהות בדיקות רלוונטיות לפי 24-TEST-PLAN ו-Regression Map (§15 לעיל).
7. להעריך breaking changes לנתונים שמורים — ואם יש, לתכנן migration.

## 17. אחרי כל שינוי (חובה)
1. `node --check` על ה-JS ה-inline (שער ST-01).
2. Smoke בדפדפן: מעבר טאבים, הוספה, מחיקה, רענון (שמירה), חיפוש, יבוא/ייצוא.
3. בדיקת regression לפי §15 לנוגע בשינוי.
4. אימות RTL + dark mode + מובייל 375px אם נגעתם ב-CSS/DOM.
5. עדכון תיעוד (CLAUDE.md/README/audit) אם השינוי משנה התנהגות או מבנה.

## 18. Definition of Done
[ ] אפס שגיאות console בטעינה ובזרימות הנגעות · [ ] ST-01 PASS · [ ] smoke PASS · [ ] RTL/dark לא נפגעו · [ ] ללא רגרסיה לפי §15 · [ ] תיעוד מעודכן · [ ] שינויי נתונים תואמים אחורה או עם migration.

</div>
