/*
  Warnings:

  - You are about to drop the `_authorTopublisher` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PublisherRole" AS ENUM ('admin', 'user');

-- DropForeignKey
ALTER TABLE "_authorTopublisher" DROP CONSTRAINT "_authorTopublisher_A_fkey";

-- DropForeignKey
ALTER TABLE "_authorTopublisher" DROP CONSTRAINT "_authorTopublisher_B_fkey";

-- DropTable
DROP TABLE "_authorTopublisher";

-- CreateTable
CREATE TABLE "publisher_author" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "publisher_id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "publisher_author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publisher_user" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "role" "PublisherRole" NOT NULL,
    "publisher_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "publisher_user_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "publisher_author" ADD CONSTRAINT "publisher_author_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "publisher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publisher_author" ADD CONSTRAINT "publisher_author_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publisher_user" ADD CONSTRAINT "publisher_user_publisher_id_fkey" FOREIGN KEY ("publisher_id") REFERENCES "publisher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publisher_user" ADD CONSTRAINT "publisher_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
