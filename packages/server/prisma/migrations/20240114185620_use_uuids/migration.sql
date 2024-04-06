/*
  Warnings:

  - The primary key for the `author` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `book` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `enhancement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `enhancement_event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `enhancement_type` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "_enhancementToenhancement_type" DROP CONSTRAINT "_enhancementToenhancement_type_A_fkey";

-- DropForeignKey
ALTER TABLE "_enhancementToenhancement_type" DROP CONSTRAINT "_enhancementToenhancement_type_B_fkey";

-- DropForeignKey
ALTER TABLE "_users" DROP CONSTRAINT "_users_A_fkey";

-- DropForeignKey
ALTER TABLE "_users" DROP CONSTRAINT "_users_B_fkey";

-- DropForeignKey
ALTER TABLE "author" DROP CONSTRAINT "author_user_id_fkey";

-- DropForeignKey
ALTER TABLE "book" DROP CONSTRAINT "book_author_id_fkey";

-- DropForeignKey
ALTER TABLE "enhancement" DROP CONSTRAINT "enhancement_book_id_fkey";

-- DropForeignKey
ALTER TABLE "enhancement" DROP CONSTRAINT "enhancement_latest_included_event_id_fkey";

-- DropForeignKey
ALTER TABLE "enhancement" DROP CONSTRAINT "enhancement_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "enhancement_event" DROP CONSTRAINT "enhancement_event_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "enhancement_event" DROP CONSTRAINT "enhancement_event_enhancement_id_fkey";

-- DropForeignKey
ALTER TABLE "enhancement_event" DROP CONSTRAINT "enhancement_event_event_type_id_fkey";

-- AlterTable
ALTER TABLE "_enhancementToenhancement_type" ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_users" ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "author" DROP CONSTRAINT "author_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "author_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "author_id_seq";

-- AlterTable
ALTER TABLE "book" DROP CONSTRAINT "book_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "author_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "book_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "book_id_seq";

-- AlterTable
ALTER TABLE "enhancement" DROP CONSTRAINT "enhancement_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "owner_id" SET DATA TYPE TEXT,
ALTER COLUMN "book_id" SET DATA TYPE TEXT,
ALTER COLUMN "latest_included_event_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "enhancement_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "enhancement_id_seq";

-- AlterTable
ALTER TABLE "enhancement_event" DROP CONSTRAINT "enhancement_event_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "enhancement_id" SET DATA TYPE TEXT,
ALTER COLUMN "latest_event_for_id" SET DATA TYPE TEXT,
ALTER COLUMN "created_by_id" SET DATA TYPE TEXT,
ALTER COLUMN "event_type_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "enhancement_event_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "enhancement_event_id_seq";

-- AlterTable
ALTER TABLE "enhancement_type" DROP CONSTRAINT "enhancement_type_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "enhancement_type_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "enhancement_type_id_seq";

-- AlterTable
ALTER TABLE "user" DROP CONSTRAINT "user_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "user_id_seq";

-- AddForeignKey
ALTER TABLE "author" ADD CONSTRAINT "author_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "book" ADD CONSTRAINT "book_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "enhancement" ADD CONSTRAINT "enhancement_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enhancement" ADD CONSTRAINT "enhancement_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enhancement" ADD CONSTRAINT "enhancement_latest_included_event_id_fkey" FOREIGN KEY ("latest_included_event_id") REFERENCES "enhancement_event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enhancement_event" ADD CONSTRAINT "enhancement_event_enhancement_id_fkey" FOREIGN KEY ("enhancement_id") REFERENCES "enhancement"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enhancement_event" ADD CONSTRAINT "enhancement_event_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enhancement_event" ADD CONSTRAINT "enhancement_event_event_type_id_fkey" FOREIGN KEY ("event_type_id") REFERENCES "enhancement_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_enhancementToenhancement_type" ADD CONSTRAINT "_enhancementToenhancement_type_A_fkey" FOREIGN KEY ("A") REFERENCES "enhancement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_enhancementToenhancement_type" ADD CONSTRAINT "_enhancementToenhancement_type_B_fkey" FOREIGN KEY ("B") REFERENCES "enhancement_type"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_users" ADD CONSTRAINT "_users_A_fkey" FOREIGN KEY ("A") REFERENCES "enhancement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_users" ADD CONSTRAINT "_users_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
