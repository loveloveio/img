-- CreateEnum
CREATE TYPE "GiftCardPackageStatus" AS ENUM ('ENABLED', 'DISABLED');

-- CreateEnum
CREATE TYPE "GiftCardStatus" AS ENUM ('UNUSED', 'USED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "SiteStatus" AS ENUM ('ENABLED', 'DISABLED');

-- CreateEnum
CREATE TYPE "ProxyNodeStatus" AS ENUM ('ENABLED', 'DISABLED');

-- CreateTable
CREATE TABLE "gift_card_packages" (
    "id" BIGSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cover" TEXT,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "status" "GiftCardPackageStatus" NOT NULL DEFAULT 'ENABLED',
    "price" BIGINT NOT NULL DEFAULT 0,
    "duration" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "gift_card_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gift_cards" (
    "id" BIGSERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "packageId" BIGINT NOT NULL,
    "giftCardPackageId" BIGINT NOT NULL,
    "status" "GiftCardStatus" NOT NULL DEFAULT 'UNUSED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "expired_at" TIMESTAMP(3),
    "used_at" TIMESTAMP(3),
    "member_id" TEXT,

    CONSTRAINT "gift_cards_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sites" (
    "id" BIGSERIAL NOT NULL,
    "icon" TEXT,
    "description" TEXT,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "click_count" INTEGER NOT NULL DEFAULT 0,
    "status" "SiteStatus" NOT NULL DEFAULT 'ENABLED',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sort" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "sites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_clicks" (
    "id" BIGSERIAL NOT NULL,
    "siteId" BIGINT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "site_clicks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "browser_histories" (
    "id" BIGSERIAL NOT NULL,
    "member_id" TEXT,
    "url" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT NOT NULL,
    "referrer" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "browser_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proxy_nodes" (
    "id" BIGSERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "remark" TEXT,
    "url" TEXT NOT NULL,
    "status" "ProxyNodeStatus" NOT NULL DEFAULT 'ENABLED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "proxy_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "gift_cards_code_idx" ON "gift_cards"("code");

-- CreateIndex
CREATE INDEX "gift_cards_packageId_idx" ON "gift_cards"("packageId");

-- CreateIndex
CREATE INDEX "gift_cards_member_id_idx" ON "gift_cards"("member_id");

-- CreateIndex
CREATE INDEX "site_clicks_siteId_idx" ON "site_clicks"("siteId");

-- CreateIndex
CREATE INDEX "browser_histories_member_id_idx" ON "browser_histories"("member_id");

-- CreateIndex
CREATE INDEX "browser_histories_created_at_idx" ON "browser_histories"("created_at");

-- AddForeignKey
ALTER TABLE "gift_cards" ADD CONSTRAINT "gift_cards_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "gift_card_packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_cards" ADD CONSTRAINT "gift_cards_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "site_clicks" ADD CONSTRAINT "site_clicks_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "browser_histories" ADD CONSTRAINT "browser_histories_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("id") ON DELETE SET NULL ON UPDATE CASCADE;
