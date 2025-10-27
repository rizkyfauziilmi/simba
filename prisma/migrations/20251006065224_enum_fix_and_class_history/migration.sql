/*
  Warnings:

  - The values [TIDAK_AKTIF] on the enum `StudentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [TIDAK_AKTIF] on the enum `TeacherStatus` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[tahunAjaran]` on the table `Class` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."ClassStatus" AS ENUM ('AKTIF', 'NON_AKTIF');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."StudentStatus_new" AS ENUM ('AKTIF', 'LULUS', 'KELUAR');
ALTER TABLE "public"."Student" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Student" ALTER COLUMN "status" TYPE "public"."StudentStatus_new" USING ("status"::text::"public"."StudentStatus_new");
ALTER TYPE "public"."StudentStatus" RENAME TO "StudentStatus_old";
ALTER TYPE "public"."StudentStatus_new" RENAME TO "StudentStatus";
DROP TYPE "public"."StudentStatus_old";
ALTER TABLE "public"."Student" ALTER COLUMN "status" SET DEFAULT 'AKTIF';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."TeacherStatus_new" AS ENUM ('AKTIF', 'CUTI', 'KELUAR', 'PENSIUN');
ALTER TABLE "public"."Teacher" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Teacher" ALTER COLUMN "status" TYPE "public"."TeacherStatus_new" USING ("status"::text::"public"."TeacherStatus_new");
ALTER TYPE "public"."TeacherStatus" RENAME TO "TeacherStatus_old";
ALTER TYPE "public"."TeacherStatus_new" RENAME TO "TeacherStatus";
DROP TYPE "public"."TeacherStatus_old";
ALTER TABLE "public"."Teacher" ALTER COLUMN "status" SET DEFAULT 'AKTIF';
COMMIT;

-- CreateTable
CREATE TABLE "public"."ClassHistory" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "tahunAjaran" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClassHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClassHistory_tahunAjaran_key" ON "public"."ClassHistory"("tahunAjaran");

-- CreateIndex
CREATE UNIQUE INDEX "ClassHistory_classId_studentId_tahunAjaran_key" ON "public"."ClassHistory"("classId", "studentId", "tahunAjaran");

-- CreateIndex
CREATE UNIQUE INDEX "Class_tahunAjaran_key" ON "public"."Class"("tahunAjaran");

-- AddForeignKey
ALTER TABLE "public"."ClassHistory" ADD CONSTRAINT "ClassHistory_classId_fkey" FOREIGN KEY ("classId") REFERENCES "public"."Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassHistory" ADD CONSTRAINT "ClassHistory_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
