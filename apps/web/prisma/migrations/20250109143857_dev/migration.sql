/*
  Warnings:

  - You are about to drop the column `description` on the `service_endpoints` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `service_endpoints` table. All the data in the column will be lost.
  - Added the required column `name` to the `service_endpoints` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "service_endpoints" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "name" TEXT NOT NULL;
