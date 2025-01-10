/*
  Warnings:

  - You are about to drop the column `vipExpired` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "vipExpired",
ADD COLUMN     "vipExpiredAt" TIMESTAMP(3);
