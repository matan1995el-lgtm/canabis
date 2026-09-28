<div dir="rtl">

# 12 — INFRASTRUCTURE

## מה קיים בפועל
| רכיב | קיים? | פירוט |
|---|---|---|
| שרת יישומי | ❌ | אין — קובץ סטטי יחיד |
| Dockerfile / compose | ❌ | — |
| nginx / proxy | ❌ | תלוי ב-host הסטטי (זהות לא-מאומתת — OPEN-Q3) |
| CI/CD | ❌ | אין workflows; ה-commit היחיד: "Add files via upload" |
| Staging/Production | ❌ | אין הפרדת סביבות מתועדת |
| Monitoring/Logs/Metrics | ❌ | אין; הדיבוג היחיד הוא console.log בדפדפן המשתמש |
| Backup/Restore/Rollback | ❌ | אין אוטומטיים; גיבוי יחיד = ייצוא JSON ידני (FLOW-005) |

## שירותים חיצוניים בשימוש
| שירות | מטרה | SLA/ניטור | סיכון |
|---|---|---|---|
| Firebase RTDB (europe-west1) | נתונים | אין ניטור מוגדר; תלות בסטטוס Firebase | 🔴 rules פתוחים (001) |
| Google Fonts | טיפוגרפיה | — | 🔵 נמוך |
| jsdelivr | Chart.js | — | 🟡 קריסה שקטה (006) |
| gstatic | Firebase SDK | — | 🟡 חסימה = מצב מקומי בלבד (מטופל) |

## Failure Map (§20 — מה קורה אם…)
| תרחיש | השפעה בפועל | התאוששות |
|---|---|---|
| DB נופל/לא זמין | האפליקציה ממשיכה מקומית; חיווי offline; `handleFirebaseError` נופל ל-localStorage | אוטומטית בטעינה הבאה |
| External API (CDN) לא זמין | גרף קורס שקט (006); SDK חסום = מקומי; פונט נופל ל-fallback | רענון ברשת זמינה |
| worker/queue/scheduler | ⚪ לא קיימים בארכיטקטורה | — |
| disk מתמלא / VPS restart | ⚪ לא רלוונטי (אין שרת משלנו) | — |
| env var חסר | ⚪ לא רלוונטי (אין env vars בקוד — ה-config מוטמע) | — |
| migration נכשל | ⚪ אין migrations | — |
| deployment נכשל | העלאה ידנית — אין rollback מלבד העלאה חוזרת של קובץ קודם | ידני |

**מסקנה:** פשטות ה-infra היא תכונה (כמעט ואין מה לקרוס), אך היא גם משאירה את כל הסיכון בשכבת Firebase Rules ובתהליך הידני.

</div>
