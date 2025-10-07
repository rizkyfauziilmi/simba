/*
  Warnings:

  - You are about to drop the column `classId` on the `Student` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Student" DROP CONSTRAINT "Student_classId_fkey";

-- AlterTable
ALTER TABLE "public"."Student" DROP COLUMN "classId",
ADD COLUMN     "kelasId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES "public"."Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;
