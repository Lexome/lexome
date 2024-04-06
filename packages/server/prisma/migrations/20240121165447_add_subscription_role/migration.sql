/*
  Warnings:

  - You are about to drop the column `owner_id` on the `enhancement` table. All the data in the column will be lost.
  - You are about to drop the `_users` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'user');

-- DropForeignKey
ALTER TABLE "_users" DROP CONSTRAINT "_users_A_fkey";

-- DropForeignKey
ALTER TABLE "_users" DROP CONSTRAINT "_users_B_fkey";

-- DropForeignKey
ALTER TABLE "enhancement" DROP CONSTRAINT "enhancement_owner_id_fkey";

-- AlterTable
ALTER TABLE "enhancement" DROP COLUMN "owner_id";

-- DropTable
DROP TABLE "_users";

-- CreateTable
CREATE TABLE "subscription" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,
    "enhancement_id" TEXT NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "subscription_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_enhancement_id_fkey" FOREIGN KEY ("enhancement_id") REFERENCES "enhancement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
