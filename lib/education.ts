export const EDUCATION_LEVELS = [
  "School",
  "College",
  "Graduation",
  "Post Graduation",
] as const;

export type EducationLevel = (typeof EDUCATION_LEVELS)[number];

export const SCHOOL_CLASSES = [
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
] as const;

export const COLLEGE_CLASSES = [
  "1st year (11th)",
  "2nd year (12th)",
] as const;

export const UNIVERSITY_STUDY_YEARS = [
  "1st semester",
  "2nd semester",
  "3rd semester",
  "4th semester",
  "5th semester",
  "6th semester",
  "7th semester",
  "8th semester",
  "9th semester",
  "10th semester",
  "Graduation",
] as const;

export const POSTGRAD_PROGRAM_TYPES = [
  "MS",
  "MPhil",
  "MBA",
  "M.Ed",
  "MA",
  "MSc",
  "PhD",
  "Postgraduate diploma",
  "Other",
] as const;

export const POSTGRAD_STUDY_YEARS = [
  "1st semester",
  "2nd semester",
  "3rd semester",
  "4th semester",
  "5th semester",
  "6th semester",
  "Thesis / research",
  "Completed",
] as const;

export function isSchoolOrCollege(level: string) {
  return level === "School" || level === "College";
}

export function formatPostgradProgram(programType: string, fieldOfStudy: string) {
  return `${programType} — ${fieldOfStudy.trim()}`;
}
