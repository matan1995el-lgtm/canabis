<div dir="rtl">

# חוזה ה-bridge לתוסף הדפדפן (OPEN-Q1 — נסגר מבחינת הצד המקבל)

> מתעד את ההסכם בין התוסף החיצוני לאפליקציה. **שם המפתח `importedStrainData` הוא חוזה קבוע — אין להזיז** (COMP-006).

## מבט מהתוסף (הצד הכותב)

התוסף כותב ל-localStorage של הדף:
```js
localStorage.setItem('importedStrainData', JSON.stringify({
  name:  "שם הזן",          // חובה מבחינה פונקציונלית — בלעדיו הדף מתעלם
  type:  "indica|sativa|hybrid",
  thc:   20,                 // אופציונלי; מזהה גם עוצמה אוטומטית לפי THC
  cbd:   1,
  terpenes: "myrcene, limonene",
  effects:  "מרגיע, מרדים",
  potency:  "גבוהה",
  price:   45,
  country: "ישראל",
  importer: "…",
  rating:  4,
  notes:   "…"
}));
```
לאחר הכתיבה: אם הדף פתוח — הוא קורא בעת חזרת focus; אם לא — בטעינה הבאה.

## מבט מהאפליקציה (הצד הקורא)

| רכיב | התנהגות |
|---|---|
| `checkForImportedData(showMessage=false)` | נקרא בטעינה ובכל חזרת focus לחלון. מוצא מפתח → `confirm()` למשתמש → מילוי טופס ופתיחת המודל → **המפתח נמחק תמיד** (גם אם המשתמש מבטל) |
| `fillAddFormWithData(strain)` | מציב ערכים לפי 12 שדות; **auto-potency** לפי THC (<10 נמוכה, <18 בינונית, <22 מאוזנת, אחרת גבוהה) כאשר potency חסר |
| `handleImportedStrainData(data)` | נתיב חלופי לקבלת מחרוזת JSON מוכנה (אותו confirm + מחיקה) |
| ולידציה | הטופס מאמת בהוספה; `type` לא נמצא ב-whitelist ייפול בהוספה, לא בקבלה |

## התחייבויות דו-צדדיות
- **הדף מחייב:** מפתח `importedStrainData` · JSON של אובייקט זן אחד · `name` קיים.
- **התוסף מחייב:** JSON parse-able; לא לכתוב מפתחות אחרים ב-localStorage של הדף; לא להסתמך על ניקוי עצמי של המפתח מעבר להתנהגות המתועדת.
- **טוקנים שאסור לשנות:** `importedStrainData`, אובייקט בודד (לא מערך).

## מה נותר פתוח
קוד התוסף עצמו מחוץ למאגר — החוזה מהצד המקבל תועד במלואו; אימות E2E עם התוסף האמיתי נותר פתוח לבעלים.

</div>
