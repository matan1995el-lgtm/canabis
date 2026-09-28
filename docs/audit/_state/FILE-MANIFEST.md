<div dir="rtl">

# FILE-MANIFEST — מלאי הקבצים

**Root:** `/home/daytona/codebase` · **נסרק:** 2026-09-24 · **Re-audit:** 2026-09-25 · **סה"כ קבצים:** 31

> **🔄 עודכן ב-Re-audit 2026-09-25:**
>
> | Path | Type | Role | Read | Notes |
> |---|---|---|---|---|
> | `index.html` | HTML (HTML+CSS+JS inline) | היישום כולו | ✅ מלא (1,418/1,418 שורות, CRLF) | +179 שורות אחרי Execution; auth CDN, עריכה, guards |
> | `README.md` | Markdown | תיעוד המאגר | ✅ מלא | מלא (ה-stub תוקן ב-Audit); עודכן לאחר Execution (Firebase setup, troubleshooting) |
> | `CLAUDE.md` | Markdown | מדריך הפעלה לסוכנים | ✅ מלא | עודכן לאחר Execution |
> | `ID.md` | Markdown | תעודת זהות | ✅ מלא | — |
> | `scripts/check.sh` | Shell | שער איכות (ST-01/02/03) | ✅ מלא | נוצר ב-TASK-012; עודכן ב-Re-audit |
> | `scripts/check-syntax.js` | Node | חילוץ + בדיקת תחביר JS inline | ✅ מלא | נוצר ב-TASK-012 |
> | `docs/audit/*` (26) | Markdown | חבילת ה-Audit | ✅ | עודכנו ב-Re-audit (סעיפי "עודכן") |
> | `docs/testing/SMOKE-CHECKLIST.md` | Markdown | צ'קליסט smoke ידני | ✅ מלא | נוצר ב-TASK-012 |
> | `docs/audit/_state/*` (8) | Markdown | זיכרון עבודה (Anti-Context-Loss) | ✅ | עודכנו ב-Re-audit |
>
> הרישום המקורי (2 קבצים, 2026-09-24) נשמר מתחת.

## (המלאי המקורי 2026-09-24)

| Path | Type | Role | Read | Relevant | Notes |
|---|---|---|---|---|---|
| `index.html` | HTML (HTML+CSS+JS inline) | היישום כולו: UI, לוגיקה, סגנון, אינטגרציית Firebase | ✅ מלא (1,240/1,240 שורות) | ✅ | הקובץ היחיד במערכת; מכיל גם config עם apiKey |
| `README.md` | Markdown | תיעוד המאגר | ✅ מלא (שורה 1) | ✅ | Stub בן שורה אחת: `# canabis` — תועד כפער תיעוד |

## קבצים/תיקיות מחוץ ל-tracking שנבדקו

| Path | Type | Role | Read | Relevant | Notes |
|---|---|---|---|---|---|
| `.git/` | Directory | היסטוריית המאגר | ⚠️ חלקי (באמצעות git commands) | ✅ | זוהה → סווג → הוחרג מקריאת תוכן מלאה → סיבה: פנימי ל-git; נבדקו `status`, `log`, `remote`, `ls-files` |
| `docs/audit/` (שנוצר) | Markdown | תוצרי ה-Audit | ✅ | — | נוצר על ידי פרוטוקול זה; אינו חלק מהקוד המקורי |

## קבצים שלא קיימים (אימות עקיף)

- אין `package.json` / lock files — אין dependency management ואין build pipeline.
- אין קבצי tests, lint config, CI/CD, Dockerfile, `.env*`, `.gitignore`, favicon/assets.
- אין קבצי server — ההגשה נעשית כקובץ סטטי (GitHub Pages / העלאה ידנית; הערת ה-commit היחיד: "Add files via upload").

</div>
