-- CreateEnum
CREATE TYPE "EmailSubscriptionType" AS ENUM ('major_updates');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EnhancementType" ADD VALUE 'chat';
ALTER TYPE "EnhancementType" ADD VALUE 'narration';

-- CreateTable
CREATE TABLE "email_subscription" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "types" "EmailSubscriptionType"[],

    CONSTRAINT "email_subscription_pkey" PRIMARY KEY ("id")
);
