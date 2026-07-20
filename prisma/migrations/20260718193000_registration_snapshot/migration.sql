ALTER TABLE "Registration"
  ADD COLUMN "courseTitle" TEXT,
  ADD COLUMN "courseFee" INTEGER,
  ADD COLUMN "courseMode" TEXT;

UPDATE "Registration"
SET
  "courseTitle" = "Course"."title",
  "courseFee" = "Course"."fee",
  "courseMode" = "Course"."mode"
FROM "Course"
WHERE "Registration"."courseId" = "Course"."id";

ALTER TABLE "Registration"
  ALTER COLUMN "courseTitle" SET NOT NULL,
  ALTER COLUMN "courseFee" SET NOT NULL,
  ALTER COLUMN "courseMode" SET NOT NULL;
