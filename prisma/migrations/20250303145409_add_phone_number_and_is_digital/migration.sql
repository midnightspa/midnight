-- AlterTable
ALTER TABLE "Lead" ADD COLUMN "phoneNumber" TEXT;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN "isDigital" BOOLEAN NOT NULL DEFAULT false; 