/*
  Warnings:

  - You are about to drop the column `cover_url` on the `photo_collections` table. All the data in the column will be lost.
  - You are about to drop the column `paidUrls` on the `photo_collections` table. All the data in the column will be lost.
  - You are about to drop the column `previewUrls` on the `photo_collections` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "photo_collections" DROP COLUMN "cover_url",
DROP COLUMN "paidUrls",
DROP COLUMN "previewUrls",
ADD COLUMN     "cover" TEXT DEFAULT '',
ADD COLUMN     "paidImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "previewImages" TEXT[] DEFAULT ARRAY[]::TEXT[];
