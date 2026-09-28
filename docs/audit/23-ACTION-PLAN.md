<div dir="rtl">

# 23 — MASTER ACTION PLAN

**מסמך ביצוע.** כל TASK אטומי לפי §35. סדר הפאזות הותאם לממצאים בפועל (פאזות ללא תוכן רלוונטי — Workers/Scheduler, Docker — סומנו כלא-רלוונטיות במקום להמציא משימות).

> ## 📌 סטטוס ביצוע (עדכון 2026-09-25 — שלב Execution)
> **בוצעו בקוד (ST-01/02/03 PASS — `sh ./scripts/check.sh`):**
> - ✅ TASK-002 (חלק קוד): firebase-auth-compat נוסף ל-CDN, `signInAnonymously()`, נתיב `strains/{authUid}`, מיגרציה אוטומטית מ-`userKey` ישן. **החלק הידני ב-Console (rules + Anonymous) נותר — חסימת פרסום.**
> - ✅ TASK-003, TASK-004, TASK-005 (listeners + `sanitizeCloudData` + מנגנון מנע-דריסה עם מיזוג לפי id), TASK-006 (escape + whitelist + clamp אחיד), TASK-007, TASK-008 (חלק קוד: `.info/connected`), TASK-009 (zoom + focus management), TASK-010 (חוסן localStorage + persist מצב כהה), TASK-011, TASK-013 (עריכת זן — `editStrain`), TASK-014 (קוד מת/substr/polling/copyLink), TASK-012 (scripts/check.sh + SMOKE-CHECKLIST — היה קיים, עודכן).
> - ✅ תיקון באג נוסף: `updatedAt: undefined` היה מפיל `set()` של Firebase — כעת נכתב רק כשקיים.
> **נותרו:** TASK-001 + החלק הידני של TASK-002 (Firebase Console — הנחיות מפורטות ב-README → Firebase), TASK-015 (תיעוד deploy), TASK-016 (ניטור P4), TASK-017/018 (רגרסיה + הכרזה — לאחר אימות דפדפן וסגירת rules).

## Phase 0 — Safety / Backup / Baseline
### TASK-001 — קו בסיס: גיבוי וניקוי נתונים חשופים
- **Priority:** P0 · **למה עכשיו:** לפני כל שינוי rules חייב גיבוי; ה-DB כרגע קריא לכולם.
- **Prerequisites:** גישת בעלים ל-Firebase Console · **Depends On:** — · **Blocks:** TASK-002
- **Files:** — (פעולות Console + מכונה מקומית) · **Components:** COMP-005
- **לפני הביצוע:** לוודא גישה לפרויקט `panda-canabis` ב-Console.
- **הוראות ביצוע:**
  1. ב-Firebase Console → Realtime Database → Export JSON (גיבוי מלא).
  2. לשמור את ה-export במקום בטוח מחוץ למאגר.
  3. לתעד את תוכן ה-rules הנוכחיים (צילום מסך/העתקה) לצורך rollback.
- **השלכות:** נקודת שחזור לכל המשך העבודה · **סיכונים:** אין · **Breaking:** לא
- **Rollback:** לא רלוונטי (קריאה בלבד)
- **בדיקות:** ה-export נפתח כ-JSON תקין ומכיל את `strains/*`
- **Acceptance Criteria:** [ ] קובץ גיבוי קיים ומאומת [ ] rules קודמים מתועדים
- **DoD:** [ ] שני הסעיפים לעיל הושלמו

## Phase 1 — Critical
### TASK-002 — סגירת Firebase Rules + אימוץ Firebase Auth אנונימי
- **Priority:** P0 · **בעיה:** FINDING-001 (VERIFIED) + 013 · **מטרה:** אף גורם אנונימי לא יקרא/יכתוב · **למה עכשיו:** חשיפת מידע רפואי מתמשכת
- **Prerequisites:** TASK-001 · **Depends On:** TASK-001 · **Blocks:** TASK-005, TASK-008
- **Files:** `index.html` (חלק Firebase), Firebase Console rules · **Components:** COMP-005, COMP-003
- **לפני הביצוע:** לוודא שהמשתמשים הקיימים מזוהים (גיבוי TASK-001 מכיל את ה-userKeys).
- **הוראות ביצוע:**
  1. Console → Authentication → Sign-in method → להפעיל **Anonymous**.
  2. Rules חדשים:
     ```json
     {
       "rules": {
         ".read": false,
         ".write": false,
         "strains": {
           "$uid": {
             ".read": "auth != null && auth.uid === $uid",
             ".write": "auth != null && auth.uid === $uid"
           }
         }
       }
     }
     ```
  3. בקוד: ב-`initializeFirebase()` לבצע `firebase.auth().signInAnonymously()` ולהמתין ל-user; להשתמש ב-`auth.currentUser.uid` כמפתח ה-path (להעביר את הנתונים ההיסטוריים של userKey הישן ל-uid החדש מתוך גיבוי TASK-001).
  4. להסיר כתיבת `connection_test` (מזוהה גם ב-TASK-008).
