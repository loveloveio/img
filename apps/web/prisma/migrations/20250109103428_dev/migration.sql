/*
  Warnings:

  - You are about to drop the column `allowDevice` on the `tags` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tags" DROP COLUMN "allowDevice",
ADD COLUMN     "allow_devices" TEXT[] DEFAULT ARRAY[]::TEXT[];
