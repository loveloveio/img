/*
  Warnings:

  - Added the required column `no` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "no" TEXT NOT NULL,
ALTER COLUMN "out_trade_no" DROP NOT NULL;
