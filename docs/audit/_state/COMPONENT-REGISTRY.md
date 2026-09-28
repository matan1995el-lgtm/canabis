<div dir="rtl">

# COMPONENT-REGISTRY — רישום רכיבים

המערכת היא SPA בקובץ יחיד; הרכיבים להלן הם מקטעים פונקציונליים בתוך `index.html`.

> ## 🔄 עדכון Re-audit (2026-09-25) — סטטוס רכיבים אחרי Execution
> | רכיב | שינוי מהותי | מצב |
> |---|---|---|
> | COMP-001/002 | CSS ל-`.tab-content` ממומש; מצב כהה נשמר | ✅ 002/010 נפתרו |
> | COMP-003 | listeners + `sanitizeCloudData` + מנגנון מנע-דריסה (`lastCloudStrains`/`expectCloudShrink`); נתיב `strains/{authUid}` | ✅ 003/004/012 נפתרו |
> | COMP-004 | נוסף כפתור עריכה ✏️; clamp דירוג; class מ-whitelist | ✅ 008/009 נפתרו |
> | COMP-005 | **firebase-auth-compat CDN נוסף**; `signInAnonymously()`; `migrateLegacyDataIfNeeded()`; `.info/connected`; אין `connection_test` | ✅ 005 נפתר; 001 תלוי-Console |
> | COMP-006 | polling הוסר (storage+focus בלבד) | ✅ 020 נפתר |
> | COMP-007 | guard ל-Chart; צבעים מ-`getComputedStyle`; re-render בשינוי dark | ✅ 006/010 נפתרו |
> | COMP-008 | `escapeHtml(getTypeHebrew(...))` + מספרים עם `Number()\|\|0` | ✅ 016/017 נפתרו |
> | COMP-009 | מצב עריכה (`editStrain`/`editingId`/`updatedAt`); focus management | ✅ 009/018 נפתרו |
> | COMP-010 | גיבוי אוטומטי לפני מחיקה גורפת; catch ל-copyLink; whitelist+clamp ביבוא | ✅ 007/011 נפתרו |
> | COMP-011 | חיווי תלוי-auth (`מחובר לענן` רק אחרי authUid) | ✅ 005 נפתר |
> הרישום המקורי (עם מספרי השורות שלפני ה-Execution) נשמר מתחת לראיות והקשר.

## COMP-001 — App Shell & Theme
- **Path:** `index.html` (שורות 14–320 CSS, 322–408 DOM)
- **תפקיד:** מסגרת האפליקציה: כותרת, טאבים, כרטיסים, עיצוב ירוק, dark mode באמצעות `.dark` CSS variables
- **Technology:** HTML5, CSS3 (מוטמע), Heebo font מ-Google Fonts
- **Entry point:** `<html lang="he" dir="rtl">` — RTL מלא
- **Inputs:** מצב dark בלבד בזמן ריצה (checkbox) · **Outputs:** DOM מוצג
- **Dependencies:** Google Fonts (רשת) · **Consumers:** כל הרכיבים
- **DB/API/External:** אין ישירות
- **Tests:** אין · **מצב נוכחי:** עובד, אך חסר כלל CSS ל-`.tab-content` (ראה FINDING-002)
- **Findings:** FINDING-002, FINDING-010

## COMP-002 — Tabs & Navigation
- **Path:** `switchTab()` (שורות 1149–1165), כפתורי `.tab-btn` (שורות 334–339)
- **תפקיד:** מעבר בין 4 טאבים: manage / stats / search / settings, כולל aria-hidden
- **Inputs:** קליק על כפתור · **Outputs:** מצב DOM
- **Dependencies:** COMP-001 · **Consumers:** COMP-004, COMP-007, COMP-008
- **מצב נוכחי:** עובד (לוגיקה תקינה); שימו לב: זיהוי הכפתור נעשה ע"י פרסור מחרוזת ה-onclick
- **Findings:** FINDING-002 (חוסר CSS גורם להצגה בו-זמנית)

## COMP-003 — Data Layer (strains + persistence)
- **Path:** `strains` מערך גלובלי (שורה 619), `saveData()` (756), `loadFromLocalStorage()` (785), `loadData()` (804), SAMPLE_DATA (623–650)
- **תפקיד:** מודל הנתונים: מערך זנים + שמירה/טעינה מ-localStorage ומ-Firebase
- **Inputs:** form, import, Firebase snapshot · **Outputs:** localStorage, Firebase `strains/{userKey}`
- **Dependencies:** COMP-005 (Firebase), localStorage
- **DB interaction:** Firebase RTDB: `db.ref('strains/${userKey}').set(...)` / `.once('value')`
- **מצב נוכחי:** עובד, אך ללא listeners בזמן אמת וללא התמודדות עם מכשירים מרובים (FINDING-003), וללא validation של מבנה הנתונים מהענן (FINDING-004)
- **Findings:** FINDING-003, FINDING-004, FINDING-012

