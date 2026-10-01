<div dir="rtl">

# FINDINGS-REGISTER — רישום ממצאים

**סה"כ:** 23 ממצאים · 🔴 Critical: 1 · 🟠 High: 4 · 🟡 Medium: 8 · 🔵 Low: 7 · ⚪ Info: 3
**סקאלת Confidence:** VERIFIED · HIGH CONFIDENCE · REQUIRES VERIFICATION · UNKNOWN (ע"פ פרוטוקול §41)

> ## 🔄 עדכון Re-audit (2026-09-25) — סטטוס ביצוע
> **כל הממצאים הקודיים (002–012, 014–022) טופלו ואומתו** בשלב Execution וב-Re-audit שלאחריו (שער check.sh PASS + 18 בדיקות רגרסיה PASS — ראה TEST-RESULTS). פירוט התיקון לכל ממצא: docs/audit/07-BUGS.md המעודכן.
> **נותרים פתוחים:**
> - **FINDING-001 (🔴) + 013 (🟠):** הצד-קוד הושלם (firebase-auth-compat CDN + signInAnonymously + מיגרציה + path `strains/{authUid}`), אך **החשיפה בפועל נמשכת** עד החלת ה-rules + הפעלת Anonymous ב-Firebase Console — פעולה ידנית שאינה ניתנת לביצוע מהקוד. חסם הפרסום היחיד.
> - **FINDING-019, 023 (⚪):** קוסמטיים/החלטה-מודעת — לא טופלו (P4).
> **ממצא חדש:** FINDING-024 (מתוקן במהלך ה-Execution עצמו) — ראה בתחתית הרישום.
>
> ### 🔄 Re-audit 2026-10-01 (מחזור שני)
> - **FINDING-001 — אומת מחדש בשטח פעמיים בתאריך זה:** probes קריאה-בלבד ל-`/.json`, `/strains.json`, `/connection_test.json` מחזירים **200** — ה-rules לא בתוקף, למרות דיווח המשתמש על החלה. חשד ריכוז: **Publish לא נלחץ** או **instance/פרויקט שגוי** (ה-DB: `panda-canabis-default-rtdb`, europe-west1). TEST-R08 נותר פתוח.
> - **FINDING-025 (חדש, 🔵 Low, VERIFIED — תוקן במחזור זה):** סטיית תיעוד — `ID.md` תיאר פריסה כ"העלאה ידנית", "ללא package.json" ו-"OPEN-Q3 לא-מאומת" גם לאחר הפריסה החיה וה-wrapper (D-18/D-19). תוקן ב-ID.md במחזור זה.
> - **יתר הממצאים הקודיים נותרים מתוקנים:** שער PASS + tsc PASS + 1,420 שורות CRLF (100%) — אפס רגרסיה.

---

### FINDING-001 — 🔴 קריאה אנונימית פתוחה ל-Firebase RTDB (חשיפת נתונים)
- **תחום:** אבטחה/מסד נתונים · **חומרה:** Critical · **Confidence:** VERIFIED
- **Path:** `index.html:687–696` (config) · Firebase RTDB Rules (חוץ-מאגרי, פרויקט `panda-canabis`)
- **Function:** כל המערכת (rules)
- **תיאור:** מסד הנתונים בזמן אמת קריא במלואו ללא אימות. האפליקציה עצמה אינה מבצעת כל sign-in.
- **ראיה:** `curl GET https://panda-canabis-default-rtdb.europe-west1.firebasedatabase.app/.json` ללא token → **HTTP 200** עם JSON מלא: `connection_test` + `strains/user_…` המכיל רשומות אמיתיות (בוצע קריאה-בלבד, ללא כתיבה).
- **Root Cause:** rules ב-Firebase מתירות `.read` ללא auth (לא ניתן לראותן מהמאגר; ההתנהגות מאומתת).
- **השפעה:** כל אדם באינטרנט יכול לקרוא את כל רשימות הזנים של כל המשתמשים — כולל שימושים רפואיים, מינונים ובתי מרקחת. חשיפת מידע רגיש-בריאותי (פרטיות, GDPR/חוק הגנת הפרטיות הישראלי).
- **תרחיש כשל:** תוקף קורא את ה-DB המלא ואוסף פרופילים רפואיים-משויכים-לרשימות.
- **פתרון מומלץ:** עדכון rules: אימות (אנונימי-Firebase-Auth לפחות) + הרשאה פר-userKey: `{ "rules": { "strains": { "$uid": { ".read": "auth != null && auth.uid === $uid", ".write": "auth != null && auth.uid === $uid" } } } }`.
- **קבצים מושפעים:** `index.html` (אימוץ auth) · Firebase Console (rules)
- **Breaking Change:** כן (להרשאות פר-משתמש נדרש אימוץ auth) · **סיכון בתיקון:** נמוך
- **Rollback:** שחזור rules קודמות ב-Console · **בדיקות לאחר תיקון:** GET אנונימי צריך להחזיר 401/403; זרימת משתמש מאומת תקינה.

### FINDING-002 — 🟠 כל הטאבים מוצגים במקביל — חסר CSS ל-`.tab-content`/`.active`
- **תחום:** Frontend/UX · **חומרה:** High · **Confidence:** VERIFIED
- **Path:** `index.html:14–320` (style block), `switchTab()` ב-1149
- **ראיה:** grep על בלוק ה-CSS: אין אף כלל ל-`.tab-content` ואין כלל `.active` — ה-JavaScript מחליף classes שאין להן משמעות ויזואלית.
- **Root Cause:** נראה שה-CSS להסתרת טאבים אבד בהעלאה/עדכון של הקובץ ("Add files via upload").
- **השפעה:** ארבעת מסכי האפליקציה מוצגים זה מתחת לזה תמידית; הניווט הראשי שבור ויזואלית לכל משתמש.
- **פתרון מומלץ:** `.tab-content{display:none}.tab-content.active{display:block}`
- **Breaking Change:** לא · **סיכון בתיקון:** אפס · **Rollback:** הסרת שתי השורות · **בדיקות:** מעבר טאבים בדפדפן.

### FINDING-003 — 🟠 סנכרון חד-כיווני, ללא listeners — last-write-wins על מערך שלם
- **תחום:** ארכיטקטורת נתונים · **חומרה:** High · **Confidence:** HIGH CONFIDENCE
- **Path:** `saveData()` (756) — `db.ref(...).set(strains)` · `loadData()` (804) — `.once('value')` בלבד
- **תיאור:** אין `.on('value')`; כל שמירה דורסת את כל המערך בענן. שני מכשירים: השמירה האחרונה מנצחת; מחיקה במכשיר A "תקום" מחדש מהעותק המקומי המיושן של מכשיר B.
- **השפעה:** אובדן נתונים שקט בשימוש מרובה-מכשירים (המטרה המוצהרת של הסנכרון).
- **פתרון מומלץ:** listeners בזמן אמת + מפתחות פר-זן (push keys) או לפחות reload-on-focus.
- **Breaking Change:** לא (בגרסה המקלה) · **סיכון:** בינוני · **בדיקות:** שני דפדפנים במקביל.

### FINDING-004 — 🟡 אמון מוגזם בנתוני הענן ב-`loadData()`
- **תחום:** Database/Reliability · **חומרה:** Medium · **Confidence:** HIGH CONFIDENCE
- **Path:** `loadData()` (804): הבדיקה היחידה `Array.isArray(data) && data.length > 0`
- **תיאור:** נתונים מהענן נטענים ל-localStorage ול-UI ללא validation של מבנה פריטים; אובייקט שאינו מערך מתעלם בשקט; נתונים פגומים דורסים את המקומי.
- **פתרון מומלץ:** ולידציה לכל פריט (name/type מחרוזות, מספרים תקינים) לפני קבלה.
- **Breaking Change:** לא · **סיכון:** נמוך

### FINDING-005 — 🟡 כתיבת `connection_test` בכל טעינת עמוד
- **תחום:** Database/תפעול · **חומרה:** Medium · **Confidence:** VERIFIED
- **Path:** `testFirebaseConnection()` (731) — `db.ref('connection_test').set(...)`
- **ראיה:** ה-node קיים ב-DB החי עם timestamp (2026-05-08). הכתיבה מתרחשת בכל טעינה למשתמש מחובר.
- **השפעה:** זיהום מסד פרודקשן; חשיפת מטא-דאטה של שימוש (בשילוב FINDING-001 — קריא מציבור).
- **פתרון מומלץ:** החלפה ב-`.info/connected` (read-only) + הסרת ה-node הקיים.
- **Breaking Change:** לא

### FINDING-006 — 🟡 שימוש ב-`Chart` ללא בדיקת קיום — קריסה אם CDN חסום
- **תחום:** Reliability · **חומרה:** Medium · **Confidence:** HIGH CONFIDENCE
- **Path:** `renderStats()` (1117) — `new Chart(...)` ללא `typeof Chart === 'undefined'`; קריאה בתוך `setTimeout` ללא try/catch
- **השפעה:** ברשת ללא גישה ל-jsdelivr — ReferenceError שקט, טאב סטטיסטיקות ריק ללא הודעה.
- **פתרון מומלץ:** guard + fallback הודעה.

### FINDING-007 — 🔵 `copyLink()` ללא `.catch()`
- **תחום:** Frontend · **חומרה:** Low · **Confidence:** VERIFIED
- **Path:** `copyLink()` (1211) — Clipboard API דורש secure context/הרשאה; כישלון שקט.
- **פתרון:** `.catch(()=>showNotification('❌ ...'))`

### FINDING-008 — 🔵 קוד מת: `safeTypeClass` + רגישות-רישיות ב-class של סוג
- **תחום:** Frontend/טכני · **חומרה:** Low · **Confidence:** VERIFIED
- **Path:** `renderStrains()` (918, 923): `safeTypeClass` מחושב ולא בשימוש; ה-class המיוצר `type-${escapeHtml(s.type)}` לא עובר `toLowerCase()` — יבוא של `"Indica"` (רישיות) מניב עיצוב חסר.

### FINDING-009 — 🔵 אין עריכה של זן קיים
- **תחום:** Feature gap · **חומרה:** Low · **Confidence:** VERIFIED
- **תיאור:** קיימים רק צפייה/מחיקה; תיקון טעות מחייב מחיקה+הוספה מחדש (מאבד createdAt).

### FINDING-010 — 🟡 מצב כהה לא נשמר + צבעי Chart.js לא תואמי dark mode
- **תחום:** UX/Frontend · **חומרה:** Medium · **Confidence:** VERIFIED
- **Path:** `toggleDarkMode()` (1195) — ללא localStorage; `renderStats()` (1134, 1137, 1141) — העברת מחרוזות `'var(--text-main)'` ל-Chart.js: canvas אינו פותר CSS variables → צבע ברירת-מחדל, ניגודיות גרועה במצב כהה.

### FINDING-011 — 🟡 מחיקה גורפת מוחקת גם בענן ללא גיבוי אוטומטי
- **תחום:** Reliability/דאטה · **חומרה:** Medium · **Confidence:** HIGH CONFIDENCE
- **Path:** `clearAllData()` (1216): אישור כפול קיים, אך אין הצעת ייצוא לפני מחיקה; המחיקה עוברת גם ל-Firebase.

### FINDING-012 — 🟡 `userKey` חלש (Date.now + Math.random)
- **תחום:** אבטחה/זהות · **חומרה:** Medium · **Confidence:** HIGH CONFIDENCE
- **Path:** `initializeFirebase()` (710) — `'user_' + Date.now() + '_' + Math.random().toString(36).substr(2,9)`
- **תיאור:** מזהה לא קריפטוגרפי ואינו מחובר לזהות אמיתית; עם rules פתוחות (001/013) הוא מפתח-כתובת לכל הרשומות. עדיף `crypto.randomUUID()` בשילוב auth.

### FINDING-013 — 🟠 כתיבה אנונימית ל-RTDB כנראה פתוחה אף היא
- **תחום:** אבטחה/מסד נתונים · **חומרה:** High · **Confidence:** HIGH CONFIDENCE (REQUIRES VERIFICATION ב-runtime — פרובת כתיבה אסורה ב-Audit)
- **תיאור:** האפליקציה כותבת ל-DB ללא כל token אימות, והכתיבות שלה מצליחות (ראיה: timestamps מתעדכנים ב-`connection_test` ב-DB החי). האפליקציה = לקוח אנונימי; לכן rules מתירות כתיבה ללא-אימות לפחות ל-`strains/*` ו-`connection_test`.
- **השפעה:** תוקף יכול לדרוס/למחוק נתוני כל משתמש (מפתח `userKey` חשוף בקריאה הפתוחה).
- **פתרון:** כמו FINDING-001 · **בדיקת אימות בשלב התיקון:** PUT ל-path זבל → צפוי 401/403 לאחר תיקון.

### FINDING-014 — ⚪ README הוא stub שורה-אחת
- **תחום:** תיעוד · **Confidence:** VERIFIED · מטופל במסגרת ה-Audit (README חדש נוצר).

### FINDING-015 — 🔵 שימוש ב-`substr` (deprecated)
- **Path:** `initializeFirebase()` (711) · **Confidence:** VERIFIED · עדיף `slice`.

### FINDING-016 — 🟠 Stored XSS דרך שדה `type` בתוצאות חיפוש
- **תחום:** אבטחה/Frontend · **חומרה:** High · **Confidence:** HIGH CONFIDENCE
- **Path:** `performSearch()` (1077) — `${getTypeHebrew(s.type)}` נכנס ל-innerHTML **ללא escapeHtml** (שאר השדות מסוננים); `getTypeHebrew()` מחזיר את ה-string הגולמי כשהוא מחוץ למפה (964–967).
- **וקטור:** יבוא JSON זדוני (`{"name":"x","type":"<img src=x onerror=alert(1)>"}`) — ובעיקר: כתיבה מרחוק ל-DB הפתוח (FINDING-013) שתסונכרן לדפדפני קורבנות → XSS חוצה-משתמשים.
- **פתרון:** `escapeHtml(getTypeHebrew(s.type))` + whitelist לסוג בקליטה.

### FINDING-017 — 🔵 `'⭐'.repeat(s.rating)` ללא clamp — RangeError
- **Path:** `viewStrain()` (1028), `performSearch()` (1077) — בניגוד ל-`renderStrains()` (927) שמ-clamp. דירוג 1e9 מיבוא/ענן → RangeError, חיפוש קורס.

### FINDING-018 — 🟡 חסימת zoom ב-viewport — כשל WCAG 1.4.4
- **Path:** `index.html:5` — `maximum-scale=1.0, user-scalable=no` · **Confidence:** VERIFIED

### FINDING-019 — ⚪ אין favicon/meta description
- **Confidence:** VERIFIED · קוסמטי.

### FINDING-020 — 🔵 polling כל 2 שניות לתוסף ללא תנאי עצירה
- **Path:** `setupExtensionIntegration()` (790) — ריצה תמידית; ה-storage event מכסה כבר את אותו-origin. עלות משאבים זניחה אך מיותרת.

### FINDING-021 — 🔵 `localStorage.setItem` לא שמור ב-`saveData()` — קריסה במצב quota/פרטי
- **Path:** `saveData()` (757) — חריגה (QuotaExceeded/מצב פרטי) מפילה את `addStrain` לפני `closeAddModal()` → המודל נתקע; ב-`deleteStrain` ה-render לא יופיע.

### FINDING-022 — 🟡 שלושה סקריפטים חוסמי-רינדור ב-head ללא `defer`
- **Path:** `index.html:10–12` (Chart.js ~205KB + Firebase compat ×2) — חוסמים first paint ברשתות איטיות. **Confidence:** VERIFIED

### FINDING-023 — ⚪ נתוני דוגמה נזרעים אוטומטית למשתמשים חדשים (כולל לענן)
- **Path:** `loadFromLocalStorage()` (785–800) — משתמש חדש עם חיבור ריק בענן מקבל את SAMPLE_DATA כ"נתונים אמיתיים" והם נשמרים גם בענן.

### FINDING-024 — 🟡 `updatedAt: undefined` גורם ל-Firebase `set()` להיכשל (זוהה ותוקן ב-Execution)
- **תחום:** ארכיטקטורת נתונים · **חומרה:** Medium · **Confidence:** VERIFIED (תוקן)
- **Path:** `sanitizeCloudData()` (הגרסה שלפני התיקון)
- **תיאור:** המימוש הביניימי של TASK-005 כלל `updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : undefined`. Firebase RTDB דוחה ערכי undefined — כל `set()` של מערך המכיל פריט ללא updatedAt היה נכשל בשקט (promise rejection → חיווי "שגיאת סנכרון"), כלומר סנכרון הענן כולו היה שבור בפועל למרות קוד שנראה תקין.
- **ראיה:** סקירת קוד ב-Execution; התנהגות Firebase RTDB מתועדת (undefined values invalid).
- **תיקון שבוצע:** השדה נוסף לאובייקט רק כאשר הוא קיים בפועל: `if(typeof item.updatedAt === 'string') valid[valid.length-1].updatedAt = item.updatedAt;`
- **Root Cause:** טרנספורמציה דקלרטיבית של אובייקט עם ערך-ברירת-מחדל undefined, בניגוד לסמנטיקה של Firebase.
- **השפעה לולא תוקן:** אובדן סנכרון מלא לענן + false-negative בחיווי.
- **בדיקות:** TEST-R06 (Re-audit) מאמת שאין ערכי undefined ב-payload.

### FINDING-025 — 🔵 סטיית תיעוד ב-ID.md אחרי הפריסה (זוהה ותוקן ב-Re-audit 2026-10-01)
- **תחום:** תיעוד · **חומרה:** Low · **Confidence:** VERIFIED (תוקן)
- **Path:** `ID.md`
- **תיאור:** שורות מתיישנות לאחר הפריסה החיה (2026-09-28): "Infrastructure: העלאה ידנית", "Deployment: יעד סופי לא-מאומת (OPEN-Q3)", "Dependencies: ללא package.json", "Tests: ST-01/02/03" (ללא ST-04), "~1,419 שורות" (בפועל 1,420).
- **Root Cause:** ID.md לא עודכן בזמן D-18/D-19 והפריסה; התיעוד ב-README/CLAUDE כן עודכן — חוסר סנכרון בין מסמכים (Consistency Pass).
- **תיקון שבוצע:** עדכון השורות במחזור זה; OPEN-Q3 נסגרה.
- **השפעה:** מידע שגוי לסוכן/מפתח נכנס — עלול להוביל להחלטות מוטעות על פריסה.
- **Breaking Change:** לא · **בדיקות:** Consistency Pass (סעיף 40).

---

## False-Positive Check (§46)
- "כפילות מזהי id ביבוא" — נבדק: `Date.now()+random` מקובל; לא דווח.
- "XSS בטבלה" — נבדק: שורה 923 כן מבצעת escapeHtml ל-typeHeb; הווקטור האמיתי רק בחיפוש (FINDING-016).
- "listener leak ב-`window.addEventListener('focus')`" — נרשם פעם אחת; לא דווח.
- "הסרת pharmacy לפי index עלולה להתיישן" — רינדור מיידי אחרי כל splice; לא דווח.

</div>
