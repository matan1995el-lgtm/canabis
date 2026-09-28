<div dir="rtl">

# 14 — TESTING / QA

## מצב קיים
- **כיסוי בדיקות: 0%.** אין unit/integration/E2E, אין test runner, אין lint/typecheck config.
- הבדיקה היחידה שהתבצעה אי-פעם (לפי המאגר) היא שימוש ידני.

## בדיקות שבוצעו ב-Audit (Safe Testing)
מלוא הפירוט ב-[TEST-RESULTS.md](_state/TEST-RESULTS.md):
- ✅ PASS: תחביר JS (`node --check`), נעילת גרסאות CDN
- ❌ FAIL (כראיה): חוסר CSS לטאבים · חשיפת RTDB · פער README
- ⛔ BLOCKED: פרובת כתיבה ל-RTDB (אסורה ב-Audit) · ריצת דפדפן (אין בסביבה)
- ⚪ N/A: lint/typecheck/build/unit (אין toolchain)

## מה חייב להיות (מוביל ל-24-TEST-PLAN)
1. **Smoke בדפדפן** (חובה לפני כל פרסום): מעבר טאבים, הוספה, מחיקה, יבוא, ייצוא, חיפוש.
2. **Syntax gate** — `node --check` על ה-JS (זול, מונע סוג התקלות של 002).
3. **לאחר TASK-002:** אימות 401/403 ל-GET/PUT אנונימיים.
4. **E2E קל** (Playwright) על זרימות FLOW-001/003/004 — אופציונלי P3.

</div>
