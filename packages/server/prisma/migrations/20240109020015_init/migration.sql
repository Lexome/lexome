-- CreateTable
CREATE TABLE "author" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "user_id" BIGINT,

    CONSTRAINT "author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "book" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "author_id" BIGINT,

    CONSTRAINT "book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enhancement" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "owner_id" BIGINT NOT NULL,
    "title" TEXT NOT NULL,
    "book_id" BIGINT NOT NULL,
    "enhancement_type_id" BIGINT,
    "coalesced_data" JSONB,
    "latest_included_event_id" BIGINT,

    CONSTRAINT "enhancement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enhancement_event" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enhancement_id" BIGINT,
    "latest_event_for_id" BIGINT,
    "event_body" JSONB,

    CONSTRAINT "enhancement_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enhancement_type" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "schema" JSONB,

    CONSTRAINT "enhancement_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lexome_user" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profile_picture" TEXT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "is_admin" BOOLEAN DEFAULT false,

    CONSTRAINT "lexome_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "book_id_key" ON "book"("id");

-- CreateIndex
CREATE UNIQUE INDEX "enhancement_id_key" ON "enhancement"("id");

-- CreateIndex
CREATE UNIQUE INDEX "lexome_user_id_key" ON "lexome_user"("id");

-- AddForeignKey
ALTER TABLE "author" ADD CONSTRAINT "author_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "lexome_user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "book" ADD CONSTRAINT "book_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "enhancement" ADD CONSTRAINT "enhancement_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "book"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enhancement" ADD CONSTRAINT "enhancement_enhancement_type_id_fkey" FOREIGN KEY ("enhancement_type_id") REFERENCES "enhancement_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enhancement" ADD CONSTRAINT "enhancement_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "lexome_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enhancement" ADD CONSTRAINT "enhancement_latest_included_event_id_fkey" FOREIGN KEY ("latest_included_event_id") REFERENCES "enhancement_event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enhancement_event" ADD CONSTRAINT "enhancement_event_enhancement_id_fkey" FOREIGN KEY ("enhancement_id") REFERENCES "enhancement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
