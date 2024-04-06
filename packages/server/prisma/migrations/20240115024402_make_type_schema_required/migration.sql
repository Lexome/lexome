/*
  Warnings:

  - Made the column `schema` on table `enhancement_type` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "enhancement_type" ALTER COLUMN "schema" SET NOT NULL;
