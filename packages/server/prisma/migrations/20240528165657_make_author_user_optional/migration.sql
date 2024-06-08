-- DropForeignKey
ALTER TABLE "author" DROP CONSTRAINT "author_user_id_fkey";

-- AlterTable
ALTER TABLE "author" ALTER COLUMN "user_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "author" ADD CONSTRAINT "author_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
