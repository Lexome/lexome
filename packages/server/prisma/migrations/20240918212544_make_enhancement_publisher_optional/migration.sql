-- DropForeignKey
ALTER TABLE "enhancement" DROP CONSTRAINT "enhancement_publisher_id_fkey";

-- AlterTable
ALTER TABLE "enhancement" ALTER COLUMN "publisher_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "enhancement" ADD CONSTRAINT "enhancement_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "publisher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
