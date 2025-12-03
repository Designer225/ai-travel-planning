/*
  Warnings:

  - Added the required column `cardNumber` to the `PaymentMethod` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cardholderName` to the `PaymentMethod` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cvv` to the `PaymentMethod` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- First add columns as nullable
ALTER TABLE "PaymentMethod" ADD COLUMN     "cardNumber" TEXT,
ADD COLUMN     "cardholderName" TEXT,
ADD COLUMN     "cvv" TEXT;

-- Update existing rows to have empty strings
UPDATE "PaymentMethod" SET "cardNumber" = '', "cardholderName" = '', "cvv" = '' WHERE "cardNumber" IS NULL;

-- Now set NOT NULL and defaults
ALTER TABLE "PaymentMethod" ALTER COLUMN "cardNumber" SET NOT NULL, ALTER COLUMN "cardNumber" SET DEFAULT '';
ALTER TABLE "PaymentMethod" ALTER COLUMN "cardholderName" SET NOT NULL, ALTER COLUMN "cardholderName" SET DEFAULT '';
ALTER TABLE "PaymentMethod" ALTER COLUMN "cvv" SET NOT NULL, ALTER COLUMN "cvv" SET DEFAULT '';
