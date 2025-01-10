/*
  Warnings:

  - You are about to drop the column `member_id` on the `browser_histories` table. All the data in the column will be lost.
  - You are about to drop the column `member_id` on the `gift_cards` table. All the data in the column will be lost.
  - You are about to drop the column `memberId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `memberId` on the `view_histories` table. All the data in the column will be lost.
  - You are about to drop the `admins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `members` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `view_histories` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "browser_histories" DROP CONSTRAINT "browser_histories_member_id_fkey";

-- DropForeignKey
ALTER TABLE "gift_cards" DROP CONSTRAINT "gift_cards_member_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_memberId_fkey";

-- DropForeignKey
ALTER TABLE "view_histories" DROP CONSTRAINT "view_histories_memberId_fkey";

-- DropIndex
DROP INDEX "browser_histories_member_id_idx";

-- DropIndex
DROP INDEX "gift_cards_member_id_idx";

-- DropIndex
DROP INDEX "orders_memberId_idx";

-- DropIndex
DROP INDEX "view_histories_memberId_idx";

-- AlterTable
ALTER TABLE "browser_histories" DROP COLUMN "member_id",
ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "gift_cards" DROP COLUMN "member_id",
ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "memberId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "view_histories" DROP COLUMN "memberId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "admins";

-- DropTable
DROP TABLE "members";

-- DropEnum
DROP TYPE "MemberStatus";

-- CreateIndex
CREATE INDEX "browser_histories_user_id_idx" ON "browser_histories"("user_id");

-- CreateIndex
CREATE INDEX "gift_cards_user_id_idx" ON "gift_cards"("user_id");

-- CreateIndex
CREATE INDEX "orders_userId_idx" ON "orders"("userId");

-- CreateIndex
CREATE INDEX "view_histories_userId_idx" ON "view_histories"("userId");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "view_histories" ADD CONSTRAINT "view_histories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_cards" ADD CONSTRAINT "gift_cards_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "browser_histories" ADD CONSTRAINT "browser_histories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
