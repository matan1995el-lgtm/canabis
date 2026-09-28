<div dir="rtl">

# 02 — FILE INVENTORY

## קבצים במאגר (git tracking)
| Path | סוג | שורות | תפקיד | נקרא | ממצאים |
|---|---|---|---|---|---|
| `index.html` | HTML+CSS+JS inline | 1,240 | היישום כולו | ✅ 100% | FINDING-001…023 |
| `README.md` | Markdown | 1 | stub תיעוד | ✅ | FINDING-014 (מטופל) |

**סה"כ: 2 קבצים · 1,241 שורות · אפס קבצים לא-נקראים.**

## מבנה ה-`index.html`
| טווח שורות | מקטע |
|---|---|
| 1–13 | head, meta, viewport, fonts, CDN scripts |
| 14–320 | `<style>` מלא: theme, dark mode, components, responsive |
| 322–408 | DOM: header, sync status, 4 טאבים |
| 411–604 | מודל הוספת זן (טופס 14 שדות) |
| 618–684 | מצב גלובלי, SAMPLE_DATA (3 זנים), firebaseConfig |
| 685–775 | Firebase: init, connection test, error handling |
| 777–845 | Chrome extension bridge |
| 756–825 | שמירה/טעינה (local + cloud) |
| 826–906 | יבוא (עם normalization+dedupe) וייצוא |
| 908–1057 | רינדור, CRUD, pharmacies |
| 1059–1146 | חיפוש, סטטיסטיקות, Chart.js |
| 1148–1223 | טאבים, מודל, סנכרון, dark mode, שיתוף, מחיקה |
| 1225–1237 | init: focus listener, ESC למודל |

## קבצים שלא קיימים (וזה עצמו ממצא)
`package.json` · `.gitignore` · tests · CI workflows · Dockerfile · `.env*` · lint config · tsconfig · favicon · assets.

## סטטיסטיקה לפי סיווג
| סיווג | מספר |
|---|---|
| source | 1 |
| docs | 1 |
| config / tests / scripts / migrations / assets / generated | 0 |
| תיקיות חוץ-מאגריות שהוחרגו | `.git` (סיבה: פנימי ל-git) |

</div>
