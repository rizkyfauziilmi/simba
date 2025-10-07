/*
  Warnings:

  - Added the required column `classId` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Student" ADD COLUMN     "classId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."Class" (
    "id" TEXT NOT NULL,
    "namaKelas" TEXT NOT NULL,
    "tingkat" INTEGER NOT NULL,
    "tahunAjaran" TEXT NOT NULL,
    "ruang" TEXT,
    "waliKelasId" TEXT,

    CONSTRAINT "Class_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Class_waliKelasId_key" ON "public"."Class"("waliKelasId");

-- AddForeignKey
ALTER TABLE "public"."Student" ADD CONSTRAINT "Student_classId_fkey" FOREIGN KEY ("classId") REFERENCES "public"."Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Class" ADD CONSTRAINT "Class_waliKelasId_fkey" FOREIGN KEY ("waliKelasId") REFERENCES "public"."Teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;
