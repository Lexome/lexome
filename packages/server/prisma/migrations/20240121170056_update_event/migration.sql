/*
  Warnings:

  - You are about to drop the column `event_type_id` on the `enhancement_event` table. All the data in the column will be lost.
  - Added the required column `type_id` to the `enhancement_event` table without a default value. This is not possible if the table is not empty.
  - Made the column `enhancement_id` on table `enhancement_event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_by_id` on table `enhancement_event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `operation` on table `enhancement_event` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "enhancement_event" DROP CONSTRAINT "enhancement_event_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "enhancement_event" DROP CONSTRAINT "enhancement_event_enhancement_id_fkey";

-- DropForeignKey
ALTER TABLE "enhancement_event" DROP CONSTRAINT "enhancement_event_event_type_id_fkey";

-- AlterTable
ALTER TABLE "enhancement_event" DROP COLUMN "event_type_id",
ADD COLUMN     "type_id" TEXT NOT NULL,
ALTER COLUMN "enhancement_id" SET NOT NULL,
ALTER COLUMN "created_by_id" SET NOT NULL,
ALTER COLUMN "operation" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "enhancement_event" ADD CONSTRAINT "enhancement_event_enhancement_id_fkey" FOREIGN KEY ("enhancement_id") REFERENCES "enhancement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enhancement_event" ADD CONSTRAINT "enhancement_event_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enhancement_event" ADD CONSTRAINT "enhancement_event_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "enhancement_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
