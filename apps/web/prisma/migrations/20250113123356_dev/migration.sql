-- CreateEnum
CREATE TYPE "SearchEngineStatus" AS ENUM ('ENABLED', 'DISABLED');

-- CreateTable
CREATE TABLE "search_engines" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "remark" TEXT,
    "status" "SearchEngineStatus" NOT NULL DEFAULT 'ENABLED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "search_engines_pkey" PRIMARY KEY ("id")
);
