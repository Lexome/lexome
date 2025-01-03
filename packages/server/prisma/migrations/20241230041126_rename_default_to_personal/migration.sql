/*
  Warnings:

  - You are about to drop the column `is_default` on the `enhancement` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "enhancement" DROP COLUMN "is_default",
ADD COLUMN     "is_personal" BOOLEAN DEFAULT false;
