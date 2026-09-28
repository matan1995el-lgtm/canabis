<div dir="rtl">

# ID.md — תעודת זהות המערכת

| נושא | ערך |
|---|---|
| **שם** | מערכת ניהול קנאביס רפואי (repo: `canabis`) |
| **סוג** | Web SPA בקובץ יחיד, client-only, עם סנכרון ענן |
| **מטרת על** | ניהול אישי של זני קנאביס רפואי: קטלוג, מעקב, השוואה, גיבוי |
| **בעיה שהיא פותרת** | ריכוז מידע זנים פזור (הערות, מחירים, בתי מרקחת, ניסיון אישי) במקום אחד נגיש גם מהטלפון |
| **משתמשים** | משתמש אישי (ללא רב-משתמשים/הרשאות) |
| **מצב** | פונקציונלי אך עם פגמים מהותיים; **Not Ready לפרודקשן** (FINDING-001 קריטי) |
| **Stack** | Vanilla JS ES6+, HTML5, CSS3 — הכול ב-`index.html` (~1,419 שורות) |
| **Architecture** | Single-file SPA; state in-memory → localStorage (primary) → Firebase RTDB (mirror, listener בזמן-אמת) |
| **Frontend** | 4 טאבים + מודל; RTL מלא; dark mode נשמר; Chart.js 4.4.0; Heebo |
| **Backend** | אין (אין שרת משלנו) |
| **Database** | Firebase RTDB `panda-canabis` (europe-west1): `strains/{authUid}` (אחרי מיגרציה מ-`strains/{userKey}` הישן); `connection_test` בוטל |
| **Infrastructure** | Static hosting בלבד (העלאה ידנית); אין CI/Docker/IaC |
| **APIs** | RTDB בלבד (SDK + REST implicit); אין endpoints משל המערכת |
| **Integrations** | Firebase · Chart.js · Google Fonts · תוסף דפדפן חיצוני (localStorage bridge) |
| **Authentication** | ✅ אימות אנונימי (Firebase Auth) — הקוד מוכן; הפעלת Anonymous ב-Console נותרה ידנית |
| **Authorization** | ⏳ rules פר-משתמש (`auth.uid === $uid`) מוכנים בתיעוד; ההחלה ב-Console היא החסם היחיד לפרסום |
| **Deployment** | העלאת קובץ ידנית; יעד סופי לא-מאומת (OPEN-Q3) |
| **Environments** | אין הפרדה מתועדת (dev/prod אותו DB) |
| **Entry Points** | `index.html` · DOMContentLoaded → `initializeFirebase()` + `setupExtensionIntegration()` |
| **Critical Components** | COMP-003 DataLayer · COMP-005 Firebase · COMP-004 Table |
| **Critical Flows** | FLOW-001 הוספה · FLOW-002 טעינה · FLOW-003 מחיקה · FLOW-004/005 יבוא/ייצוא |
| **Security Model** | אימות אנונימי + sanitize; escapeHtml ידני; אין CSP/SRI; 🔴 ה-rules בפועל עדיין פתוחים עד להחלה ב-Console |
| **Dependencies** | CDN ×4 (gstatic, jsdelivr, fonts) — ללא package.json/SRI |
| **Tests** | שער יחיד `sh ./scripts/check.sh` (ST-01/02/03) + SMOKE-CHECKLIST; אין בדיקות דפדפן אוטומטיות |
| **Monitoring** | ❌ אין |
| **Backups** | ייצוא JSON ידני + גיבוי אוטומטי לפני מחיקה גורפת |
| **Known Issues** | רוב ממצאי ה-Audit תוקנו ב-Execution 2026-09-25; פתוח: rules ב-Console (🔴 001), smoke, TASK-015/016 |
| **Technical Debt** | קובץ-יחיד, אין toolchain, inline handlers, שכפולים קלים (17-TECHNICAL-DEBT) |
| **Production Readiness** | **NOT READY** — חסם יחיד: החלת rules + Anonymous auth ב-Console (TASK-002 צד-שרת) |

## המערכת במשפט אחד
אפליקציית קטלוג אישית לזני קנאביס רפואי בקובץ HTML אחד, עם סנכרון Firebase דו-כיווני מאובטח בקוד — פונקציונלית ועשירה; החסם היחיד לפרסום הוא החלת ה-rules ב-Console.

## המערכת ב-30 שניות
פותחים `index.html` → אימות אנונימי → הזנים נטענים מ-localStorage/ענן (עם ולידציה והאזנה בזמן-אמת) → מוסיפים/עורכים זנים דרך מודל, צופים בסטטיסטיקות וגרף, מחפשים, מייצאים גיבוי JSON. הסנכרון כותב את הקטלוג המלא ל-`strains/{authUid}`. **בעיות עיקריות:** ה-rules בפועל עדיין פתוחים (ממתינים להחלה ב-Console); אין בדיקות דפדפן אוטומטיות.

## המערכת ב-5 דקות
**זרימת הליבה:** בטעינה, `initializeFirebase()` מאתחל SDK, מציב חיווי דרך `.info/connected`, מבצע `signInAnonymously()`, מריץ מיגרציה חד-פעמית מ-`userKey` אל `authUid`, ומחבר listener בזמן-אמת על `strains/{authUid}` עם `sanitizeCloudData`. אם הענן מחזיק נתונים תקינים — הם גוברים על המקומי; אחרת — localStorage ואם ריק: SAMPLE_DATA. כל שמירה = `set()` מלא של המערך לענן (עם מנגנון מנע-דריסה ו-`expectCloudShrink` למחיקות מכוונות) + כתיבה מקומית. ההוספה והעריכה דרך טופס 14 שדות; היבוא מנרמל, מאמת (whitelist ל-type, clamp לדירוג) ומדלג כפילויות לפי `name::type`. התוסף החיצוני מזרים זנים דרך `importedStrainData`.
**ארכיטקטורה:** שכבות MVC בקובץ אחד; אין build; כל התלויות CDN.
**מצב אבטחה:** הקוד מוכן (אימות אנונימי, נתיב uid, sanitize, XSS תוקן) — אך **ה-rules בפועל עדיין פתוחים עד להחלה ב-Console**; נדרשת גם הפעלת Anonymous sign-in.
**מה תקין:** CRUD + עריכה, offline-first, RTL, נגישות בסיס, תחביר (ST-01 PASS), שער check.sh.
**מה שבור/חסר:** החלת rules ב-Console (ידני), בדיקות דפדפן אוטומטיות, CI, פריסה מסודרת (TASK-015), ניטור (TASK-016).
**התוכנית:** להשלים את הצעדים הידניים ב-Firebase Console (README → Firebase), לרוץ smoke מלא (SMOKE-CHECKLIST), ואז TASK-015/016.

## התמונה המלאה
מערכת בגודל אישי שנבנתה נכון למטרתה ועובדת בפועל. לאחר Execution 2026-09-25 — כל הממצאים הקודיים מה-Audit תוקנו ואומתו (ניווט, אבטחת קלט, סנכרון דו-כיווני, עריכה, גיבוי). התשתית טובה מספיק **לשימוש אמיתי** ברגע שיוחלו ה-rules המאובטחים ב-Firebase Console — החסם היחיד שנותר, והוא צעד ידני מתועד ב-README.

</div>
