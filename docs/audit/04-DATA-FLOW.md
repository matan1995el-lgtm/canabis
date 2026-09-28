<div dir="rtl">

# 04 — DATA FLOW

> **🔄 עודכן ב-Re-audit 2026-09-25:** זרימות 001/002/003/006/007/009/010 שונו מהותית בשלב Execution. התיאורים למטה מעודכנים לקוד הנוכחי (מספרי שורות משוערים); הרישום המקורי מה-Audit נשמר בהיסטוריה.

## FLOW-001 — הוספה/עריכת זן (Critical Flow) — מעודכן
- **Trigger:** "פתח טופס הוספה מלא" או כפתור ✏️ בשורה → מילוי הטופס → Submit
- **Entry points:** `openAddModal()` / `editStrain(index)` (~1119) → `addStrain(event)` (~1071)
- **Steps:** `preventDefault()` → קריאת 14 שדות → בדיקת name/type → בניית אובייקט. **מצב עריכה** (`editingId != null`): עדכון in-place לפי id, שימור `id`/`createdAt`, הצבת `updatedAt`. **מצב הוספה:** `strains.push`. ואז → `saveData()` → `renderStrains()` → `closeAddModal()` (מאפס `editingId` ומחזיר פוקוס)
- **Data:** אובייקט strain + `updatedAt?` (חדש)
- **Authentication:** Firebase Anonymous (`authUid`) לענן
- **Database:** localStorage (try/catch) → Firebase `strains/{authUid}` `set(payload)` עם מנגנון מנע-דריסה
- **Failure paths:** שדה ריק → notification; localStorage quota/פרטי → הודעת אזהרה והמשך ריצה (021 תוקן); Firebase fail → חיווי offline, נתונים מקומיים
- **Findings:** 021, 009 (עריכה) — נפתרו

## FLOW-002 — טעינת נתונים בעלייה (Critical Flow) — מעודכן
- **Trigger:** DOMContentLoaded → `initializeFirebase()` → `.info/connected` listener → `signInAnonymously()`
- **Steps:** userKey נשמר למיגרציה → auth מצליח → `authUid` נקבע → `migrateLegacyDataIfNeeded()` (העברת `strains/user_...` ל-`strains/{authUid}` עם מיזוג לפי id ומחיקת הישן) → `attachCloudListener()` (on value + `sanitizeCloudData`) → `loadData()` (once לטעינה ראשונה; ענן גובר על מקומי)
- **Failure paths:** auth כבוי/נכשל → `handleFirebaseError()` עם הודעה ייעודית (`auth/operation-not-allowed`) → `loadFromLocalStorage()` → fallback ל-SAMPLE_DATA
- **Findings:** 004 (ולידציית ענן), 005 (אין כתיבת test), 012 (זהות auth) — נפתרו; 001 נותר תלוי ב-Console

## FLOW-003 — מחיקת זן — מעודכן
- **Trigger:** כפתור 🗑️ → `deleteStrain(index)` (~1143) → confirm → **`expectCloudShrink=true`** → splice → saveData → renderStrains
- **Findings:** 003 נפתר — הדגל עוקף את מנגנון המנע-דריסה רק למחיקות מכוונות; מחיקה לא-מכוונת מכשיר אחר תוצע למיזוג ולא תדרוס

## FLOW-004 — יבוא JSON
- **Trigger:** הגדרות → ייבוא → בחירת קובץ → `importData(event)` (826)
- **Steps:** FileReader → JSON.parse → בדיקת מערך → לכל פריט: normalization + **whitelist ל-type** (רק indica/sativa/hybrid — אחרת דילוג) + **clamp ל-rating (0–5)** + dedupe (name::type) → merge → saveData → renderStrains
- **Data:** קובץ JSON המכיל מערך
- **Failure paths:** JSON פגום → notification; אפס פריטים תקינים → notification; פריטים פגומים יחידים מדולגים בשקט
- **Findings:** 016, 017 — נפתרו

## FLOW-005 — ייצוא JSON
- **Trigger:** הגדרות → "💾 ייצוא JSON" → `exportData()` (895)
- **Steps:** JSON.stringify(strains) → Blob → anchor download `cannabis-backup-<ts>.json`
- **Output:** קובץ גיבוי מלא · **Failure paths:** כמעט אפס (Blob מקומי)
- **Findings:** — (זהו גם הגיבוי היחיד במערכת; רלוונטי ל-TASK-004)

## FLOW-006 — קליטת נתונים מתוסף דפדפן
- **Trigger:** תוסף חיצוני כותב `localStorage.importedStrainData`
- **Steps:** storage event או focus או כפתור ידני (ה-polling הוסר — TASK-014) → `handleImportedStrainData()` → confirm → `fillAddFormWithData()` → פתיחת מודל → מחיקת המפתח
- **Authentication:** אין (מפתח localStorage ציבורי בדף)
- **Failure paths:** JSON פגום → notification
- **Findings:** OPEN-Q1 (קיום התוסף), FINDING-016 (הנתונים מגיעים עד ה-UI ללא whitelist)

## FLOW-007 — סנכרון ענן ידני — מעודכן
- **Trigger:** "🔄 סנכרן עכשיו" → `forceSyncNow()` (~1344)
- **Steps:** בדיקת `db && authUid` → `saveData()` — כולל מנגנון מנע-דריסה: אם הרשימה המקומית קטנה מה-snapshot הענן האחרון בלי מחיקה מכוונת, מוצע מיזוג לפי id לפני ה-`set()`
- **Failure paths:** אין חיבור/auth → notification "לא זמין במצב מקומי"
- **Findings:** 003 נפתר; 001 תלוי ב-Console

## FLOW-008 — חיפוש
- **Trigger:** טאב חיפוש → `performSearch()` (1060)
- **Steps:** לוקליזציה של השאילתה → filter על name/type/terpenes/effects/notes → רינדור כרטיסי תוצאה
- **Failure paths:** שאילתה ריקה / אפס תוצאות → empty states
- **Findings:** FINDING-016 (XSS), FINDING-017 (RangeError)

## FLOW-009 — סטטיסטיקות וגרף
- **Trigger:** מעבר לטאב סטטיסטיקות → `switchTab('stats')` → setTimeout(120ms) → `renderStats()` (1086)
- **Steps:** חישוב ממוצעים → כרטיסי סטטיסטיקה → destroy גרף קודם → Chart.js bar חדש עם gradients
- **Failure paths:** CDN חסום → **guard מציג הודעה בלי קריסה** (006 תוקן); 0 זנים → ממוצעים 0; צבעי גרף נפתרים מ-`getComputedStyle` (010 תוקן, כולל re-render בשינוי מצב כהה)
- **Findings:** 006, 010 — נפתרו

## FLOW-010 — מחיקה גורפת — מעודכן
- **Trigger:** "מחק את כל הנתונים" → `clearAllData()` (~1376)
- **Steps:** **גיבוי JSON אוטומטי (`exportData()`) לפני ה-confirms** → confirm ×2 → `expectCloudShrink=true` → strains=[] → saveData → renderStrains
- **Failure paths:** המשתמש יכול לבטל; קובץ הגיבוי תמיד נוצר קודם (011 תוקן)
- **Findings:** 011 — נפתר

</div>
