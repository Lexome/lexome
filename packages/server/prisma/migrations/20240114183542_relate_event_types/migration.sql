/*
  Warnings:

  - You are about to drop the column `enhancement_type_id` on the `enhancement` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `enhancement_type` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slug]` on the table `enhancement_type` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[displayName]` on the table `enhancement_type` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `enhancement_type` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "enhancement" DROP CONSTRAINT "enhancement_enhancement_type_id_fkey";

-- AlterTable
ALTER TABLE "enhancement" DROP COLUMN "enhancement_type_id";

-- AlterTable
ALTER TABLE "enhancement_event" ADD COLUMN     "created_by_id" BIGINT;

-- AlterTable
ALTER TABLE "enhancement_type" DROP COLUMN "name",
ADD COLUMN     "displayName" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "phone" TEXT,
ADD COLUMN     "verification_code" TEXT;

-- CreateTable
CREATE TABLE "_enhancementToenhancement_type" (
    "A" BIGINT NOT NULL,
    "B" BIGINT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_enhancementToenhancement_type_AB_unique" ON "_enhancementToenhancement_type"("A", "B");

-- CreateIndex
CREATE INDEX "_enhancementToenhancement_type_B_index" ON "_enhancementToenhancement_type"("B");

-- CreateIndex
CREATE UNIQUE INDEX "enhancement_type_slug_key" ON "enhancement_type"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "enhancement_type_displayName_key" ON "enhancement_type"("displayName");

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_key" ON "user"("phone");

-- AddForeignKey
ALTER TABLE "enhancement_event" ADD CONSTRAINT "enhancement_event_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_enhancementToenhancement_type" ADD CONSTRAINT "_enhancementToenhancement_type_A_fkey" FOREIGN KEY ("A") REFERENCES "enhancement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_enhancementToenhancement_type" ADD CONSTRAINT "_enhancementToenhancement_type_B_fkey" FOREIGN KEY ("B") REFERENCES "enhancement_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;
