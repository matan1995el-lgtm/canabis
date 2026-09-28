<div dir="rtl">

# 07 — BUGS

> **🔄 עודכן ב-Re-audit 2026-09-25:** כל הבאגים הפונקציונליים מהרשימה המקורית טופלו בקוד ואומתו (שער `sh ./scripts/check.sh` — PASS; 18 בדיקות רגרסיה ממוקדות — PASS). הרישום המקורי נשמר מתחת לעדכון לראיות והקשר.

## מצב נוכחי לפי ממצא (Re-audit)
| Finding | חומרה מקורית | מצב | תיקון בקוד |
|---|---|---|---|
| 002 | 🟠 High | ✅ תוקן | `.tab-content{display:none}` + `.active{display:block}` |
| 003 | 🟠 High | ✅ תוקן | listener `on('value')` + מנגנון מנע-דריסה עם מיזוג לפי id |
| 016 | 🟠 High | ✅ תוקן | `escapeHtml(getTypeHebrew(s.type))` + whitelist ל-type |
| 004 | 🟡 Med | ✅ תוקן | `sanitizeCloudData` — ולידציה לכל פריט ענן |
| 005 | 🟡 Med | ✅ תוקן | `.info/connected` במקום כתיבת `connection_test` |
| 006 | 🟡 Med | ✅ תוקן | guard `typeof Chart === 'undefined'` + הודעה |
| 010 | 🟡 Med | ✅ תוקן | persist `canabisDark` + צבעים מ-`getComputedStyle` |
| 011 | 🟡 Med | ✅ תוקן | `exportData()` אוטומטי לפני מחיקה גורפת |
| 012 | 🟡 Med | ✅ תוקן | `authUid` מ-Firebase Auth (מיגרציה ל-userKey) |
| 018 | 🟡 Med | ✅ תוקן | viewport ללא הגבלת zoom + focus management במודל |
| 022 | 🟡 Med | ✅ תוקן | `defer` על 4 סקריפטי ה-CDN |
| 007 | 🔵 Low | ✅ תוקן | `.catch()` עם הודעה |
| 008 | 🔵 Low | ✅ תוקן | `safeTypeClass` הוסר; `typeKey` מ-whitelist |
| 009 | 🔵 Low | ✅ תוקן | `editStrain()` + מצב עריכה + `updatedAt` |
| 015 | 🔵 Low | ✅ תוקן | `substr` הוסר מהקוד |
| 017 | 🔵 Low | ✅ תוקן | clamp אחיד 0–5 בכל הרינדורים |
| 020 | 🔵 Low | ✅ תוקן | polling הוסר (storage+focus) |
| 021 | 🔵 Low | ✅ תוקן | try/catch סביב כתיבות localStorage |
| 023 | ⚪ Info | ⏳ נותר | SAMPLE_DATA עדיין נזרע בהיעדר נתונים — החלטה מודעת (P4) |
| 019 | ⚪ Info | ⏳ נותר | אין favicon — קוסמטי |
| 001 | 🔴 Crit | ⏳ **פתוח** | קוד מוכן; נדרשת החלת rules + Anonymous ב-Console (לא ניתן לביצוע מהקוד) |
| 013 | 🟠 High | ⏳ פתוח | ייסגר עם 001 |

## ממצא חדש שתוקן ב-Execution (לא היה ברשימה המקורית)
**FINDING-024 (חדש, תוקן):** `updatedAt: undefined` ב-`sanitizeCloudData` היה גורם ל-Firebase `set()` להיכשל ("contains undefined") בכל סנכרון של פריט ללא updatedAt. תוקן: השדה נכתב רק כשקיים בפועל.

