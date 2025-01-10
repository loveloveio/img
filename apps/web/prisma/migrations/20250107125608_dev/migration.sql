-- AlterTable
ALTER TABLE "photos" ADD COLUMN     "paidUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "previewUrls" TEXT[] DEFAULT ARRAY[]::TEXT[];
