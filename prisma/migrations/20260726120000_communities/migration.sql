-- AlterTable
ALTER TABLE "Registration" ADD COLUMN "joinCommunity" BOOLEAN NOT NULL DEFAULT false;

-- CreateEnum
CREATE TYPE "CommunityInterestSource" AS ENUM ('REGISTRATION', 'COMMUNITY_FORM');

-- CreateTable
CREATE TABLE "CommunityInterest" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "domainName" TEXT NOT NULL,
    "source" "CommunityInterestSource" NOT NULL DEFAULT 'COMMUNITY_FORM',
    "registrationId" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "domainId" TEXT NOT NULL,

    CONSTRAINT "CommunityInterest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CommunityInterest_domainId_createdAt_idx" ON "CommunityInterest"("domainId", "createdAt");

-- CreateIndex
CREATE INDEX "CommunityInterest_email_idx" ON "CommunityInterest"("email");

-- CreateIndex
CREATE INDEX "CommunityInterest_createdAt_idx" ON "CommunityInterest"("createdAt");

-- AddForeignKey
ALTER TABLE "CommunityInterest" ADD CONSTRAINT "CommunityInterest_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "Domain"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
