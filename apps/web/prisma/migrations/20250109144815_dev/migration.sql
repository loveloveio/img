/*
  Warnings:

  - You are about to drop the column `sort` on the `service_endpoints` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "service_endpoints" DROP COLUMN "sort",
ADD COLUMN     "remark" TEXT;
