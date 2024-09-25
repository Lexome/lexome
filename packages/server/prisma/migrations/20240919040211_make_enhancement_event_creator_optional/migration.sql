-- DropForeignKey
ALTER TABLE "enhancement_event" DROP CONSTRAINT "enhancement_event_created_by_id_fkey";

-- AlterTable
ALTER TABLE "enhancement_event" ALTER COLUMN "created_by_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "enhancement_event" ADD CONSTRAINT "enhancement_event_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
