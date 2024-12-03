/*
  Warnings:

  - You are about to drop the `_bookTobook_collection` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `book_collection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_bookTobook_collection" DROP CONSTRAINT "_bookTobook_collection_A_fkey";

-- DropForeignKey
ALTER TABLE "_bookTobook_collection" DROP CONSTRAINT "_bookTobook_collection_B_fkey";

-- DropForeignKey
ALTER TABLE "book_collection" DROP CONSTRAINT "book_collection_user_id_fkey";

-- DropTable
DROP TABLE "_bookTobook_collection";

-- DropTable
DROP TABLE "book_collection";

-- CreateTable
CREATE TABLE "user_collection" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "user_collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_bookTouser_collection" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_bookTouser_collection_AB_unique" ON "_bookTouser_collection"("A", "B");

-- CreateIndex
CREATE INDEX "_bookTouser_collection_B_index" ON "_bookTouser_collection"("B");

-- AddForeignKey
ALTER TABLE "user_collection" ADD CONSTRAINT "user_collection_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_bookTouser_collection" ADD CONSTRAINT "_bookTouser_collection_A_fkey" FOREIGN KEY ("A") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_bookTouser_collection" ADD CONSTRAINT "_bookTouser_collection_B_fkey" FOREIGN KEY ("B") REFERENCES "user_collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
