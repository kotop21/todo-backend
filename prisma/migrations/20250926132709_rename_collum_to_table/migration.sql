/*
  Warnings:

  - You are about to drop the `Column` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TodoItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Column" DROP CONSTRAINT "Column_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TodoItem" DROP CONSTRAINT "TodoItem_columnId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TodoItem" DROP CONSTRAINT "TodoItem_userId_fkey";

-- DropTable
DROP TABLE "public"."Column";

-- DropTable
DROP TABLE "public"."TodoItem";

-- CreateTable
CREATE TABLE "public"."Table" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TableItem" (
    "id" SERIAL NOT NULL,
    "columnId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "itemName" TEXT NOT NULL,
    "itemDescrip" TEXT,
    "itemDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TableItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Table" ADD CONSTRAINT "Table_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TableItem" ADD CONSTRAINT "TableItem_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "public"."Table"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TableItem" ADD CONSTRAINT "TableItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
