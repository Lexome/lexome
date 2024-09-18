/*
  Warnings:

  - You are about to drop the column `type_id` on the `enhancement_event` table. All the data in the column will be lost.
  - You are about to drop the `_enhancementToenhancement_type` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `enhancement_type` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `publisher_id` to the `enhancement` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `enhancement_event` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PublisherType" AS ENUM ('self_published', 'traditional');

-- CreateEnum
CREATE TYPE "EnhancementType" AS ENUM ('summary');

-- DropForeignKey
ALTER TABLE "_enhancementToenhancement_type" DROP CONSTRAINT "_enhancementToenhancement_type_A_fkey";

-- DropForeignKey
ALTER TABLE "_enhancementToenhancement_type" DROP CONSTRAINT "_enhancementToenhancement_type_B_fkey";

-- DropForeignKey
ALTER TABLE "enhancement_event" DROP CONSTRAINT "enhancement_event_type_id_fkey";

-- AlterTable
ALTER TABLE "book" ADD COLUMN     "author_names_cached" TEXT;

-- AlterTable
ALTER TABLE "enhancement" ADD COLUMN     "grant_admin_to_publisher" BOOLEAN DEFAULT true,
ADD COLUMN     "included_types" "EnhancementType"[],
ADD COLUMN     "publisher_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "enhancement_event" DROP COLUMN "type_id",
ADD COLUMN     "type" "EnhancementType" NOT NULL;

-- DropTable
DROP TABLE "_enhancementToenhancement_type";

-- DropTable
DROP TABLE "enhancement_type";

-- CreateTable
CREATE TABLE "publisher" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "type" "PublisherType" NOT NULL,

    CONSTRAINT "publisher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_authorTopublisher" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_bookTopublisher" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_authorTopublisher_AB_unique" ON "_authorTopublisher"("A", "B");

-- CreateIndex
CREATE INDEX "_authorTopublisher_B_index" ON "_authorTopublisher"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_bookTopublisher_AB_unique" ON "_bookTopublisher"("A", "B");

-- CreateIndex
CREATE INDEX "_bookTopublisher_B_index" ON "_bookTopublisher"("B");

-- AddForeignKey
ALTER TABLE "enhancement" ADD CONSTRAINT "enhancement_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "publisher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_authorTopublisher" ADD CONSTRAINT "_authorTopublisher_A_fkey" FOREIGN KEY ("A") REFERENCES "author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_authorTopublisher" ADD CONSTRAINT "_authorTopublisher_B_fkey" FOREIGN KEY ("B") REFERENCES "publisher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_bookTopublisher" ADD CONSTRAINT "_bookTopublisher_A_fkey" FOREIGN KEY ("A") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_bookTopublisher" ADD CONSTRAINT "_bookTopublisher_B_fkey" FOREIGN KEY ("B") REFERENCES "publisher"("id") ON DELETE CASCADE ON UPDATE CASCADE;
