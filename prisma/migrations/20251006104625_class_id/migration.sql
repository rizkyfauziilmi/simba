/*
  Warnings:

  - A unique constraint covering the columns `[classId]` on the table `Student` will be added. If there are existing duplicate values, this will fail.
  - Made the column `classId` on table `Student` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Student" DROP CONSTRAINT "Student_classId_fkey";

-- AlterTable
ALTER TABLE "public"."Student" ALTER COLUMN "classId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Student_classId_key" ON "public"."Student"("classId");

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_classId_fkey" FOREIGN KEY ("classId") REFERENCES "public"."Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
