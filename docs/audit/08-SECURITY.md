<div dir="rtl">

# 08 — SECURITY

> **🔄 עודכן ב-Re-audit 2026-09-25:** הממצאים הקודיים (XSS, אימות) טופלו ואומתו סטטית; **החשיפה הקריטית 001 נותרת פתוחה בפועל** — היא תלוית-Console ולא ניתנת לסגירה מהקוד. הסעיפים המקוריים עם הראיות נשמרו מתחת לעדכון.

## מצב עדכני לפי ממצא
| Finding | מצב קודם | מצב נוכחי | הוכחה |
|---|---|---|---|
| 🔴 001 DB פתוח אנונימית | VERIFIED | **עדיין פתוח בפועל** — הקוד מוכן (auth + path uid) אך ה-rules יוחלו רק ב-Console | grep: `signInAnonymously` קיים; אין דרך לאמת rules מכאן |
| 🟠 013 כתיבה אנונימית | HIGH CONFIDENCE | כנ"ל — ייסגר עם החלת ה-rules | — |
| 🟠 016 XSS ב-type | VERIFIED סטטית | **תוקן** — `escapeHtml(getTypeHebrew(s.type))` בחיפוש + whitelist ל-type ביבוא ובענן | `sh ./scripts/check.sh` ST-02 PASS |
| 🔵 017 RangeError בדירוג | — | **תוקן** — clamp אחיד `Math.max(0,Math.min(5,…))` בכל 3 הרינדורים | grep |
| 🔵 012 זהות חלשה | — | **תוקן** — `authUid` מ-Firebase Auth; `userKey` למיגרציה בלבד | קוד |

**מסקנת ה-Re-audit:** אפס וקטורי XSS ידועים שנותרו בקוד; החסם האבטחתי היחיד הוא ההחלה הידנית של ה-rules + Anonymous auth ב-Console (הנחיות: README → Firebase). לאחר ההחלה — להריץ את בדיקות ה-401/403 מ-24-TEST-PLAN.

---

## (מקור ה-Audit 2026-09-24 — נשמר לראיות)

**שיטה:** בדיקה סטטית מלאה + בדיקת רשת read-only אחת (TEST-003). **אין** לכתוב "המערכת מאובטחת"; להלן מה שאומת/לא אומת, לפי §41.

### FINDING-001 · RTDB קריא אנונימית במלואו (מקורי)
- **ראיה:** `curl GET https://panda-canabis-default-rtdb.europe-west1.firebasedatabase.app/.json` ללא אימות → **HTTP 200** עם `connection_test` ו-`strains/user_…` מלא (TEST-003, VERIFIED).
- **השפעה:** חשיפת רשימות שימוש רפואי של כל המשתמשים לכל האינטרנט (פרטיות רפואית).
- **תיקון:** rules פר-משתמש + אימוץ Firebase Auth — TASK-002. **בוצע בקוד; נדרשת החלה ב-Console.**

## 🟠 High
### FINDING-013 · כתיבה אנונימית כנראה פתוחה (HIGH CONFIDENCE — REQUIRES VERIFICATION)
האפליקציה כותבת ל-DB ללא כל token והכתיבות מצליחות (timestamps מתעדכנים ב-`connection_test` ב-DB החי) → הכללים מתירים כתיבת לקוח אנונימי. פרובת כתיבה עצמאית אסורה ב-Audit (D-02); אימות מלא ב-TASK-002.

### FINDING-016 · Stored XSS דרך שדה `type`
`performSearch()` (שורה 1077) מכניס `getTypeHebrew(s.type)` ל-innerHTML ללא escapeHtml — בניגוד לטבלה (923) שכן מבצע. וקטור רלוונטי במיוחד: כתיבה אנונימית ל-DB (013) → סנכרון לדפדפן הקורבן → ריצת סקריפט. **שאר הרינדורים מבצעים escapeHtml — אין אינדיקציה לווקטורים נוספים בבדיקה הסטטית.**

## ממצאים משלימים
| נושא | מצב | ראיה |
|---|---|---|
| אימות משתמשים | ❌→✅ **ממומש בקוד** (Firebase Anonymous; 012) | `signInAnonymously()` בקוד; יעיל רק לאחר החלת rules |
| הרשאות/RLS | ❌ (rules פתוחות) → ⏳ מוגדר בקוד, יוחל ב-Console | TEST-003 + README → Firebase |
| Secrets בקוד | ⚪ apiKey של Firebase מוטמע (שורה 689) | נדרש לזיהוי פרויקט — אינו secret בפני עצמו; החשיפה נגרמת מה-rules. ערך לא יועתק למסמך (D-07) |
| XSS — שאר ה-UI | ✅ escapeHtml נמצא בשימוש עקבי בטבלה/כרטיסים/pharmacies/חיפוש (016 תוקן) | קריאת קוד מלאה + ST-02 |
| SQLi/Command injection | ⚪ לא רלוונטי | אין SQL ואין exec; RTDB בלבד |
| CSRF | ⚪ לא רלוונטי ישירות | אין cookies/סשנים; ה-API הוא RTDB token-based |
| SSRF/Path traversal/File upload | ⚪ לא רלוונטי | אין שרת; היבוא הוא FileReader מקומי |
| Rate limiting/Brute force | ❌ אין | אין שכבת שרת; מטופל רק ב-rules/auth עתידיים |
| CSP / SRI | ❌ אין | אין meta CSP; אין integrity על 3 סקריפטי CDN |
| Security headers | ❌ לא בשליטת הקוד | תלוי ב-host הסטטי (GitHub Pages וכו') |
| Cookies/Sessions/JWT | ⚪ לא קיימים (Firebase session פנימי — לא נגיש לקוד) | — |
| Password handling | ⚪ לא רלוונטי | אין סיסמאות |
| נתונים רגישים בלוגים | 🔵 console.log כולל userKey (שורה 713) | דל בסביבת פיתוח |
| נגישות API מהדף | 🔴 כל סקריפט בעולם יכול לקרוא/לכתוב ל-RTDB עם ה-config הציבורי | נובע מ-001/013 |

## סיכום אבטחה
הבדיקות הסטטיות והבדיקה הרשתית היחידה שבוצעו זיהו חשיפה קריטית מאומתת (001). נושאים שלא ניתן לאמת ללא runtime/pentest (למשל היקף rules המלא, וקטורי XSS בדפדפן) מסומנים REQUIRES VERIFICATION ומטופלים ב-24-TEST-PLAN.

</div>
