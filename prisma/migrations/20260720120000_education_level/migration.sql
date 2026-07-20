ALTER TABLE "Registration"
  ADD COLUMN "educationLevel" TEXT;

UPDATE "Registration"
SET "educationLevel" = 'Graduation'
WHERE "educationLevel" IS NULL;

ALTER TABLE "Registration"
  ALTER COLUMN "educationLevel" SET NOT NULL;

ALTER TABLE "Registration"
  ALTER COLUMN "degreeProgram" DROP NOT NULL;