## Root Cause Analysis (§47) — לבאגים Critical/High (מקורי)
- **FINDING-002:** Symptom: כל הטאבים נראים → Immediate: אין CSS מסתיר → Root: בלוק CSS אבד/לא הועלה בגרסה ("Add files via upload") → Systemic: אין תהליך בדיקה לפני העלאה (אין tests/build/review).
- **FINDING-003:** Symptom: נתונים נעלמים/מופיעים → Immediate: set() מלא + once() → Root: עיצוב sync חד-כיווני ללא push-keys/listeners → Systemic: אין הגדרת SLO לסנכרון מרובה-מכשירים.
- **FINDING-016:** Symptom: הזרקת HTML → Immediate: שדה אחד חסר escape → Root: הרכבת HTML ב-template strings ללא הליך אחיד → Systemic: אין CSP ואין ספריית רינדור.

---

## (הרישום המקורי 2026-09-24 — נשמר לראיות)

## 🟠 High (מקורי)
| ID | באג | מקום | השפעה בפועל |
|---|---|---|---|
| FINDING-002 | חסרים כללי CSS ל-`.tab-content`/`.active` | בלוק style 14–320 | כל 4 המסכים מוצגים במקביל — הניווט לא מתפקד ויזואלית (VERIFIED סטטית) |
| FINDING-003 | סנכרון last-write-wins על המערך השלם, ללא listeners | `saveData()` 756, `loadData()` 804 | אובדן נתונים שקט בשימוש מרובה-מכשירים |
| FINDING-016 | XSS: `getTypeHebrew(s.type)` ללא escapeHtml בחיפוש | `performSearch()` 1077 | סקריפט מרחוק/מיבוא רץ בדפדפן הקורבן |

## 🟡 Medium (מקורי)
| ID | באג | מקום |
|---|---|---|
| FINDING-004 | אמון מוחלט בנתוני ענן (ללא validation פריטים) | `loadData()` 814 |
| FINDING-005 | כתיבת `connection_test` לכל טעינה | `testFirebaseConnection()` 731 |
| FINDING-006 | `new Chart()` ללא guard — קריסה אם CDN נחסם | `renderStats()` 1117 |
| FINDING-010 | dark mode לא נשמר; צבעי Chart.js לא תואמי dark | `toggleDarkMode` 1195, 1134–1141 |
| FINDING-011 | מחיקה גורפת מדרסת גם בענן ללא גיבוי | `clearAllData()` 1216 |
| FINDING-012 | userKey חלש (Date.now+Math.random) | `initializeFirebase()` 710 |
| FINDING-018 | חסימת zoom — כשל WCAG 1.4.4 | viewport meta שורה 5 |
| FINDING-022 | סקריפטי CDN חוסמי-רינדור ללא defer | שורות 10–12 |

## 🔵 Low (מקורי)
FINDING-007 (`copyLink` ללא catch) · FINDING-008 (קוד מת `safeTypeClass`; class רגיש-רישיות) · FINDING-009 (אין עריכת זן) · FINDING-015 (`substr` deprecated) · FINDING-017 (`'⭐'.repeat` ללא clamp → RangeError) · FINDING-020 (polling מיותר) · FINDING-021 (localStorage חריג תוקע את הזרימה)

## ⚪ Info (מקורי)
FINDING-014 (README stub — מטופל) · FINDING-019 (favicon/meta) · FINDING-023 (זריעת SAMPLE_DATA אוטומטית)

## Root Cause Analysis (§47) — לבאגים Critical/High
- **FINDING-002:** Symptom: כל הטאבים נראים → Immediate: אין CSS מסתיר → Root: בלוק CSS אבד/לא הועלה בגרסה ("Add files via upload") → Systemic: אין תהליך בדיקה לפני העלאה (אין tests/build/review).
- **FINDING-003:** Symptom: נתונים נעלמים/מופיעים → Immediate: set() מלא + once() → Root: עיצוב sync חד-כיווני ללא push-keys/listeners → Systemic: אין הגדרת SLO לסנכרון מרובה-מכשירים.
- **FINDING-016:** Symptom: הזרקת HTML → Immediate: שדה אחד חסר escape → Root: הרכבת HTML ב-template strings ללא הליך אחיד → Systemic: אין CSP ואין ספריית רינדור.

</div>
