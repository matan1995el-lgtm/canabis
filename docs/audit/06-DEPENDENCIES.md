<div dir="rtl">

# 06 — DEPENDENCIES

מפה מלאה ב-[DEPENDENCY-MAP.md](_state/DEPENDENCY-MAP.md). תמצית.

> **🔄 עודכן ב-Re-audit 2026-09-25:** נוספה תלות ב-**firebase-auth-compat** (אותו ספק וגרסה); Chart.js קיבל guard (006 תוקן); הצמדה JS↔CSS תוקנה (002). הרישום המקורי נשמר.

## תלויות חיצוניות (רשת, כולן דרך CDN ללא SRI)
| ספק | שימוש | גרסה | נעילת גרסה | כשל אפשרי |
|---|---|---|---|---|
| fonts.googleapis.com | Heebo | — | n/a | פונט fallback בלבד — נמוך |
| cdn.jsdelivr.net | Chart.js UMD | 4.4.0 | ✅ מדויק | הודעה במקום קריסה (006 תוקן) |
| www.gstatic.com | Firebase compat (app+**auth**+database) | 10.7.1 | ✅ מדויק | ירידה למצב מקומי — מטופל |
| panda-canabis RTDB | נתונים | — | — | 🔴 פתוח אנונימית בפועל (001/013 — ממתין להחלה ב-Console) |

## תלויות פנימיות
כל הרכיבים (COMP-001…011) תלויים ב-COMP-003 (Data Layer) — עיקבות ברורה, ללא מעגלים.

## נקודות כשל יחיד (SPOF) — מעודכן
1. **RTDB** — מקור האמת המשותף; קריסתו = מצב מקומי בלבד (מטופל) אך עם חשיפה (001 — ידני).
2. **jsdelivr** — כעת עם guard: הודעה ברורה במקום קריסה (006 תוקן).
3. **Google Fonts** — נכשל בעדינות.

## ממצאי תלויות
- **אין package.json/lock** — אין ניהול תלויות, אין אפשרות audit אוטומטי (עליית גרסת Firebase דורשת עריכת שורות CDN ידנית).
- **אין SRI (Subresource Integrity)** על אף סקריפט CDN — פשרה בספק = קוד שרירותי בדף (רלוונטי ל-08).
- **אין CSP** — כל דומיין מותר לסקריפטים.
- **הצמדה שבורה JS↔CSS:** `switchTab` משנה classes ללא כללי CSS תואמים (FINDING-002).

</div>
