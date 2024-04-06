/*
  Warnings:

  - You are about to drop the column `latest_included_event_id` on the `enhancement` table. All the data in the column will be lost.
  - You are about to drop the column `latest_event_for_id` on the `enhancement_event` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "enhancement" DROP CONSTRAINT "enhancement_latest_included_event_id_fkey";

-- DropIndex
DROP INDEX "enhancement_latest_included_event_id_key";

-- AlterTable
ALTER TABLE "enhancement" DROP COLUMN "latest_included_event_id",
ADD COLUMN     "coalesced_timestamp" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "enhancement_event" DROP COLUMN "latest_event_for_id";
