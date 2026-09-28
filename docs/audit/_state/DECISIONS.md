# D-18 — Wrapper Vite לפריסה ב-Freebuff Hosting
**תאריך:** 2026-09-28

**הקשר:** Builder ה-Hosting של Freebuff דורש פרויקט עם framework מזוהה ב-`package.json` (Vite+React / Next.js / CRA) ולא הכיר את ה-SPA בקובץ יחיד.

**החלטה:** הוספת `package.json` + `vite.config.mjs` כ-**wrapper סטטי בלבד** — `index.html` נשאר היישום היחיד, ללא כל טרנספורמציה על הלוגיקה שלו. Vite מוגדר עם `server.hmr:false` (דרישת Freebuff) ו-`build.copyPublicDir:true`.

**נימוק:** כל חלופה אחרת — שכתוב ל-React/Next.js או רפקטור דומה — הייתה מסכנת רגרסיה במערכת שעברה זה עתה Audit מלא, בניגוד לרוח §13 ב-CLAUDE.md.

**אימות:** `bun run build` מייצר `dist/index.html` שזהה למקור למעט נרמול `\r` בלבד (דיף תוכן אפס); שער `check.sh` עובר במלואו גם על ה-artifact; preview HTTP 200 עם `dir="rtl"`.

**השלכות:** `bun run check` מחליף את הפקודה הישנה; אין להוסיף תלויות/טרנספורמציות ל-wrapper. FINDING-001 (Firebase Console) נותר התנאי המוקדם לשחרור.
