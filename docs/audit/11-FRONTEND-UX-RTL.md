<div dir="rtl">

# 11 — FRONTEND / UX / RTL

## Functional
| בדיקה | מצב | הערות |
|---|---|---|
| כפתורים וקישורים מחוברים | ✅ | כל ה-onclick מוגדרים; לא נמצא כפתור ללא handler |
| טפסים/ולידציה | ✅ בסיסית | required + בדיקת name/type ב-addStrain; אין טווחים בזמן אמת |
| שגיאות/טעינה/empty states | 🟡 | יש notifications ו-empty states לטבלה/חיפוש; אין spinner לסנכרון ממושך |
| מודל | ✅ | נפתח/נסגר, ESC, חזרת overflow |
| **ניווט טאבים** | 🔴 **שבור** | חסר CSS ל-`.tab-content` — כל המסכים מוצגים (FINDING-002, VERIFIED סטטית) |

## UX
- **היררכיה ברורה**, notifications עקביים, confirmations לפעולות הרסניות (מחיקה בודדת ✓, מחיקה גורפת כפולה ✓ אך ללא הצעת גיבוי — FINDING-011).
- **Feature gaps:** אין עריכת זן (009), אין מיון/פגינציה בטבלה, אין שמירת מצב כהה (010).
- **alert() לצפייה בזן** (viewStrain) — חוויה ישנה; מועמד להחלפה בפאנל פרטים (P3).

## Responsive
- Media queries קיימות (768px, 430×932) עם touch targets 44px, טבלה עם overflow-x, מניעת zoom-IOS ב-inputs (font-size 16px).
- ⚠️ **חסימת zoom** ב-viewport (`user-scalable=no`) — פוגעת בנגישות (FINDING-018).

## RTL
| בדיקה | מצב |
|---|---|
| `dir="rtl"` על html | ✅ |
| כיווניות טבלה, th/td `text-align:right` | ✅ |
| flex/grid — אין ערכי direction ידניים הפוכים | ✅ |
| מיקום sync-status (top-right) ב-RTL | ✅ מותאם |
| mixed Hebrew/English (שמות זנים, טרפנים) | ✅ נסחף נכון ע"י הדפדפן |
| **inline `margin-right` בכפתור ייבוא** (שורה 346) | 🔵 עובד ב-RTL; שביר אם dir משתנה |
| מספרים/אחוזים | ✅ מוצגים LTR-embedded תקין |

## Accessibility
| בדיקה | מצב |
|---|---|
| roles: tablist/tab/tabpanel/status/dialog | ✅ קיימים |
| aria-selected/aria-hidden מנוהלים ב-JS | ✅ |
| labels/sr-only | ✅ ברוב השדות; 🟡 בלי `for` ב-group בתי-מרקחת |
| מקלדת | 🟡 ESC למודל ✓; 🟡 **אין focus trap במודל**, אין ניווט חצים בטאבים |
| contrast | ✅ ברירות מחדל קריאות; 🟡 טיקסטים לבנים על ירוק עדין (stat-card) בסדר בפועל |
| **zoom לחולשת ראייה** | ❌ חסום (FINDING-018) |

**סיכום:** בסיס נגישות ו-RTL טוב מהמקובל בקובץ-יחיד; הבאג הוויזואלי (002) וה-zoom (018) מכתיבים את ה-P1/P2 של ה-Frontend.

</div>
