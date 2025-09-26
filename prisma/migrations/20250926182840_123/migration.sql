/*
  Warnings:

  - You are about to drop the column `columnId` on the `TableItem` table. All the data in the column will be lost.
  - Added the required column `tableId` to the `TableItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."TableItem" DROP CONSTRAINT "TableItem_columnId_fkey";

-- AlterTable
ALTER TABLE "public"."TableItem" DROP COLUMN "columnId",
ADD COLUMN     "tableId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."TableItem" ADD CONSTRAINT "TableItem_tableId_fkey" FOREIGN KEY ("tableId") REFERENCES "public"."Table"("id") ON DELETE CASCADE ON UPDATE CASCADE;
