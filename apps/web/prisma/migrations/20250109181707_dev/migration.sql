-- DropForeignKey
ALTER TABLE "account" DROP CONSTRAINT "account_userId_fkey";

-- DropForeignKey
ALTER TABLE "browser_histories" DROP CONSTRAINT "browser_histories_user_id_fkey";

-- DropForeignKey
ALTER TABLE "gift_cards" DROP CONSTRAINT "gift_cards_giftCardPackageId_fkey";

-- DropForeignKey
ALTER TABLE "gift_cards" DROP CONSTRAINT "gift_cards_user_id_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_paymentMethodId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_userId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_vipPackageId_fkey";

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_userId_fkey";

-- DropForeignKey
ALTER TABLE "site_clicks" DROP CONSTRAINT "site_clicks_siteId_fkey";

-- DropForeignKey
ALTER TABLE "view_histories" DROP CONSTRAINT "view_histories_photoCollectionId_fkey";

-- DropForeignKey
ALTER TABLE "view_histories" DROP CONSTRAINT "view_histories_userId_fkey";
