/*
  Warnings:

  - You are about to drop the column `nomorTelepon` on the `Student` table. All the data in the column will be lost.
  - Added the required column `noTelepon` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Teacher" AS ENUM ('AKTIF', 'TIDAK_AKTIF', 'CUTI');

-- AlterTable
ALTER TABLE "public"."Student" DROP COLUMN "nomorTelepon",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "noTelepon" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "public"."Guru" (
    "id" TEXT NOT NULL,
    "nip" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jenisKelamin" "public"."Gender" NOT NULL,
    "tanggalLahir" TIMESTAMP(3) NOT NULL,
    "alamat" TEXT,
    "email" TEXT,
    "noTelepon" TEXT,
    "status" TEXT NOT NULL,
    "tanggalMasuk" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Guru_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Guru_nip_key" ON "public"."Guru"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "Guru_email_key" ON "public"."Guru"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Guru_userId_key" ON "public"."Guru"("userId");

-- AddForeignKey
ALTER TABLE "public"."Guru" ADD CONSTRAINT "Guru_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
