/*
  Warnings:

  - You are about to drop the column `hashIndex` on the `book` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "book" DROP COLUMN "hashIndex",
ADD COLUMN     "hash_index" JSONB;
