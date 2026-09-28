<div dir="rtl">

# 21 — FEATURE OPPORTUNITIES

הזדמנויות המותאמות למערכת כפי שהיא באמת (§28) — לא wishlist כללי:

## אוטומציה
- **סנכרון ענן אמיתי** (listeners) — משדרג את ההבטחה המרכזית של המוצר (TASK-005).
- **גיבוי אוטומטי תקופתי ל-localStorage גלישה (`cannabisStrains_backup`)** — זול, מונע אובדן (משלים TASK-004).
- **ייבוא חכם מתמונות/טקסט** — התוסף כבר מזרים נתונים; להרחיב לקליטה מ-clipboard.

## חסר למשתמש
- **עריכת זן** (TASK-013) — ה-gap הפונקציונלי הבולט.
- **מיון/סינון טבלה** (לפי THC/מחיר/דירוג) — זול למימוש על המערך הקיים.
- **השוואת זנים side-by-side** — מנצל את נתוני ה-THC/CBD שכבר קיימים.
- **היסטוריית שינויים** (updatedAt + undo אחרון) — מגן גם מ-003.

## חסר למפתח
- **טופס self-service ל-Firebase project חדש** (setup wizard קל או תיעוד) — מקטין תלות ב-config קשיח.
- **smoke tests** — TASK-012.

## חסר למנהל/production
- **דף סטטוס פשוט** (חיווי Firebase `.info/connected` מורחב).
- **יצוא CSV** בנוסף ל-JSON — שימושי לשיתוף עם רופא/רוקח.

## observability / reliability
- **התראת quota של Firebase** (Console) ו-tracking שגיאות קל (window.onerror → console + נתיב דיווח עתידי).

## scale / onboarding
- **Onboarding flow** למשתמש חדש במקום זריעת SAMPLE_DATA שקטה (FINDING-023) — הסבר קצר + בחירה אם לטעון דוגמאות.
- **RTL-aware print stylesheet** להדפסת קטלוג.

</div>
