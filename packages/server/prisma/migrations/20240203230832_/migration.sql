/*
  Warnings:

  - You are about to drop the column `assetUrl` on the `book` table. All the data in the column will be lost.
  - You are about to drop the column `coverUrl` on the `book` table. All the data in the column will be lost.
  - You are about to drop the column `displayName` on the `enhancement_type` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[asset_url]` on the table `book` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[display_name]` on the table `enhancement_type` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `display_name` to the `enhancement_type` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "book_assetUrl_key";

-- DropIndex
DROP INDEX "enhancement_type_displayName_key";

-- AlterTable
ALTER TABLE "book" DROP COLUMN "assetUrl",
DROP COLUMN "coverUrl",
ADD COLUMN     "asset_url" TEXT,
ADD COLUMN     "cover_url" TEXT;

-- AlterTable
ALTER TABLE "enhancement_type" DROP COLUMN "displayName",
ADD COLUMN     "display_name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "book_asset_url_key" ON "book"("asset_url");

-- CreateIndex
CREATE UNIQUE INDEX "enhancement_type_display_name_key" ON "enhancement_type"("display_name");
