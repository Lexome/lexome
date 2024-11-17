/*
  Warnings:

  - The values [chat] on the enum `EnhancementType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EnhancementType_new" AS ENUM ('summary', 'discussion', 'narration');
ALTER TABLE "enhancement" ALTER COLUMN "included_types" TYPE "EnhancementType_new"[] USING ("included_types"::text::"EnhancementType_new"[]);
ALTER TABLE "enhancement_patch" ALTER COLUMN "type" TYPE "EnhancementType_new" USING ("type"::text::"EnhancementType_new");
ALTER TYPE "EnhancementType" RENAME TO "EnhancementType_old";
ALTER TYPE "EnhancementType_new" RENAME TO "EnhancementType";
DROP TYPE "EnhancementType_old";
COMMIT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "email" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
