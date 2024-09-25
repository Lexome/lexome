/*
  Warnings:

  - You are about to drop the `enhancement_event` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "enhancement_event" DROP CONSTRAINT "enhancement_event_created_by_id_fkey";

-- DropForeignKey
ALTER TABLE "enhancement_event" DROP CONSTRAINT "enhancement_event_enhancement_id_fkey";

-- DropTable
DROP TABLE "enhancement_event";

-- CreateTable
CREATE TABLE "enhancement_patch" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "operation" JSONB NOT NULL,
    "enhancement_id" TEXT NOT NULL,
    "created_by_id" TEXT,
    "type" "EnhancementType" NOT NULL,

    CONSTRAINT "enhancement_patch_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "enhancement_patch" ADD CONSTRAINT "enhancement_patch_enhancement_id_fkey" FOREIGN KEY ("enhancement_id") REFERENCES "enhancement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enhancement_patch" ADD CONSTRAINT "enhancement_patch_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