- **השלכות:** כל לקוח חייב auth; נתונים ישנים דורשים migration חד-פעמי · **סיכונים:** שכחת migration = משתמשים "מאבדים" נתונים ישנים (קיימים בגיבוי)
- **Breaking Changes:** כן (API משטח) · **Rollback:** שחזור rules מתיעוד TASK-001
- **בדיקות:** GET/PUT אנונימיים מחזירים 401/403; משתמש מאומת קורא וכותב רק את ה-path שלו
- **Acceptance:** [ ] GET `/.json` אנונימי נכשל [ ] כתיבה חוצת-משתמש נכשלת [ ] האפליקציה עובדת מקצה לקצה
- **DoD:** [ ] כל ה-Acceptance [ ] migration בוצע למשתמש הקיים הידוע

## Phase 2 — Broken Communication
### TASK-003 — תיקון ניווט הטאבים (CSS)
- **Priority:** P1 · **בעיה:** FINDING-002 · **Depends On:** — · **Blocks:** —
- **Files:** `index.html` (בלוק style) · **Components:** COMP-001/002
- **הוראות:** להוסיף לבלוק ה-CSS: `.tab-content{display:none}` `.tab-content.active{display:block}`
- **סיכונים:** אפס · **Breaking:** לא · **Rollback:** הסרת שתי השורות
- **בדיקות:** מעבר טאבים בדפדפן — מסך אחד בלבד גלוי בכל רגע
- **Acceptance:** [ ] כל 4 הטאבים מתחלפים נכון [ ] אין שינוי ביתר הפריסה
- **DoD:** [ ] ה-Acceptance

## Phase 3 — Security
### TASK-006 — סגירת XSS: escape בחיפוש + whitelist לסוג
- **Priority:** P1 · **בעיה:** FINDING-016 (+017 כנספח)
- **Depends On:** — · **Blocks:** — · **Files:** `index.html` (`performSearch` 1077, `viewStrain` 1028, import normalize)
- **הוראות:**
  1. `performSearch`: `${escapeHtml(getTypeHebrew(s.type))}`.
  2. `viewStrain`/`performSearch`: `'⭐'.repeat(Math.max(0,Math.min(5,Number(s.rating)||0)))` (אחיד ל-927).
  3. ב-normalize של היבוא ובקבלת ענן: `type = ['indica','sativa','hybrid'].includes(String(type).toLowerCase()) ? String(type).toLowerCase() : 'hybrid'`.
- **סיכונים:** נמוכים · **Breaking:** לא · **Rollback:** גרסת git קודמת
- **בדיקות:** יבוא JSON עם `type:"<img src=x onerror=alert(1)>"` — מוצג כהייבריד, ללא ריצת סקריפט; חיפוש עם rating=1e9 לא קורס
- **Acceptance:** [ ] וקטור ה-XSS מנוטרל [ ] clamp אחיד לדירוג בכל שלושת המקומות
- **DoD:** [ ] ה-Acceptance

## Phase 4 — Stability
### TASK-005 — סנכרון אמין: listeners + ולידציית ענן
- **Priority:** P1 · **בעיה:** FINDING-003 + 004
- **Depends On:** TASK-002 · **Blocks:** — · **Files:** `index.html` (saveData/loadData)
- **הוראות (גרסה מינימלית-בטוחה):**
  1. ב-`initializeFirebase` להחליף את `.once('value')` ב-`db.ref('strains/'+uid).on('value', …)` עם אותה ולידציה.
  2. ולידציה לכל פריט מהענן (name/type מחרוזות לא-ריקות, מספרים) — לדלג על פריטים פגומים.
  3. מנגנון מנע-דריסה: לפני `set()`, אם הרשימה המקומית קטנה מזו שנטענה מהענן — לבקש אישור (confirm) או לבצע merge לפי `id`.
