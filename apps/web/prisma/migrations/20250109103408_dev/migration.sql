-- AlterTable
ALTER TABLE "tags" ADD COLUMN     "allowDevice" TEXT[] DEFAULT ARRAY[]::TEXT[];
