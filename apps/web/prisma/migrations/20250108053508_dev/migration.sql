/*
  Warnings:

  - The primary key for the `photo_collections` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `photo_collections` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The required column `uuid` was added to the `photo_collections` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `photoCollectionId` on the `view_histories` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "view_histories" DROP CONSTRAINT "view_histories_photoCollectionId_fkey";

-- AlterTable
ALTER TABLE "photo_collections" DROP CONSTRAINT "photo_collections_pkey",
ADD COLUMN     "uuid" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" BIGSERIAL NOT NULL,
ADD CONSTRAINT "photo_collections_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "view_histories" DROP COLUMN "photoCollectionId",
ADD COLUMN     "photoCollectionId" BIGINT NOT NULL;

-- CreateIndex
CREATE INDEX "view_histories_photoCollectionId_idx" ON "view_histories"("photoCollectionId");

-- AddForeignKey
ALTER TABLE "view_histories" ADD CONSTRAINT "view_histories_photoCollectionId_fkey" FOREIGN KEY ("photoCollectionId") REFERENCES "photo_collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
