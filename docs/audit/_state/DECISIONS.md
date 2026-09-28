# D-18 — Wrapper Vite לפריסה ב-Freebuff Hosting
**תאריך:** 2026-09-28

**הקשר:** Builder ה-Hosting של Freebuff דורש פרויקט עם framework מזוהה ב-`package.json` (Vite+React / Next.js / CRA) ולא הכיר את ה-SPA בקובץ יחיד.

**החלטה:** הוספת `package.json` + `vite.config.mjs` כ-**wrapper סטטי בלבד** — `index.html` נשאר היישום היחיד, ללא כל טרנספורמציה על הלוגיקה שלו. Vite מוגדר עם `server.hmr:false` (דרישת Freebuff) ו-`build.copyPublicDir:true`.

**נימוק:** כל חלופה אחרת — שכתוב ל-React/Next.js או רפקטור דומה — הייתה מסכנת רגרסיה במערכת שעברה זה עתה Audit מלא, בניגוד לרוח §13 ב-CLAUDE.md.

**אימות:** `bun run build` מייצר `dist/index.html` שזהה למקור למעט נרמול `\r` בלבד (דיף תוכן אפס); שער `check.sh` עובר במלואו גם על ה-artifact; preview HTTP 200 עם `dir="rtl"`.

**השלכות:** `bun run check` מחליף את הפקודה הישנה; אין להוסיף תלויות/טרנספורמציות ל-wrapper. FINDING-001 (Firebase Console) נותר התנאי המוקדם לשחרור.

---

# D-19 — השלמת ה-wrapper ל-Vite+React (זיהוי framework מלא)
**תאריך:** 2026-09-28

**הקשר:** לאחר D-18, builder ה-Hosting עדיין סירב: הוא מזהה **React** בלבד (Vite+React / Next.js / CRA) — `react`/`react-dom` ב-dependencies הם תנאי.

**החלטה:** הוספת `react@18.3.1` + `react-dom@18.3.1` (dependencies) + `@types/react*` (devDeps), ו-`src/main.tsx` — כניסת React **סמלית** שמרנדר Fragment ריק ל-`<div id="react-root">` שנוסף ב-`index.html` ממש לפני `</body>`. שני השינויים היחידים ב-`index.html` — ה-container + תג `<script type="module" src="/src/main.tsx">`. שכבת ה-React לא מרחיבה ולא ממשקת את לוגיקת האפליקציה.

**נימוק:** זהו המינימום המכני שה-builder דורש; כל הרחבה מעבר (components/שכתוב) אסורה לפי §13.

**אימות:** שער `check.sh` PASS על המקור ועל `dist/index.html` (ST-04 עודכן: רשימת היתר לכניסות מקומיות — `/src/main.tsx` בפיתוח, `/assets/index-*.js` ב-build); `tsc` PASS; preview HTTP 200 עם `#react-root`; `freebuff-deploy check` PASS.

**השלכות:** אם ה-builder ישתנה לתמיכה בפרויקטים סטטיים — ניתן יהיה להסיר את שכבת ה-React ולחזור למצב D-18. FINDING-001 נותר התנאי המוקדם.
