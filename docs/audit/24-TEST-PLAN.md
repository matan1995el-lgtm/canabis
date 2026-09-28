<div dir="rtl">

# 24 — MASTER TEST PLAN

לכל בדיקה: `TEST-ID → Scope → Method → Expected → Failure Meaning → Required After Tasks`. סטטוסים בפועל של מה שהורץ כבר — ב-[TEST-RESULTS.md](_state/TEST-RESULTS.md) וב-[14-TESTING-QA.md](14-TESTING-QA.md).

## שערים סטטיים (זולים, חובה בכל שינוי)
| ID | Scope | Method | Expected | Failure Meaning | Required After |
|---|---|---|---|---|---|
| ST-01 | תחביר JS | חילוץ inline script + `node --check` | אפס שגיאות | העמוד לא ירוץ כלל | כל TASK שנוגע ב-JS |
| ST-02 | CSS classes תואמי JS | grep: לכל class שה-JS מחליף קיים כלל CSS | קיים `.tab-content`+`.active` | ניווט שבור (מונע 002) | TASK-003 |
| ST-03 | escapeHtml בכל הרינדורים | grep על innerHTML assignments | אפס שדות לא-מסוננים | פתח XSS (016) | TASK-006 |
| ST-04 | נעילת גרסאות CDN | בדיקת URLs | גרסאות מדויקות | חוסר יציבות | TASK-011 |

## אבטחה
| ID | Scope | Method | Expected | Failure Meaning | Required After |
|---|---|---|---|---|---|
| SEC-01 | קריאה אנונימית ל-RTDB | `curl GET …/.json` | 401/403 (כיום: 200 🔴) | DB חשוף — חוסם פרסום | TASK-002, TASK-017 |
| SEC-02 | כתיבה אנונימית | PUT ל-path זבל (רק אחרי 002/בסביבת בדיקה) | 401/403 | כתיבה פתוחה (013) | TASK-002 |
| SEC-03 | XSS וקטור | יבוא JSON עם type זדוני + חיפוש | אין ריצת סקריפט | XSS חי | TASK-006 |
| SEC-04 | חציית משתמשים | uid A קורא ל-path של uid B | permission denied | rules פגומים | TASK-002 |

## Auth/Authorization/DB
| ID | Scope | Method | Expected | Failure Meaning | Required After |
|---|---|---|---|---|---|
| DB-01 | אנונימי-Auth עובד | טעינת עמוד חדשה | signInAnonymously מצליח, uid נוצר | זרימת auth שבורה | TASK-002 |
| DB-02 | נתונים פר-משתמש | כתיבה+קריאה ב-path של עצמו | עובד | זרימת ליבה שבורה | TASK-002, 005 |
| DB-03 | ולידציית ענן | הזרקת פריט פגום לענן → טעינה | פריט מדולג, לא קריסה | אמון עיוור (004) | TASK-005 |
| DB-04 | connection_test לא נוצר | טעינה ×2 | ה-node לא מתעדכן | 005 לא טופל | TASK-008 |

## API/E2E זרימות ליבה (דפדפן)
| ID | Scope | Method | Expected | Failure Meaning | Required After |
|---|---|---|---|---|---|
| E2E-01 | FLOW-001 הוספת זן | ידני/Playwright | הזן מופיע ונשמר לאחר רענון | CRUD שבור | כל TASK ב-JS |
| E2E-02 | FLOW-003 מחיקת זן | כנ"ל | נעלם ונשאר נעלם | CRUD שבור | כנ"ל |
| E2E-03 | FLOW-004 יבוא JSON | קובץ לדוגמה | ייבוא מסונן/מדולג נכון | גיבוי/שחזור שבור | TASK-006 |
| E2E-04 | FLOW-005 ייצוא | כנ"ל | קובץ JSON תקין | גיבוי שבור | — |
| E2E-05 | FLOW-008 חיפוש | כנ"ל | תוצאות נכונות, לא קורס על קלט קצה | 016/017 | TASK-006 |
| E2E-06 | מרובה מכשירים | 2 דפדפנים | שינוי ב-A נראה ב-B; אין דריסה | 003 לא טופל | TASK-005 |

## UI / RTL / Responsive / Accessibility
| ID | Scope | Method | Expected | Failure Meaning | Required After |
|---|---|---|---|---|---|
| UI-01 | מעבר טאבים | דפדפן | מסך אחד גלוי | 002 | TASK-003 |
| UI-02 | dark mode נשמר | refresh | המצב נשמר | 010 | TASK-014 |
| RTL-01 | טבלה/טפסים/מודל | בדיקה חזותית RTL | יישור נכון, אין היפוכים | שבירת RTL | כל TASK של UI |
| RESP-01 | 375px / 768px / 1440px | דפדפן | אין overflow, touch targets | responsive שבור | TASK-003/009 |
| A11Y-01 | zoom מובייל | pinch | zoom פועל | 018 | TASK-009 |
| A11Y-02 | מקלדת במודל | TAB/ESC | פוקוס מנוהל, ESC סוגר | נגישות מקלדת | TASK-009 |

## Reliability / Failure / Deployment
| ID | Scope | Method | Expected | Failure Meaning | Required After |
|---|---|---|---|---|---|
| REL-01 | CDN חסום (גרף) | חסימת jsdelivr | הודעה, לא קריסה | 006 | TASK-007 |
| REL-02 | localStorage חסום | מצב פרטי | פעולות רצות עם התראה | 021 | TASK-010 |
| REL-03 | מחיקה גורפת | זרימה מלאה | קובץ גיבוי לפני המחיקה | 011 | TASK-004 |
| DEP-01 | פריסה מתועדת | לפי TASK-015 | גרסה חיה תואמת main | תהליך לא-חוזר | TASK-015 |
| SMK-01 | Smoke מלא | docs checklist | אפס כשלים | אין לפרסם | TASK-017/018 |

## שערי סיום
- **לפני TASK-017:** כל החובה (ST, SEC, DB, E2E-01…06, UI-01, REL-01…03) PASS.
- אסור לפרסם כל עוד SEC-01/02 אינם PASS.

</div>
