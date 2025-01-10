/*
  Warnings:

  - You are about to drop the column `name` on the `photo_collections` table. All the data in the column will be lost.
  - You are about to drop the column `photoId` on the `view_histories` table. All the data in the column will be lost.
  - You are about to drop the `photos` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `title` to the `photo_collections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `photoCollectionId` to the `view_histories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "photos" DROP CONSTRAINT "photos_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "view_histories" DROP CONSTRAINT "view_histories_photoId_fkey";

-- DropIndex
DROP INDEX "view_histories_photoId_idx";

-- AlterTable
ALTER TABLE "photo_collections" DROP COLUMN "name",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "paidUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "previewUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "sort" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "subtitle" TEXT,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "view_histories" DROP COLUMN "photoId",
ADD COLUMN     "photoCollectionId" TEXT NOT NULL;

-- DropTable
DROP TABLE "photos";

-- CreateIndex
CREATE INDEX "view_histories_photoCollectionId_idx" ON "view_histories"("photoCollectionId");

-- AddForeignKey
ALTER TABLE "view_histories" ADD CONSTRAINT "view_histories_photoCollectionId_fkey" FOREIGN KEY ("photoCollectionId") REFERENCES "photo_collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
