<div dir="rtl">

# 10 — API

**אין REST API משל המערכת** — אין שרת יישומי ואין endpoints מוגדרים בקוד. כל התקשורת היא מול Firebase RTDB, שמציע גם REST implicit.

## אנדפוינטים בשימוש בפועל (RTDB REST — מאומת/מוסק)
| # | METHOD PATH | Source בקוד | Handler | Auth | Request | Response | Consumers | Tests |
|---|---|---|---|---|---|---|---|---|
| 1 | GET `/.json` | (אימות Audit) | RTDB | 🔴 אין — עובד אנונימית | — | JSON מלא של ה-DB | האימות הציבורי (VERIFIED) | TEST-003 |
| 2 | PUT `strains/{userKey}.json` | `saveData()` 756 דרך SDK `set()` | RTDB | 🔴 כנראה אין (013) | מערך strains מלא | — | COMP-003 | אין |
| 3 | GET `strains/{userKey}.json` | `loadData()` 804 דרך `.once('value')` | RTDB | 🔴 כנראה אין | — | מערך strains | COMP-003 | אין |
| 4 | PUT `connection_test.json` | `testFirebaseConnection()` 731 | RTDB | 🔴 כנראה אין | {timestamp,message} | — | COMP-005 | אין |

## ניתוח אינטגרציה (§12 — Communication Audit)
| בדיקה | תוצאה |
|---|---|
| URL נכון | ✅ databaseURL תואם לפרויקט ול-region (אומת בפועל — ה-GET הצליח) |
| Method/ראוטים | ✅ תקינים לשימוש ב-compat SDK |
| Payload/response mismatch | 🟡 `loadData()` מניח מערך בלבד; RTDB יכול להחזיר אובייקט (FINDING-004) |
| Dead integration | 🟡 `connection_test` — node שנכתב אך לא נקרא אף פעם בקוד (FINDING-005) |
| Feature חצי-קיימת | 🟡 "סנכרון" מוצג למשתמש אך אין listeners — התקבלות שינויים ממכשיר אחר לא ממומשת (FINDING-003) |
| Env vars | ❌ כל ה-config מוטמע בקוד; אין קובץ .env/example (פער תחזוקתי) |

## סיכום
ה-API של המערכת = משטח ה-Rules של Firebase. כרגע המשטח הזה פתוח לאנונימיים — התיקון המרכזי הוא TASK-002 ולא קוד אפליקציה.

</div>
