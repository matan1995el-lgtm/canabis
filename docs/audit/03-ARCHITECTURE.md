<div dir="rtl">

# 03 — ARCHITECTURE

> **🔄 עודכן ב-Re-audit 2026-09-25:** שתי ההחלטות הארכיטקטוניות הבעייתיות מהרישום המקורי טופלו — (1) ה-`set()` של המערך השלם קיבל שכבת הגנה (listener + מנגנון מנע-דריסה עם מיזוג לפי id); (2) הזהות עברה מ-`userKey` מקומי ל-`authUid` מ-Firebase Anonymous Auth (עם מיגרציה אוטומטית). ולידציית קריאה מהענן ממומשת (`sanitizeCloudData`). **ה-rules בפועל עדיין פתוחים** עד ההחלה ב-Console. הרישום המקורי נשמר מתחת.

## סגנון ארכיטקטוני
**Single-File SPA, Client-Only, Offline-First with Optional Cloud Sync.**
כל שכבות ה-MVC (presentation, state, persistence) מוטמעות בקובץ אחד. אין שרת יישומי; השרת היחיד הוא Firebase RTDB כ-persistence חיצוני.

## שכבות (כפי שהן בפועל)
```
┌── Presentation ──┐  DOM סטטי + innerHTML דינמי; inline handlers (onclick)
├── Application ───┤  פונקציות גלובליות: switchTab, renderStrains, performSearch…
├── State ─────────┤  let strains, currentPharmacies, db, authUid (+userKey למיגרציה), editingId,
│                    lastCloudStrains/expectCloudShrink (מנגנון מנע-דריסה), canabisDark
├── Persistence ───┤  localStorage (primary) + Firebase RTDB (mirror ב-set מלא + listener)
└── Integration ───┤  תוסף דפדפן (localStorage bridge), CDN (Chart.js/Firebase/Fonts)
```

## החלטות ארכיטקטוניות נצפות
| החלטה | באה לידי ביטוי | הערכה |
|---|---|---|
| קובץ יחיד, אפס build | מבנה המאגר | ✅ מתאים להיקף; מגביל צמיחה |
| localStorage כ-primary, ענן כ-mirror | `saveData()` | ✅ offline-first טוב |
| `set()` של מערך שלם במקום פריטים | `db.ref(...).set(strains)` | 🟠 יוצר את בעיית last-write-wins (FINDING-003) |
| compat SDK דרך CDN (לא modules) | שורות 11–12 | פשוט אך כבד (~205KB כל הסקריפטים) |
| inline `onclick` handlers | כל ה-UI | פשוט; מקשה על CSP עתידי |
| userKey מקומי ללא auth | `initializeFirebase()` | 🔴 הגורם המאפשר ל-DB הפתוח (FINDING-001) |

## זרימת אמת (source of truth) — מעודכן
המערך `strains` בזיכרון הוא המקור בזמן ריצה; localStorage מתעדכן בכל `saveData()`; הענן מתעדכן אם `db && authUid` — **עם מנגנון מנע-דריסה**: אם הרשימה המקומית קטנה מה-snapshot הענן האחרון בלי מחיקה מכוונת (`expectCloudShrink`), מוצע מיזוג לפי id לפני ה-`set()`. **בקריאה**, ה-listener החי ו-`loadData()` מעבירים את הענן דרך `sanitizeCloudData` (פריט פגום = דילוג) לפני שהוא גובר על המקומי.

## גבולות אמינות (מעודכן)
- אין טרנזקציות; יש ולידציית קריאה מהענן (004 תוקן); conflict resolution = מנגנון מנע-דריסה + מיזוג לפי id (מינימלי אך קיים).
- אין CSP, אין SRI על סקריפטי CDN.
- ה-rules בפועל עדיין פתוחים — אכיפה אמיתית רק לאחר ההחלה ב-Console (חסם יחיד).

## המלצה ארכיטקטונית (§49 — Repair→Stabilize→Simplify→Refactor)
**לא נדרש rewrite.** סדר הנכון: לייצב (rules+auth, listeners) → לפשט (הסרת connection_test, polling) → רק אז, אם ההיקף צומח, מיזוג מדורג למודולים (Vite) — כ-TASK אופציונלי בלבד.

</div>
