<div dir="rtl">

# 20 — RECOMMENDATIONS

תעדוף לפי Impact + Risk בלבד (§27). כל פריט מקושר ל-TASK ב-[23-ACTION-PLAN.md](23-ACTION-PLAN.md).

## P0 — קריטי (לפני כל שימוש/פרסום)
| # | המלצה | ממצא | TASK |
|---|---|---|---|
| P0-1 | סגירת Firebase RTDB rules + אימוץ Firebase Auth (אנונימי לפחות) עם הרשאה פר-userKey | 001, 013 | TASK-002 |

## P1 — גבוה (יציבות ואבטחה משמעותיות)
| # | המלצה | ממצא | TASK |
|---|---|---|---|
| P1-1 | הוספת כללי CSS ל-`.tab-content` (תיקון ניווט) | 002 | TASK-003 |
| P1-2 | escapeHtml בתוצאות החיפוש + whitelist לשדה type בקליטה | 016 | TASK-006 |
| P1-3 | listeners בזמן אמת + מפתחות פר-זן (או לפחות reload-on-focus) | 003 | TASK-005 |

## P2 — בינוני (איכות, אמינות, נגישות)
| # | המלצה | ממצא | TASK |
|---|---|---|---|
| P2-1 | גיבוי אוטומטי לפני מחיקה גורפת (הורדת JSON) | 011 | TASK-004 |
| P2-2 | guard ל-Chart.js + הודעת fallback | 006 | TASK-007 |
| P2-3 | ולידציית פריטים בטעינת ענן | 004 | TASK-005 |
| P2-4 | הסרת `connection_test` ומעבר ל-`.info/connected` | 005 | TASK-008 |
| P2-5 | הסרת חסימת zoom + שמירת מצב כהה | 018, 010 | TASK-009 |
| P2-6 | שמירת localStorage ב-try/catch + fallback | 021 | TASK-010 |
| P2-7 | `defer` לסקריפטי CDN | 022 | TASK-011 |

## P3 — שיפור
| # | המלצה | TASK |
|---|---|---|
| P3-1 | קבועים מרוכזים, clamp אחיד ל-rating, ניקוי קוד מת, `slice` במקום `substr`, הסרת polling כפול | TASK-014 |
| P3-2 | smoke checklist בדפדפן + `node --check` gate | TASK-012 |
| P3-3 | עריכת זן קיים (מיחזור המודל למצב edit) | TASK-013 |

## P4 — Future
- מעבר ל-Vite + מודולים כשהקוד צומח מעבר ל-~2,000 שורות.
- E2E (Playwright) על זרימות הליבה.
- יצירת מופע RTDB ל-dev בלבד (הפרדת סביבות).
- CSP עם מעבר ל-listeners מקודדים.
- דף פרטי זן מעוצב במקום `alert()`.

**שלא לעשות:** לא להחליף ספריות, לא להעביר ל-TypeScript/React כרגע, לא להקים backend — אין צורך מוכח וה-ROI נמוך (§29, §49).

</div>
