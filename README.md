<div dir="rtl">

# 🌿 מערכת ניהול קנאביס רפואי (canabis)

יישום דפדפן אישי לניהול, מעקב והשוואה של זני קנאביס רפואי — עם סנכרון ענן (Firebase), סטטיסטיקות, חיפוש, וגיבוי/שחזור. הכול בקובץ אחד, ללא התקנות.

## ✨ Features
- **קטלוג זנים** — הוספה (14 שדות: THC/CBD, עוצמה, מחיר, טרפנים, בתי מרקחת ועוד), **עריכה**, צפייה ומחיקה
- **סטטיסטיקות** — ממוצעי THC/CBD/מחיר/דירוג + גרף (Chart.js)
- **חיפוש** — חופשי על שם/סוג/טרפנים/השפעות/הערות
- **סנכרון ענן** — Firebase Realtime Database עם האזנה בזמן-אמת, ולידציה ומנגנון מנע-דריסה (fallback מלא למצב מקומי)
- **גיבוי ושחזור** — ייצוא/ייבוא JSON (עם normalization ו-dedupe)
- **קליטת נתונים מתוסף דפדפן** — מילוי טופס אוטומטי
- **מצב כהה (נשמר בין ביקורים)**, עיצוב responsive, **RTL מלא** ונגישות בסיסית (פוקוס במודלים, ESC, aria)
- שיתוף: WhatsApp / Email / העתקת קישור

## 🏗 Architecture Overview
Single-file SPA: כל ה-UI, הלוגיקה והסגנון ב-`index.html`. הנתונים נשמרים ב-localStorage ומסונכרנים ל-Firebase RTDB (`strains/{authUid}` בעקבות אימות אנונימי; נתיב `userKey` הישן מועבר במיגרציה אוטומטית). מפה מלאה: [docs/audit/01-SYSTEM-MAP.md](docs/audit/01-SYSTEM-MAP.md).

## 🧰 Stack
Vanilla JS (ES6+) · HTML5 · CSS3 (מוטמע) · Firebase RTDB compat SDK 10.7.1 · Chart.js 4.4.0 · Heebo — הכול דרך CDN, ללא build.

## 📋 Requirements
דפדפן מודרני בלבד. חיבור אינטרנט נדרש לסנכרון/גרפים/פונטים (האפליקציה עובדת מקומית בלעדיהם).

## 🚀 Setup
1. לפתוח את `index.html` בדפדפן — זהו. אין התקנה, אין build.
2. (אופציונלי) שרת סטטי מקומי: `python3 -m http.server` ופתיחת `http://localhost:8000`.

## ☁️ Firebase (להקמה עצמאית — דרוש אימות)
הפרויקט מחובר לפרויקט Firebase קיים (`panda-canabis`). להקמה משלכם: ליצור פרויקט + Realtime Database (europe-west1 לדוגמה), להעתיק את ה-config ל-`firebaseConfig` בתוך `index.html`, ולהגדיר **rules מאובטחים** (ראו ⚠️ למטה).

### 📋 חובה ב-Firebase Console (חסימת פרסום — TASK-001/002)

**הצעד הראשון — גיבוי (TASK-001):**
1. Firebase Console → Realtime Database → **Export JSON** — לשמור את הקובץ מחוץ למאגר.
2. לתעד את ה-Rules הנוכחיים (צילום מסך) לצורך rollback.

**סגירת המסד (TASK-002):**
1. Authentication → Sign-in method → **הפעלת Anonymous**.
2. Realtime Database → Rules — להחליף ב:
```json
{
  "rules": {
    ".read": false,
    ".write": false,
    "strains": {
      "$uid": {
        ".read": "auth != null && auth.uid === $uid",
        ".write": "auth != null && auth.uid === $uid"
      }
    }
  }
}
```
3. למחוק את ה-node הציבורי `connection_test` מה-Console (כבר לא נכתב מהקוד).
4. מיגרציה: האפליקציה מעבירה אוטומטית נתונים מ-`strains/user_...` (המפתח המקומי הישן) אל `strains/{authUid}` (ה-uid החדש) בכניסה הראשונה אחרי הפעלת ה-auth.

> ⚠️ **עד שהצעדים לעיל לא בוצעו ב-Console** — המסד נותר פתוח לכל האינטרנט (FINDING-001). הקוד מוכן ומחכה ל-rules; ההגנה בפועל תאכף רק מה-Console.

