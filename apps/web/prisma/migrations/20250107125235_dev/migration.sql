/*
  Warnings:

  - The primary key for the `photo_collections` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `photos` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "photos" DROP CONSTRAINT "photos_collectionId_fkey";

-- DropForeignKey
ALTER TABLE "view_histories" DROP CONSTRAINT "view_histories_photoId_fkey";

-- AlterTable
ALTER TABLE "photo_collections" DROP CONSTRAINT "photo_collections_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "deleted_at" DROP NOT NULL,
ADD CONSTRAINT "photo_collections_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "photo_collections_id_seq";

-- AlterTable
ALTER TABLE "photos" DROP CONSTRAINT "photos_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "collectionId" SET DATA TYPE TEXT,
ADD CONSTRAINT "photos_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "photos_id_seq";

-- AlterTable
ALTER TABLE "view_histories" ALTER COLUMN "photoId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "photos" ADD CONSTRAINT "photos_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "photo_collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "view_histories" ADD CONSTRAINT "view_histories_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "photos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
