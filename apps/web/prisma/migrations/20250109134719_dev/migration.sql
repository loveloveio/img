/*
  Warnings:

  - You are about to drop the column `packageId` on the `gift_cards` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "gift_cards" DROP CONSTRAINT "gift_cards_packageId_fkey";

-- DropIndex
DROP INDEX "gift_cards_packageId_idx";

-- AlterTable
ALTER TABLE "gift_cards" DROP COLUMN "packageId";

-- CreateIndex
CREATE INDEX "gift_cards_giftCardPackageId_idx" ON "gift_cards"("giftCardPackageId");

-- AddForeignKey
ALTER TABLE "gift_cards" ADD CONSTRAINT "gift_cards_giftCardPackageId_fkey" FOREIGN KEY ("giftCardPackageId") REFERENCES "gift_card_packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