- **סיכונים:** בינוניים (משנה זרימת אמת) · **Breaking:** לא למשתמש · **Rollback:** git
- **בדיקות:** שני דפדפנים — הוספה ב-A מופיעה ב-B; מחיקה ב-B לא "קמה" מ-A
- **Acceptance:** [ ] listeners פעילים [ ] ולידציה במקום אמון (004) [ ] merge לפי id ללא אובדן
- **DoD:** [ ] ה-Acceptance

### TASK-004 — גיבוי לפני מחיקה גורפת
- **Priority:** P2 · **בעיה:** FINDING-011 · **Depends On:** —
- **הוראות:** ב-`clearAllData()` לפני ה-confirm הראשון: להריץ לוגיקת `exportData()` ולהודיע "קובץ גיבוי הורד"; רק לאחר מכן שתי ההתראות.
- **בדיקות:** מחיקה גורפת מייצרת קובץ JSON מלא ואז מוחקת · **Acceptance:** [ ] תמיד קיים קובץ גיבוי לפני מחיקה

### TASK-007 — Guard ל-Chart.js
- **Priority:** P2 · **בעיה:** FINDING-006
- **הוראות:** ב-`renderStats()`: `if (typeof Chart === 'undefined') { statsContent.innerHTML += '<p class="empty-state">הגרף אינו זמין ללא חיבור לרשת</p>'; return; }`
- **Acceptance:** [ ] עם CDN חסום הטאב מציג מדדים + הודעה בלי קריסה

### TASK-010 — חוסן localStorage
- **Priority:** P2 · **בעיה:** FINDING-021
- **הוראות:** ב-`saveData()`: try/catch סביב `localStorage.setItem`; בכישלון — `showNotification('⚠️ נשמר בזיכרון בלבד')` והמשך ריצה תקין.
- **Acceptance:** [ ] במצב פרטי/quota מלא הפעולות לא נתקעות

### TASK-011 — defer לסקריפטי CDN
- **Priority:** P2 · **בעיה:** FINDING-022
- **הוראות:** להוסיף `defer` לשלושת ה-`<script src>` (10–12); לוודא ש-DOMContentLoaded עדיין עוטף את ה-init (מתאים כבר).
- **Acceptance:** [ ] האפליקציה עולה תקינה; אין ReferenceError

## Phase 5 — Architecture
**לא רלוונטי לביצוע כעת** — תוצאת ה-Audit: ללא rewrite/מעבר מסגרת (§49). עתידי בלבד (P4).

## Phase 6 — Database
### TASK-008 — ניקוי connection_test + חיווי חיבור אמיתי
- **Priority:** P2 · **בעיה:** FINDING-005
- **Depends On:** TASK-002 · **הוראות:** להחליף את ה-test-write בהאזנה ל-`db.ref('.info/connected')`; למחוק את ה-node מה-Console; להסיר את ה-message מה-config בקוד.
- **Acceptance:** [ ] ה-node נמחק ואינו נוצר מחדש [ ] החיווי מגיב לניתוק רשת

## Phase 7 — API
**לא רלוונטי כפאזה עצמאית** — משטח ה-API הוא ה-rules; מטופל ב-TASK-002/005/008.

## Phase 8 — Bugs (Low)
### TASK-014 — ניקוי Low: קוד מת, substr, polling, צבעים ו-dark mode
- **Priority:** P3 · **בעיות:** 007, 008, 010, 015, 020, 012
- **הוראות:** `copyLink().catch(…)`; להסיר `safeTypeClass` ולהשתמש ב-`toLowerCase()` ב-class; לשמור dark ב-localStorage ולהחיל בטעינה; צבעי Chart מ-`getComputedStyle` (ערכים פתורים) במקום `var(...)`; `substr`→`slice`; להסיר את ה-polling (storage event+focus מספיקים); userKey→`crypto.randomUUID()` כש-auth פעיל (uid מחליף בפועל).
- **Acceptance:** [ ] כל שבעת הסעיפים טופלו [ ] smoke בדפדפן עובר

## Phase 9 — Testing
### TASK-012 — שער איכות מינימלי: node --check + smoke checklist
- **Priority:** P3 · **Depends On:** TASK-003
- **הוראות:** ליצור `scripts/check.sh` (`node --check` על ה-JS המחולץ) + `docs/testing/SMOKE-CHECKLIST.md` מהסעיפים ב-24-TEST-PLAN; לתעד ב-README.
- **Acceptance:** [ ] הסקריפט רץ ומצליח [ ] הצ'קליסט קיים

