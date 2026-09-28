<div dir="rtl">

# DEPENDENCY-MAP — מפת תלויות

## תלויות רכיבים (Component → Component)
```
COMP-002 Tabs ──▶ COMP-001 Shell
COMP-003 DataLayer ──▶ COMP-005 Firebase (כתיבה/קריאה) ──▶ 🔴 RTDB חיצוני
COMP-003 DataLayer ──▶ localStorage
COMP-004 Table ──▶ COMP-003 DataLayer
COMP-006 ExtensionBridge ──▶ localStorage ──▶ COMP-009 Modal (מילוי טופס)
COMP-007 Stats ──▶ COMP-003 DataLayer ──▶ Chart.js (CDN, global `Chart`)
COMP-008 Search ──▶ COMP-003 DataLayer
COMP-009 Modal ──▶ COMP-003 DataLayer
COMP-010 Import/Export ──▶ COMP-003 DataLayer
COMP-011 SyncStatus ──▶ COMP-005 Firebase
```

## תלויות קובץ → שירות חיצוני
```
index.html ──▶ fonts.googleapis.com (Heebo)           [רשת; נכשל = פונט fallback]
index.html ──▶ cdn.jsdelivr.net (chart.js@4.4.0)      [רשת; נכשל = קריסת טאב סטטיסטיקות — FINDING-006]
index.html ──▶ www.gstatic.com (firebase compat 10.7.1) [רשת; נכשל = מצב מקומי בלבד — מטופל]
index.html ──▶ panda-canabis…firebasedatabase.app     [RTDB; 🔴 פתוח לקריאה/כתיבה אנונימית — FINDING-001/013]
```

## תלויות נתונים
```
localStorage.cannabisStrains  ◀──▶  מערך strains (in-memory)  ◀──▶  RTDB:strains/{userKey}
localStorage.userKey          ─────▶  RTDB:strains/{userKey}  (מפתח גישה לכל הרשומות)
localStorage.importedStrainData ────▶  COMP-006 (bridge חד-פעמי, נמחק אחרי שימוש)
```

## ממצאי תלויות

> **🔄 עודכן ב-Re-audit 2026-09-25** — ההערות למטה משקפות את הקוד הנוכחי; הרישום המקורי נשמר.

- **אין circular dependencies** (מערכת שטוחה בקובץ יחיד).
- **Hidden coupling:** ✅ נפתר — ה-CSS מממש כעת את `.tab-content.active` (002 תוקן).
- **Duplicated logic:** חישוב דירוג `'⭐'.repeat` בשלושה מקומות — עם **clamp אחיד ממומש** בכולם (017 תוקן); שכפול מינורי שנותר מקובל.
- **Single points of failure:** RTDB (נתונים), jsdelivr (גרף — כעת עם guard והודעה במקום קריסה), gstatic (SDK ×3 כולל auth).
- **Obsolete dependencies:** אין; אין package.json (תלויות CDN בלבד, כולן עם גרסה מדויקת + defer).
- **Unnecessary coupling:** `switchTab` עדיין מזהה כפתור לפי פרסור מחרוזת `onclick` (שביר אך פועל); `getComputedStyle` כעת פותר ערכים פתוחים לפני העברה ל-Chart.js (010 תוקן).
- **חדש:** תלות חדשה ב-**Firebase Auth** (auth compat SDK + Anonymous provider) — היעדרו מפיל את הסנכרון אך לא את המצב המקומי (handleFirebaseError מטפל).

---

## (הרישום המקורי 2026-09-24)
- **Hidden coupling (מקורי):** ה-JS תלוי ב-class names שה-CSS אינו מממש (`.tab-content.active`) — צימוד JS↔CSS שבור (FINDING-002).
- **Duplicated logic (מקורי):** חישוב דירוג ללא clamp (FINDING-017).
- **Unnecessary coupling (מקורי):** `getComputedStyle` על CSS vars שמועברות ישירות ל-Chart.js (FINDING-010).

</div>
