/*
  Warnings:

  - You are about to drop the column `tahunAjaran` on the `Class` table. All the data in the column will be lost.
  - You are about to drop the column `tahunAjaran` on the `ClassHistory` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[classId,studentId]` on the table `ClassHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Class_tahunAjaran_key";

-- DropIndex
DROP INDEX "public"."ClassHistory_classId_studentId_tahunAjaran_key";

-- DropIndex
DROP INDEX "public"."ClassHistory_tahunAjaran_key";

-- AlterTable
ALTER TABLE "public"."Class" DROP COLUMN "tahunAjaran";

-- AlterTable
ALTER TABLE "public"."ClassHistory" DROP COLUMN "tahunAjaran";

-- CreateIndex
CREATE UNIQUE INDEX "ClassHistory_classId_studentId_key" ON "public"."ClassHistory"("classId", "studentId");
