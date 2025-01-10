/*
  Warnings:

  - You are about to drop the column `expired_at` on the `gift_cards` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `vip_packages` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "gift_cards" DROP COLUMN "expired_at";

-- AlterTable
ALTER TABLE "vip_packages" ALTER COLUMN "price" SET DEFAULT 0,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);
