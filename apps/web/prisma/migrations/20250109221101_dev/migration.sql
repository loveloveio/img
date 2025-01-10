-- CreateTable
CREATE TABLE "photo_collection_favorites" (
    "id" BIGSERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "photoCollectionId" BIGINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "photo_collection_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "photo_collection_favorites_userId_idx" ON "photo_collection_favorites"("userId");

-- CreateIndex
CREATE INDEX "photo_collection_favorites_photoCollectionId_idx" ON "photo_collection_favorites"("photoCollectionId");
