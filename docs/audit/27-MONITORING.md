<div dir="rtl">

# 27 — MONITORING (TASK-016)

> **🔄 נוצר 2026-09-25** בהשלמת TASK-016 מתוכנית העבודה (23-ACTION-PLAN).
> המערכת client-only עם Firebase RTDB כ-backend יחיד; הניטור משקף את ההיקף — פרופורציונלי לאפליקציה אישית.

## מצב נוכחי — מה כבר קיים בקוד

| חיווי | מימוש | היכן |
|---|---|---|
| מצב סנכרון למשתמש | `updateSyncStatus('synced'/'syncing'/'offline', …)` | COMP-011 SyncStatus |
| איתור חיבור רשת | listener על `.info/connected` | COMP-005 Firebase |
| שגיאות סנכרון | catch ב-`saveData()` → סטטוס offline + console.error | COMP-003 DataLayer |
| שגיאות ענן | `handleFirebaseError()` + warn ב-listener | COMP-005 |

זהו **חיווי למשתמש** — לא ניטור מרוחק. מטה ההמלצות לטווחים.

## רמה 1 — מינימום מומלץ (עלות אפס, Firebase בלבד)

1. **Firebase Console → Realtime Database → Usage** — בדיקה ידנית שבועית של חיבורים ו-bandwidth (לא צפויים עומסים בשימוש אישי; קפיצה = אינדיקציה לחוסר rules או שימוש זר).
2. **Authentication → Users** — לראות כמה anonymous users קיימים; מספר שגדל מהר = משהו פונה ללא הרשאה.
3. **Export JSON שבועי** כגיבוי מונע (משלים את הגיבוי האוטומטי לפני מחיקה גורפת).

## רמה 2 — התראות (כאשר המערכת בשימוש יומיומי)

| כלי | מה מנטר | עלות |
|---|---|---|
| **UptimeRobot / Better Stack** — על כתובת ה-app | זמינות ה-URL הסטטי (hosting נפל) | חינם |
| **כתובת RTDB REST** (`…/.json?shallow=true`) | קיום/סגירת ה-rules — 200 פתוח מדי, 401 תקין | חינם |
| **Dead-man's snitch ידני** | תזכורת ל-export גיבוי שבועי | חינם |

> בדיקת 401 על ה-RTDB REST היא גם **האימות של TEST-R08** — להריץ אחרי החלת ה-rules.

## רמה 3 — אם יום אחד יהיה משתמש נוסף (לא בהיקף הנוכחי)

- Firebase Crashlytics / Sentry (דורש SDK נוסף — הימנע כל עוד אין צורך).
- CI שמריץ `check.sh` על כל push (GitHub Actions — קובץ יחיד, ~15 שורות YAML).
- Log event בקוד במקום `console.warn` בלבד.

## החלטה מתועדת
לא מוסיפים כלים כרגע — הרמה 1 ניתנת לביצוע ידני ואפס תחזוקה. הרמה 2 מפורטת כדי שהצעד יהיה מתועד כאשר יידרש. אפליקציה אישית ללא SLA לא מצדיקה pipeline ניטור.

</div>
