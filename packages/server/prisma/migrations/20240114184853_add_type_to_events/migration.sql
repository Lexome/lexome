/*
  Warnings:

  - A unique constraint covering the columns `[latest_included_event_id]` on the table `enhancement` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `event_type_id` to the `enhancement_event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "enhancement_event" ADD COLUMN     "event_type_id" BIGINT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "enhancement_latest_included_event_id_key" ON "enhancement"("latest_included_event_id");

-- AddForeignKey
ALTER TABLE "enhancement_event" ADD CONSTRAINT "enhancement_event_event_type_id_fkey" FOREIGN KEY ("event_type_id") REFERENCES "enhancement_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