## COMP-004 — Strains Table (render + CRUD UI)
- **Path:** `renderStrains()` (909), `viewStrain()` (1013), `deleteStrain()` (1003)
- **תפקיד:** טבלת זנים עם צפייה ומחיקה; רינדור ל-index-based onclick
- **Inputs:** `strains` · **Outputs:** innerHTML
- **מצב נוכחי:** עובד; חוסר אפשרות עריכה קיים זן (feature gap); index-based actions שבירים לשינויים בין render לפעולה (סיכון נמוך בפועל — אין concurrency מקומי)
- **Findings:** FINDING-009 (חוסר עריכה), סיכון index-based מתועד

## COMP-005 — Firebase Sync
- **Path:** `firebaseConfig` (687–696), `initializeFirebase()` (699), `testFirebaseConnection()` (731), `handleFirebaseError()` (761)
- **תפקיד:** סנכרון ענן ל-Firebase RTDB (compat SDK v10.7.1, CDN)
- **Inputs:** firebaseConfig hardcoded · **Outputs:** `strains/{userKey}`, `connection_test`
- **External services:** Firebase RTDB (europe-west1) · **Env vars:** אין — כל ה-config מוטמע בקוד
- **Security considerations:** 🔴 קריאה אנונימית לכל ה-DB פתוחה (מאומת FINDING-001); apiKey ציבורי מוטמע (נורמלי ל-Firebase web, אך החשיפה מסתמכת על rules)
- **מצב נוכחי:** עובד (מאומת רשתית); אין `.on('value')` listener — סנכרון חד-כיווני בהעלאה בלבד
- **Findings:** FINDING-001 (Critical), FINDING-003, FINDING-005, FINDING-013

## COMP-006 — Chrome Extension Import Bridge
- **Path:** `setupExtensionIntegration()` (777), `handleImportedStrainData()` (802), `checkForImportedData()` (830), `fillAddFormWithData()` (846)
- **תפקיד:** קליטת נתונים מתוסף דפדפן חיצוני דרך `localStorage['importedStrainData']` (storage event + polling כל 2 שניות)
- **Inputs:** localStorage · **Outputs:** טופס הוספה
- **Security considerations:** כל סקריפט בדף/תוסף יכול להזריק נתונים; הנתונים מוזרמים לטופס ומוצגים ב-`confirm()` — אין sanitization מעבר ל-escapeHtml בעת רינדור
- **מצב נוכחי:** עובד בקוד; קיום התוסף עצמו מחוץ למאגר (UNKNOWN — ראה OPEN-QUESTIONS)
- **Findings:** OPEN-Q1

## COMP-007 — Stats & Chart
- **Path:** `renderStats()` (1086), Chart.js CDN 4.4.0
- **תפקיד:** ממוצעי THC/CBD/מחיר/דירוג + גרף עמודות
- **מצב נוכחי:** עובד; הגרף נהרס ונבנה בכל כניסה לטאב (תקין)
- **Findings:** FINDING-006 (Chart.js מ-var גלובלי ללא בדיקת קיום — נפילה אם CDN נחסם)

## COMP-008 — Search
- **Path:** `performSearch()` (1060)
- **תפקיד:** חיפוש חופשי בשם/סוג/טרפנים/השפעות/הערות
- **מצב נוכחי:** עובד; חיפוש בסיסי בלבד (ללא היילייט/סינון לפי שדות נוספים) — feature gap, לא באג

## COMP-009 — Add/Edit Modal & Form
- **Path:** מודל `addStrainModal` (411–604), `openAddModal()/closeAddModal()` (1167), `addStrain()` (970), `addPharmacy()/renderPharmacies()` (1041)
- **תפקיד:** טופס הוספת זן עם 14 שדות + בתי מרקחת דינמיים
- **מצב נוכחי:** עובד; ללא מצב עריכה (אותו טופס לא ממוחזר ל-update) — feature gap

## COMP-010 — Import/Export & Sharing
- **Path:** `importData()` (826), `exportData()` (895), `shareWhatsApp()` (1201), `shareEmail()` (1206), `copyLink()` (1211), `clearAllData()` (1216)
- **תפקיד:** גיבוי/שחזור JSON, שיתוף חיצוני, מחיקה גורפת
- **מצב נוכחי:** עובד; import עם normalization ו-dedupe סבירים; clearAllData עם אישור כפול
- **Findings:** FINDING-007 (copyLink ללא catch), FINDING-011 (מחיקה גורפת מוחקת גם בענן ללא גיבוי אוטומטי)

## COMP-011 — Sync Status Indicator
- **Path:** `updateSyncStatus()` (715), DOM `#syncStatus` (328)
- **תפקיד:** חיווי מצב חיבור (offline/syncing/synced) עם aria-live
- **מצב נוכחי:** עובד; אין זיהוי אובדן חיבור בזמן אמת (`.info/.connected` של RTDB אינו בשימוש)

</div>
