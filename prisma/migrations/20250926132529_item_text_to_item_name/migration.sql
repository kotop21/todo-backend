/*
  Warnings:

  - You are about to drop the column `itemText` on the `TodoItem` table. All the data in the column will be lost.
  - Added the required column `itemName` to the `TodoItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."TodoItem" DROP COLUMN "itemText",
ADD COLUMN     "itemName" TEXT NOT NULL;
