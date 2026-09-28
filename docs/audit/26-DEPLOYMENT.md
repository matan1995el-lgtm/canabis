<div dir="rtl">

# 26 — DEPLOYMENT (TASK-015)

> **🔄 נוצר 2026-09-25** בהשלמת TASK-015 מתוכנית העבודה (23-ACTION-PLAN).

## תהליך הפריסה הנוכחי

**המערכת היא קובץ סטטי יחיד (`index.html`) — אין build.** עלות הפריסה היא "העלה ועבור".

### אפשרויות פריסה

| יעד | הוראות | יתרונות | חסרונות | מומלץ ל- |
|---|---|---|---| **—** |
| **Freebuff Hosting (מומלץ כאן)** | Deploy button → hosting מנהל static serving. `freebuff-deploy check` לפני ראשונה | פריסה בלחיצה, preview לפני, status/logs | תלות בפלטפורמה | השימוש היומיומי של הבעלים |
| **GitHub Pages** | Settings → Pages → Deploy from branch → `main` / root | חינם, גיבוי git, URL יציב | ציבורי בפועל (קישור מפורסם); אין access control | גישה גם מטלפון |
| **העלאה ידנית** | "Add files via upload" ב-GitHub (המצב הקודם) | פשוט | ללא history לצורך rollback, שכחה קלה | מעבר בלבד |

> ⚠️ **הערה:** מאחר שזו אפליקציה אישית, "פרסום" כאן = קישור אישי. ההגנה על הנתונים מגיעה מה-Firebase rules (לא מה-hosting), ולכן **FINDING-001 (החלת rules ב-Console) חוסם את הפריסה** — קישור ציבורי לפני סגירת ה-rules מגדיל את משטח החשיפה.

### Freebuff Hosting — פרוטוקול פריסה
1. `sh ./scripts/check.sh` — השער חייב לעבור (ST-01/02/03/04) לפני כל deploy.
2. Freebuff → **Deploy button** (הראשונה — חובה מה-UI).
3. `freebuff-deploy check` — לאמת שהפקודות שה-hosting יריץ תקינות (install/build = `true` — אין צורך באמת).
4. `freebuff-deploy start` — פריסה חוזרת אחרי שינויים.
5. `freebuff-deploy status` / `logs` — לאמת state ו-build time.

### GitHub Pages — פרוטוקול פריסה
1. דרישה מוקדמת: **FINDING-001 סגור** (rules + Anonymous auth הוחלו ב-Console).
2. Settings → Pages → Source: `Deploy from a branch` → `main` → `/ (root)` → Save.
3. לאחר דקה–שתיים: `https://<user>.github.io/<repo>/`.
4. כל commit ל-main נפרס אוטומטית; לאמת ב-Actions tab.

### Rollback (לכל יעד)

| סיטואציה | פעולה |
|---|---|
| גרסה קודית שגויה נפרסה | `git revert <commit>` → push → הפריסה הבאה משחזרת |
| rules שגויים הוחלו | Firebase Console → Rules → להחזיר את ה-JSON מתועד ב-README (צילום המסך מ-TASK-001) |
| נתונים פגומים בענן | ייצוא JSON מ-Console + תיקון מקומי + `forceSyncNow` (מנגנון מנע-דריסה מתריע) |

## מה נדרש לפני פריסה ציבורית
1. 🔴 **FINDING-001** — החלת rules + Anonymous auth ב-Console (ראה README → Firebase).
2. Smoke מלא בדפדפן לפי `docs/testing/SMOKE-CHECKLIST.md`.
3. בדיקות 401/403 (TEST-R08) — לאמת שה-rules אוכפים בפועל.

## תחזוקה
- עדכון גרסאות CDN: לשנות את ה-URL בקוד + ST-04 (check-smoke.js) מאמת גרסאות מדויקות.
- שינוי פרויקט Firebase: עריכת `firebaseConfig` ב-`index.html` (ST-02/03 לא נוגעים; smoke בדפדפן חובה).

</div>
