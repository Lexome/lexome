/*
  Warnings:

  - You are about to drop the column `schema` on the `enhancement_type` table. All the data in the column will be lost.
  - Added the required column `schemaName` to the `enhancement_type` table without a default value. This is not possible if the table is not empty.
  - Made the column `displayName` on table `enhancement_type` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "enhancement_type" DROP COLUMN "schema",
ADD COLUMN     "schemaName" TEXT NOT NULL,
ALTER COLUMN "displayName" SET NOT NULL;
