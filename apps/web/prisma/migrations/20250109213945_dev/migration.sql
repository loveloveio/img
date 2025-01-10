/*
  Warnings:

  - You are about to alter the column `paid_amount` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "paid_amount" SET DEFAULT 0,
ALTER COLUMN "paid_amount" SET DATA TYPE DECIMAL(10,2);
