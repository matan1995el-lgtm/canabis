<div dir="rtl">

# 17 — TECHNICAL DEBT

| נושא | ביטוי בקוד | חומרה | המקום ב-Action Plan |
|---|---|---|---|
| הכול בקובץ אחד | 1,240 שורות מעורבות HTML/CSS/JS | 🟡 מגביל צמיחה; סביר להיקף זה | P5 (רק אם צומח) |
| אין toolchain | אין package.json/lint/tsc/tests/CI | 🟡 | TASK-012 (P3) |
| innerHTML + template strings | הרכבת HTML ידנית עם escapeHtml ידני | 🟡 (מקור XSS ב-016) | מטופל ב-TASK-006 |
| inline event handlers | onclick בכל ה-DOM | 🔵 מונע CSP קפדני עתידי | P4 |
| שכפול לוגיקה | '⭐'.repeat ×3 עם clamp לא-אחיד; נורמליזציית שדות ב-2 מקומות | 🔵 | TASK-014 |
| קוד מת | `safeTypeClass` (918), `--accent`/`--glass` CSS לא בשימוש נרחב | 🔵 | TASK-014 |
| Deprecated API | `String.prototype.substr` (711) | 🔵 | TASK-014 |
| Magic values | הגבלות תוקף THC (10/18/22) בלי קבועים; צבעים inline | 🔵 | P3 |
| console.log רבים | debug logging נשאר בפרודקשן (כולל userKey) | 🔵 | P3 |
| alert()/confirm() | UX מדור קודם | 🔵 | P3 |
| קונפיג קשיח | firebaseConfig מוטמע, אין env | 🔵 | P3 |

**הערה כוללת:** החוב הטכני ברמה סבירה לפרויקט מסוג זה; אף אחד מהפריטים אינו מצדיק rewrite. הפריטים 🟡 מטופלים במסגרת תיקוני ה-P1 הטבעיים.

</div>
