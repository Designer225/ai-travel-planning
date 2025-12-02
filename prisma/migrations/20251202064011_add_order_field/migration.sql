-- AlterTable
ALTER TABLE "DayActivity" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "DayActivity_tripDayId_order_idx" ON "DayActivity"("tripDayId", "order");
