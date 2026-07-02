export function marksToGradePoint(marks) {
  if (marks >= 90) return 10;
  if (marks >= 80) return 9;
  if (marks >= 70) return 8;
  if (marks >= 60) return 7;
  if (marks >= 50) return 6;
  if (marks >= 45) return 5;
  if (marks >= 40) return 4;
  return 0;
}

export function computeSgpa(subjects) {
  let totalCredits = 0;
  let weighted = 0;

  for (const s of subjects) {
    totalCredits += s.credits;
    weighted += s.credits * marksToGradePoint(s.marks);
  }

  if (totalCredits === 0) return 0;
  return Number((weighted / totalCredits).toFixed(2));
}

