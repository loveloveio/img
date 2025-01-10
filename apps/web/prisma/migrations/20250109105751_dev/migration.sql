-- CreateEnum
CREATE TYPE "ServiceEndpointStatus" AS ENUM ('ENABLED', 'DISABLED');

-- CreateTable
CREATE TABLE "service_endpoints" (
    "id" BIGSERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT NOT NULL,
    "status" "ServiceEndpointStatus" NOT NULL DEFAULT 'ENABLED',
    "sort" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "service_endpoints_pkey" PRIMARY KEY ("id")
);
