#!/bin/sh
# check.sh — שער אימות מלא (PANDA Deep Audit — TASK-012)
# הרצה: sh ./scripts/check.sh
# כולל: ST-01 (תחביר JS inline) + ST-02/ST-03 (grep אימות תיקונים מרכזיים)

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="${1:-$ROOT/index.html}"

echo "== ST-01: בדיקת תחביר =="
node "$ROOT/scripts/check-syntax.js" "$TARGET"

echo ""
echo "== ST-04: שער smoke סטטי (DOM/handlers/CDN/meta) =="
node "$ROOT/scripts/check-smoke.js" "$TARGET"

echo ""
echo "== ST-02/ST-03: בדיקות grep מרכזיות =="
fail=0

# כל בדיקה: תיאור + מחרוזת שחייבת להופיע בקובץ
must_contain() {
  desc="$1"
  needle="$2"
  if grep -qF -- "$needle" "$TARGET"; then
    echo "✅ $desc"
  else
    echo "❌ $desc (לא נמצא: $needle)"
    fail=1
  fi
}

# כל בדיקה: תיאור + מחרוזת שאסור שתופיע בקובץ
must_not_contain() {
  desc="$1"
  needle="$2"
  if grep -qF -- "$needle" "$TARGET"; then
    echo "❌ $desc (נמצא, אסור: $needle)"
    fail=1
  else
    echo "✅ $desc"
  fi
}

# TASK-003 / FINDING-002: CSS להסתרת טאבים
must_contain "TASK-003: CSS .tab-content display:none"        ".tab-content{ display:none; }"
must_contain "TASK-003: CSS .tab-content.active display"      ".tab-content.active{ display:block; }"

# TASK-006 / FINDING-016: XSS — escape על סוג בחיפוש
must_contain "TASK-006: escapeHtml(getTypeHebrew(...)) בחיפוש" "escapeHtml(getTypeHebrew(s.type))"

# TASK-006: אין שימוש ב-safeTypeClass הישן
must_not_contain "TASK-006: אין safeTypeClass"                 "safeTypeClass"

# TASK-005 / FINDING-004: ולידציית ענן (sanitizeCloudData)
must_contain "TASK-005: sanitizeCloudData מוגדר"               "function sanitizeCloudData"

# TASK-008 / FINDING-005: אין כתיבת connection_test + יש .info/connected
# (מותר להזכיר את השם בהערות — האיסור הוא על גישה בפועל דרך db.ref)
must_not_contain "TASK-008: אין כתיבת connection_test"         "ref('connection_test"
must_not_contain "TASK-008: אין כתיבת connection_test ( double-quotes )" 'ref("connection_test'
must_contain   "TASK-008: שימוש ב-.info/connected"             ".info/connected"

# TASK-002: אימות אנונימי + נתיב authUid
must_contain "TASK-002: signInAnonymously"                     "signInAnonymously"
must_contain "TASK-002: נתיב strains/{authUid}"                'strains/${authUid}'
must_not_contain "TASK-002: אין הפניות ל-testFirebaseConnection" "testFirebaseConnection"

# TASK-007 / FINDING-006: guard ל-Chart.js
must_contain "TASK-007: guard עבור Chart לא-טעון"              "typeof Chart === 'undefined'"

# TASK-010: persist מצב כהה
must_contain "TASK-010: persist מצב כהה (canabisDark)"         "canabisDark"

# TASK-004 / FINDING-011: גיבוי לפני מחיקה גורפת
must_contain "TASK-004: קריאה ל-exportData ב-clearAllData"     "exportData()"

# TASK-013 / FINDING-009: עריכת זן קיים
must_contain "TASK-013: editStrain מוגדר"                      "function editStrain"
must_contain "TASK-013: כפתור עריכה בטבלה"                     'onclick="editStrain('

echo ""
if [ "$fail" -eq 0 ]; then
  echo "✅ ST-02/ST-03 PASS — כל בדיקות ה-grep עברו."
else
  echo "❌ ST-02/ST-03 FAIL — יש כשלים לעיל."
  exit 1
fi
