<div dir="rtl">

# 09 — DATABASE

**מסד:** Firebase Realtime Database (compat SDK 10.7.1), region `europe-west1`, פרויקט `panda-canabis`.

## מיפוי המבנה (כפי שנצפה בקריאת האימות — VERIFIED)
```
/                                  (root)
├── connection_test/               { timestamp: ISO, message: string }   ← נכתב בכל טעינה (005)
└── strains/
    └── {userKey}/                 מערך רשומות strain לכל משתמש-מקומי
        └── [ {id,name,type,potency,price,dosage,thc,cbd,country,
               importer,terpenes,effects,rating,pharmacies[],notes,createdAt} ]
```
- **קיים בפועל:** `strains/user_1763501529060_ac2szngw1` עם רשומות אמיתיות (נצפה ב-TEST-003).
- **PK:** `id` לוגי בתוך הרשומה (לא enforced) · **FK:** אין · **indexes/constraints/RLS/triggers/views:** אין (RTDB אינו רלציוני).

## Rules (מצב נצפה)
🔴 קריאה אנונימית פתוחה (VERIFIED, 001) · 🟠 כתיבה אנונימית כנראה פתוחה (013, HIGH CONFIDENCE). אין גישה ל-console מהמאגר — ה-rules עצמם לא נקראו; ההתנהגות אומתה.

## Migration / Schema enforcement
**אין migrations ואין enforcement** — הסכם ה-schema הוא implicit בקוד ה-UI. נגזרות:
- FINDING-004: נתוני ענן נטענים ללא validation פריטים.
- FINDING-017: rating לא-מוגבל חודר עד קריסה.
- עתיד: כל שינוי שדה דורש עדכון import/normalize ב-3 מקומות (add/import/cloud-load).

## אינטגריות וניקיון
| נושא | מצב |
|---|---|
| Orphan data | אין יחסים — לא רלוונטי |
| Duplicated data | המערך מוחזק ב-3 עותקים (RAM/localStorage/RTDB) — by design, אך ללא merge (003) |
| Nullable fields | שדות חסרים מטופלים ב-`|| 0` / `|| ''` בנתיבי היבוא; בנתיב הענן לא (004) |
| `connection_test` | זיהום פרודקשן שניתן למחיקה (005) |
| גיבויים | אין אוטומטיים; ייצוא ידני בלבד (FLOW-005) |

## ביצועים
- עומק נתונים קטן (רשימות אישיות) — אין חשש ביצועים בהיקף נוכחי.
- `set()` מלא בכל שמירה = עליית payload עם הקטלוג; סביר עד מאות זנים.

</div>
