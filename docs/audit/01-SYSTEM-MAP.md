<div dir="rtl">

# 01 — SYSTEM MAP

> **🔄 עודכן ב-Re-audit 2026-09-25** (אחרי שלב Execution): המפה למטה מעודכנת למבנה החדש; המקורות הם הקוד בפועל.

## המערכת במבט אחד
```
┌─────────────────────────────── דפדפן המשתמש ───────────────────────────────┐
│                        index.html (SPA, קובץ יחיד)                          │
│                                                                             │
│  UI: 4 טאבים (ניהול/סטטיסטיקות/חיפוש/הגדרות) + מודל הוספה + חיווי סנכרון   │
│   ▲              ▲                ▲              ▲                          │
│   │              │                │              │                          │
│  CRUD     renderStats()      performSearch()  import/export                 │
│   └──────┬───────┴────────┬───────┴──────────────┘                           │
│          ▼                ▼                                                  │
│     [strains: array] ── localStorage('cannabisStrains')                      │
│          │                                                                   │
│     saveData()/loadData() ──▶ firebase RTDB compat SDK                      │
│          │                                     │                            │
│  signInAnonymously() → authUid ─────────────────┤  (חדש — TASK-002)          │
│  migrateLegacyDataIfNeeded(): userKey→authUid ──┤  (חדש — מיגרציה חד-פעמית) │
│          │                                     ▼                            │
│  localStorage.importedStrainData ◀── תוסף דפדפן חיצוני (מחוץ למאגר)        │
└─────────────────────────────────────────────────────────────────────────────┘
                                               │ HTTPS
                                               ▼
                    ┌──────────── Firebase RTDB (europe-west1) ────────────┐
                    │  strains/{authUid}: [ {id,name,type,thc,cbd,…} ]     │  ← חדש
                    │  strains/{userKey}: [ … ] ← מועבר אוטומטית ונמחק     │  ← legacy
                    │  connection_test — לא נכתב עוד מהקוד (TASK-008)      │
                    │  🔴 rules: עדיין פתוחות בפועל — נדרשת החלה ב-Console │
                    └──────────────────────────────────────────────────────┘

CDN: Heebo (fonts.googleapis.com) · Chart.js@4.4.0 (jsdelivr) · firebase@10.7.1
     app+**auth**+database compat (gstatic) — auth נוסף ב-Execution
```

## מפת מסכים
| מסך | DOM id | פונקציה ראשית |
|---|---|---|
| ניהול זנים | `manageTab` | `renderStrains()`, `openAddModal()`, `editStrain()` |
| סטטיסטיקות | `statsTab` | `renderStats()` (Chart.js + guard) |
| חיפוש | `searchTab` | `performSearch()` |
| הגדרות | `settingsTab` | סנכרון/שיתוף/ייצוא/מחיקה |
| מודל הוספה/עריכה | `addStrainModal` | `addStrain()` — שתי המצבים לפי `editingId` |

## גבולות המערכת
- **אין שרת משלה** — קובץ סטטי; הצד ה"אחורי" היחיד הוא Firebase RTDB.
- **Auth אנונימי (Firebase Auth)** — הזהות היא `authUid`; `userKey` נשמר רק למיגרציה חד-פעמית (FINDING-012 נפתר).
- **תוסף דפדפן** חיצוני כותב ל-`localStorage.importedStrainData` (OPEN-Q1); ה-polling הוסר — שאר המנגנון ללא שינוי.

</div>
