/*
  Warnings:

  - You are about to drop the column `author_id` on the `book` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[assetUrl]` on the table `book` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "book" DROP CONSTRAINT "book_author_id_fkey";

-- AlterTable
ALTER TABLE "book" DROP COLUMN "author_id",
ADD COLUMN     "assetUrl" TEXT,
ADD COLUMN     "coverUrl" TEXT,
ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "genre" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,

    CONSTRAINT "genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_authorTobook" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_bookTogenre" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "genre_name_key" ON "genre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_authorTobook_AB_unique" ON "_authorTobook"("A", "B");

-- CreateIndex
CREATE INDEX "_authorTobook_B_index" ON "_authorTobook"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_bookTogenre_AB_unique" ON "_bookTogenre"("A", "B");

-- CreateIndex
CREATE INDEX "_bookTogenre_B_index" ON "_bookTogenre"("B");

-- CreateIndex
CREATE UNIQUE INDEX "book_assetUrl_key" ON "book"("assetUrl");

-- AddForeignKey
ALTER TABLE "_authorTobook" ADD CONSTRAINT "_authorTobook_A_fkey" FOREIGN KEY ("A") REFERENCES "author"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_authorTobook" ADD CONSTRAINT "_authorTobook_B_fkey" FOREIGN KEY ("B") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_bookTogenre" ADD CONSTRAINT "_bookTogenre_A_fkey" FOREIGN KEY ("A") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_bookTogenre" ADD CONSTRAINT "_bookTogenre_B_fkey" FOREIGN KEY ("B") REFERENCES "genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
