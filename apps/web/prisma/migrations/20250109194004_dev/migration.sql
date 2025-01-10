-- AlterTable
ALTER TABLE "photo_collections" ADD COLUMN     "image_count" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "account_providerId_accountId_idx" ON "account"("providerId", "accountId");

-- CreateIndex
CREATE INDEX "photo_collections_uuid_idx" ON "photo_collections"("uuid");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE INDEX "vip_packages_status_idx" ON "vip_packages"("status");