## Phase 10 — UX/RTL
### TASK-013 — עריכת זן קיים
- **Priority:** P3 · **בעיה:** FINDING-009
- **הוראות:** כפתור ✏️ בטבלה → מילוי המודל מהרשומה → submit מעדכן לפי `id` (במקום push) עם `updatedAt`.
- **Acceptance:** [ ] עריכה שומרת את כל השדות [ ] createdAt נשמר, updatedAt מתעדכן

### TASK-009 — נגישות: zoom + focus trap
- **Priority:** P2 · **בעיה:** FINDING-018 (+ focus מטא-רמה)
- **הוראות:** viewport מבלי `maximum-scale/user-scalable`; focus ראשוני לשדה הראשון בפתיחת מודל והחזרה בסגירה.
- **Acceptance:** [ ] zoom פועל במובייל [ ] המודל מנהל פוקוס

## Phase 11 — Performance
**מכוסה** ע"י TASK-011 (defer) — אין פעולות נוספות מוצדקות כעת (15-PERFORMANCE).

## Phase 12 — DevOps
### TASK-015 — תהליך פריסה מתועד
- **Priority:** P3 · **הוראות:** לבחור static host (מומלץ GitHub Pages), לתעד ב-README שלבי deploy ו-rollback; לא לפרסם לפני TASK-002.
- **Acceptance:** [ ] התיעוד קיים [ ] deploy ראשון לאחר 002 מאומת

## Phase 13 — Monitoring
### TASK-016 — ניטור בסיסי
- **Priority:** P4 · **הוראות:** הפעלת Firebase usage alerts; window.onerror ל-console מסודר. מלא רק אם המוצר גדל.

## Phase 14 — Documentation
**בוצע במסגרת ה-Audit** (README/ID/CLAUDE/audit). TASK-015 מוסיף פריסה; חסר בעלים: תיעוד תוסף (OPEN-Q1).

## Phase 15 — Improvements
ראה 21-FEATURE-OPPORTUNITIES (P3/P4, לפי בחירת הבעלים).

## Phase 16 — Final Regression
### TASK-017 — רגרסיה מלאה לפני הכרזה
- **Priority:** P1 (חסימת סיום) · **Depends On:** TASK-002,003,004,005,006,007,008,009,010,011,012
- **הוראות:** להריץ את כל 24-TEST-PLAN החלים (כולל smoke דפדפן + אימות 401/403).
- **Acceptance:** [ ] אפס FAIL בבדיקות החובה

## Phase 17 — Production Readiness
### TASK-018 — הכרזת כוננות
- **Priority:** P1 · **Depends On:** TASK-017
- **הוראות:** לעדכן את 22-PRODUCTION-READINESS בהתאם לתוצאות; לפרסם רק אחרי שכל התחומים ≥ Partial ואין Not Ready על Security/DB.

---

## Execution Graph (§36)
```
TASK-001 → TASK-002 ─┬─→ TASK-005 ─┐
                     ├─→ TASK-008 ─┤
TASK-003 ─┬─→ TASK-012├─(parallel)─┤
TASK-006 ─┘          └─→ TASK-004 ─┤
TASK-007, TASK-009, TASK-010, TASK-011 ─┴─→ TASK-014 ─→ TASK-017 → TASK-018
(TASK-013, TASK-015, TASK-016 — אופציונליים, במקביל לאחר 002; אינם חוסמים)
```

## Change Risk Matrix (§37)
| Task | Impact | Risk | Complexity | Breaking | Rollback | Priority |
|---|---|---|---|---|---|---|
| TASK-001 | גבוה (מאפשר) | אפס | נמוך | לא | — | P0 |
| TASK-002 | גבוה | בינוני | בינוני | **כן** | בינוני (rules תיעוד) | P0 |
| TASK-003 | גבוה (UX) | אפס | נמוך | לא | קל | P1 |
| TASK-005 | גבוה | בינוני | בינוני | לא | בינוני | P1 |
| TASK-006 | בינוני | נמוך | נמוך | לא | קל | P1 |
| TASK-004/007/009/010/011 | נמוך-בינוני | נמוך | נמוך | לא | קל | P2 |
| TASK-008 | נמוך | נמוך | נמוך | לא | קל | P2 |
| TASK-012/014/015 | נמוך | נמוך | נמוך | לא | קל | P3 |
| TASK-013 | בינוני | נמוך | בינוני | לא | קל | P3 |
| TASK-016 | נמוך | נמוך | נמוך | לא | קל | P4 |
| TASK-017/018 | גבוה (שער) | אפס | נמוך | לא | — | P1 |

</div>
