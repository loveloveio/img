-- CreateEnum
CREATE TYPE "PaymentMethodStatus" AS ENUM ('ENABLED', 'DISABLED');

-- AlterTable
ALTER TABLE "payment_methods" ADD COLUMN     "status" "PaymentMethodStatus" NOT NULL DEFAULT 'ENABLED';
