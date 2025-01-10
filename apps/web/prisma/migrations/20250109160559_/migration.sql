/*
  Warnings:

  - You are about to alter the column `price` on the `gift_card_packages` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "gift_card_packages" ALTER COLUMN "price" SET DEFAULT 0,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2),
ALTER COLUMN "duration" SET DEFAULT 0;
