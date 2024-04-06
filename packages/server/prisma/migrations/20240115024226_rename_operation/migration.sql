/*
  Warnings:

  - You are about to drop the column `event_body` on the `enhancement_event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "enhancement_event" DROP COLUMN "event_body",
ADD COLUMN     "operation" JSONB;
