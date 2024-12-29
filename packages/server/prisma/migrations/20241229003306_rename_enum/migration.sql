/*
  Warnings:

  - The values [major_updates] on the enum `EmailSubscriptionType` will be removed. If these variants are still used in the database, this will fail.
  - The values [summary,notes] on the enum `EnhancementType` will be removed. If these variants are still used in the database, this will fail.
  - The values [admin,user] on the enum `PublisherRole` will be removed. If these variants are still used in the database, this will fail.
  - The values [self_published,traditional] on the enum `PublisherType` will be removed. If these variants are still used in the database, this will fail.
  - The values [admin,user] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EmailSubscriptionType_new" AS ENUM ('MAJOR_UPDATES');
ALTER TABLE "email_subscription" ALTER COLUMN "types" TYPE "EmailSubscriptionType_new"[] USING ("types"::text::"EmailSubscriptionType_new"[]);
ALTER TYPE "EmailSubscriptionType" RENAME TO "EmailSubscriptionType_old";
ALTER TYPE "EmailSubscriptionType_new" RENAME TO "EmailSubscriptionType";
DROP TYPE "EmailSubscriptionType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "EnhancementType_new" AS ENUM ('SUMMARY', 'NOTES', 'NARRATION', 'narration');
ALTER TABLE "enhancement" ALTER COLUMN "included_types" TYPE "EnhancementType_new"[] USING ("included_types"::text::"EnhancementType_new"[]);
ALTER TABLE "enhancement_patch" ALTER COLUMN "type" TYPE "EnhancementType_new" USING ("type"::text::"EnhancementType_new");
ALTER TYPE "EnhancementType" RENAME TO "EnhancementType_old";
ALTER TYPE "EnhancementType_new" RENAME TO "EnhancementType";
DROP TYPE "EnhancementType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PublisherRole_new" AS ENUM ('ADMIN', 'USER');
ALTER TABLE "publisher_user" ALTER COLUMN "role" TYPE "PublisherRole_new" USING ("role"::text::"PublisherRole_new");
ALTER TYPE "PublisherRole" RENAME TO "PublisherRole_old";
ALTER TYPE "PublisherRole_new" RENAME TO "PublisherRole";
DROP TYPE "PublisherRole_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PublisherType_new" AS ENUM ('TRADITIONAL', 'SELF_PUBLISHED');
ALTER TABLE "publisher" ALTER COLUMN "type" TYPE "PublisherType_new" USING ("type"::text::"PublisherType_new");
ALTER TYPE "PublisherType" RENAME TO "PublisherType_old";
ALTER TYPE "PublisherType_new" RENAME TO "PublisherType";
DROP TYPE "PublisherType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'USER');
ALTER TABLE "subscription" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
COMMIT;

-- AlterTable
ALTER TABLE "book" ADD COLUMN     "thumbnail_url" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "personalization" JSONB;
