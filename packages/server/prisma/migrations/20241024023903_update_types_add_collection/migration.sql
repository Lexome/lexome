-- CreateTable
CREATE TABLE "book_collection" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "book_collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_bookTobook_collection" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_bookTobook_collection_AB_unique" ON "_bookTobook_collection"("A", "B");

-- CreateIndex
CREATE INDEX "_bookTobook_collection_B_index" ON "_bookTobook_collection"("B");

-- AddForeignKey
ALTER TABLE "book_collection" ADD CONSTRAINT "book_collection_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_bookTobook_collection" ADD CONSTRAINT "_bookTobook_collection_A_fkey" FOREIGN KEY ("A") REFERENCES "book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_bookTobook_collection" ADD CONSTRAINT "_bookTobook_collection_B_fkey" FOREIGN KEY ("B") REFERENCES "book_collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
