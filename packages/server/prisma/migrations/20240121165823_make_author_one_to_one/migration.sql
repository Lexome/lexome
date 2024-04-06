/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `author` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[author_id]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Made the column `user_id` on table `author` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "author" DROP CONSTRAINT "author_user_id_fkey";

-- AlterTable
ALTER TABLE "author" ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "author_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "author_user_id_key" ON "author"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_author_id_key" ON "user"("author_id");

-- AddForeignKey
ALTER TABLE "author" ADD CONSTRAINT "author_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
