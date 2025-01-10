-- CreateEnum
CREATE TYPE "PhotoCollectionStatus" AS ENUM ('ENABLED', 'DISABLED');

-- AlterTable
ALTER TABLE "photo_collections" ADD COLUMN     "status" "PhotoCollectionStatus" NOT NULL DEFAULT 'ENABLED',
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
