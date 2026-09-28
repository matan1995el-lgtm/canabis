<div dir="rtl">

# 05 — COMPONENTS

> **🔄 עודכן ב-Re-audit 2026-09-25:** מספרי שורות ומצבי רכיבים מעודכנים לאחר שלב Execution. רישום מלא ב-[COMPONENT-REGISTRY.md](_state/COMPONENT-REGISTRY.md).

| ID | רכיב | Path (שורות) | תפקיד | מצב | ממצאים |
|---|---|---|---|---|---|
| COMP-001 | App Shell & Theme | CSS 14–320 · DOM 322–413 | עיצוב ירוק, RTL, dark mode (persist) | ✅ תוקן (002) | — |
| COMP-002 | Tabs & Navigation | `switchTab()` ~1296 | ניווט בין 4 מסכים | ✅ תוקן (002) | — |
| COMP-003 | Data Layer | `strains` ~624, `saveData` ~832, `loadData` ~881 | מודל נתונים + persistence + guard דריסה | ✅ תוקן (003, 004, 021) | — |
| COMP-004 | Strains Table | `renderStrains()` ~1015 | טבלה + עריכה/צפייה/מחיקה | ✅ תוקן (008, 009) | — |
| COMP-005 | Firebase Sync | config ~587, `initializeFirebase` ~594, `sanitizeCloudData` ~655 | auth אנונימי + listener + ולידציה + מיגרציה | ✅ קוד תקין (001 — נותר החלת rules ב-Console) | 001 (ידני) |
| COMP-006 | Extension Bridge | `setupExtensionIntegration` ~722 | קליטת נתוני תוסף (storage+focus, ללא polling) | ✅ עובד; תוקן (020) | OPEN-Q1 |
| COMP-007 | Stats & Chart | `renderStats()` ~1218 | ממוצעים + Chart.js (guard + צבעים resolved) | ✅ תוקן (006, 010) | — |
| COMP-008 | Search | `performSearch()` ~1186 | חיפוש חופשי | ✅ תוקן (016, 017) | — |
| COMP-009 | Add/Edit Modal & Form | 416–618, `addStrain` ~1071, `editStrain` ~1119 | הוספה ועריכה + focus management | ✅ תוקן (009, 018) | — |
| COMP-010 | Import/Export & Sharing | `importData` ~928, `exportData` ~993 | גיבוי ושיתוף (גיבוי אוטומטי לפני מחיקה) | ✅ תוקן (007, 011, 012) | — |
| COMP-011 | Sync Status | `updateSyncStatus` ~739 | חיווי חיבור דרך `.info/connected` + auth state | ✅ תוקן (005) | — |

## מודל הנתונים — strain (מעודכן)
```
id: number(Date.now) · name: string · type: "indica"|"sativa"|"hybrid" ·
potency: "נמוכה"|"בינונית"|"מאוזנת"|"גבוהה"|"" · price: number(₪) · dosage: string ·
thc: number(0-100) · cbd: number(0-100) · country: string · importer: string ·
terpenes: string · effects: string · rating: 0-5 (clamped) · pharmacies: string[] · notes: string ·
createdAt: ISO string · updatedAt?: ISO string (רק לאחר עריכה)
```
**הערות אמת (מעודכן):** ולידציה ממומשת בשתי נקודות הכניסה — `sanitizeCloudData` לענן (name/type מחרוזות תקינות, clamp ל-rating, סינון pharmacies, דילוג פריטים פגומים) ו-whitelist+clamp ביבוא. אין עדיין schema enforcement פורמלי; `updatedAt: undefined` נמנע במפורש (Firebase דוחה undefined).

</div>