## 🧪 Testing
שער אוטומטי: `sh ./scripts/check.sh` (תחביר JS inline + שער smoke סטטי ST-04 + אימות תיקונים מרכזיים — TASK-012). צ'קליסט smoke דפדפן: [docs/testing/SMOKE-CHECKLIST.md](docs/testing/SMOKE-CHECKLIST.md), חוזה התוסף: [docs/testing/EXTENSION-BRIDGE.md](docs/testing/EXTENSION-BRIDGE.md), תוכנית הבדיקות המלאה ב-[docs/audit/24-TEST-PLAN.md](docs/audit/24-TEST-PLAN.md).

## 📦 Build & Deployment
**חי:** [canabis.freebuff.app](https://canabis.freebuff.app) (Freebuff Hosting). אין build לאפליקציה עצמה — היא נפרסת כפי שהיא. `package.json` + `vite.config.mjs` + `src/main.tsx` הם wrapper סטטי בלבד (Vite+React, ללא טרנספורמציה על הלוגיקה) הדרוש ל-Freebuff Hosting, שמזהה רק פרויקטי React: `bun run build` מייצר `dist/`, `bun run dev` לפיתוח, `bun run check` להרצת שער האיכות. תהליך פריסה מלא (Freebuff Hosting / GitHub Pages / rollback / דרישות מוקדמות): [docs/audit/26-DEPLOYMENT.md](docs/audit/26-DEPLOYMENT.md). מומלץ GitHub Pages **לאחר** סגירת ה-Firebase rules. ניטור: [docs/audit/27-MONITORING.md](docs/audit/27-MONITORING.md).

## 📁 Structure
```
index.html      ← היישום כולו (HTML+CSS+JS)
package.json    ← wrapper פריסה (Vite+React לזיהוי) — אינו משנה את האפליקציה
vite.config.mjs ← קונפיג Vite מינימלי (hmr:false, copyPublicDir)
src/main.tsx    ← כניסת React סמלית (מרנדר ריק ל-#react-root)
README.md
CLAUDE.md       ← מדריך הפעלה לסוכני AI/מפתחים
ID.md           ← תעודת זהות המערכת
scripts/        ← check.sh (שער ST-01/02/03/04) + check-syntax.js + check-smoke.js
docs/audit/     ← חבילת PANDA Deep Audit (26 מסמכים + 26/27 חדשים)
docs/testing/   ← SMOKE-CHECKLIST + EXTENSION-BRIDGE (חוזה התוסף)
```

## 🔧 Troubleshooting
| תופעה | פתרון |
|---|---|
| "מצב: לא מחובר" | בדיקת רשת; הפעלת Anonymous auth + rules חדשים ב-Console (ראו Firebase למעלה); ה-config בקוד. האפליקציה ממשיכה מקומית |
| "אימות אנונימי כבוי" | Firebase Console → Authentication → Sign-in method → הפעלת Anonymous |
| גרף לא מופיע | CDN חסום — הטאב מציג את המדדים עם הודעה ברורה במקום קריסה |
| הודעת "למזג אוטומטית?" בסנכרון | מנגנון מנע-דריסה: זוהו זנים בענן שחסרים מקומית — מומלץ לאשר מיזוג כדי לא לאבד נתונים |
| נתונים מהתוסף לא מגיעים | חוזה ה-bridge: `localStorage.importedStrainData` — ראה [docs/testing/EXTENSION-BRIDGE.md](docs/testing/EXTENSION-BRIDGE.md) |

## 🔒 Security
- **אימות אנונימי (Firebase Auth)** — כל משתמש עובד רק מול `strains/{authUid}` שלו; המסד נסגר לאנונימיים ברגע שה-rules החדשים יוחלו ב-Console (שלב חובה — ראו Firebase למעלה).
- מיגרציה אוטומטית חד-פעמית מ-`userKey` המקומי הישן אל ה-uid החדש.
- דוח האבטחה המלא: [docs/audit/08-SECURITY.md](docs/audit/08-SECURITY.md).

## 📚 Documentation
חבילת Audit מלאה ב-`docs/audit/` — סיכום מנהלים: [00-EXECUTIVE-SUMMARY.md](docs/audit/00-EXECUTIVE-SUMMARY.md), תוכנית עבודה: [23-ACTION-PLAN.md](docs/audit/23-ACTION-PLAN.md).

</div>
