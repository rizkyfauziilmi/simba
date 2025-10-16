/*
  Warnings:

  - You are about to drop the column `classId` on the `ClassSchedule` table. All the data in the column will be lost.
  - Added the required column `kelasId` to the `ClassSchedule` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ClassSchedule" DROP CONSTRAINT "ClassSchedule_classId_fkey";

-- AlterTable
ALTER TABLE "public"."ClassSchedule" DROP COLUMN "classId",
ADD COLUMN     "kelasId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."ClassSchedule" ADD CONSTRAINT "ClassSchedule_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES "public"."Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
