-- CreateEnum
CREATE TYPE "VipPackageStatus" AS ENUM ('ENABLED', 'DISABLED');

-- AlterTable
ALTER TABLE "vip_packages" ADD COLUMN     "status" "VipPackageStatus" NOT NULL DEFAULT 'ENABLED';
