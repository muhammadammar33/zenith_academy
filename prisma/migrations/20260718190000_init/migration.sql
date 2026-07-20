CREATE TYPE "RegistrationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED');
CREATE TYPE "EmailStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

CREATE TABLE "Domain" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "line" TEXT NOT NULL,
  "about" TEXT NOT NULL,
  "outcome" TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "imageAlt" TEXT NOT NULL,
  "themes" TEXT[],
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isPublished" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Course" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "about" TEXT NOT NULL,
  "takeaway" TEXT NOT NULL,
  "audience" TEXT NOT NULL,
  "duration" TEXT NOT NULL,
  "mode" TEXT NOT NULL,
  "status" TEXT NOT NULL,
  "fee" INTEGER NOT NULL,
  "seats" TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "imageAlt" TEXT NOT NULL,
  "prerequisites" TEXT[],
  "sessions" TEXT[],
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "isPublished" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "domainId" TEXT NOT NULL,
  CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Registration" (
  "id" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "cnic" TEXT NOT NULL,
  "dateOfBirth" TIMESTAMP(3) NOT NULL,
  "gender" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "institution" TEXT NOT NULL,
  "degreeProgram" TEXT NOT NULL,
  "studyYear" TEXT NOT NULL,
  "paymentMethod" TEXT NOT NULL,
  "receiptUrl" TEXT NOT NULL,
  "receiptPublicId" TEXT NOT NULL,
  "status" "RegistrationStatus" NOT NULL DEFAULT 'PENDING',
  "adminNotes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "courseId" TEXT NOT NULL,
  CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "MediaAsset" (
  "id" TEXT NOT NULL,
  "publicId" TEXT NOT NULL,
  "secureUrl" TEXT NOT NULL,
  "resourceType" TEXT NOT NULL,
  "format" TEXT,
  "width" INTEGER,
  "height" INTEGER,
  "bytes" INTEGER,
  "altText" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SiteSetting" (
  "key" TEXT NOT NULL,
  "value" JSONB NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("key")
);

CREATE TABLE "EmailLog" (
  "id" TEXT NOT NULL,
  "recipient" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "status" "EmailStatus" NOT NULL DEFAULT 'PENDING',
  "error" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "sentAt" TIMESTAMP(3),
  CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Domain_name_key" ON "Domain"("name");
CREATE UNIQUE INDEX "Domain_slug_key" ON "Domain"("slug");
CREATE INDEX "Domain_isPublished_sortOrder_idx" ON "Domain"("isPublished", "sortOrder");
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");
CREATE INDEX "Course_domainId_isPublished_sortOrder_idx" ON "Course"("domainId", "isPublished", "sortOrder");
CREATE INDEX "Registration_status_createdAt_idx" ON "Registration"("status", "createdAt");
CREATE INDEX "Registration_email_idx" ON "Registration"("email");
CREATE INDEX "Registration_courseId_idx" ON "Registration"("courseId");
CREATE UNIQUE INDEX "MediaAsset_publicId_key" ON "MediaAsset"("publicId");
CREATE INDEX "MediaAsset_createdAt_idx" ON "MediaAsset"("createdAt");
CREATE INDEX "EmailLog_status_createdAt_idx" ON "EmailLog"("status", "createdAt");

ALTER TABLE "Course"
  ADD CONSTRAINT "Course_domainId_fkey"
  FOREIGN KEY ("domainId") REFERENCES "Domain"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Registration"
  ADD CONSTRAINT "Registration_courseId_fkey"
  FOREIGN KEY ("courseId") REFERENCES "Course"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
