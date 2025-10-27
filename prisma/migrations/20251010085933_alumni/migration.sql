/*
  Warnings:

  - The values [LULUS] on the enum `StudentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."StudentStatus_new" AS ENUM ('AKTIF', 'ALUMNI', 'KELUAR');
ALTER TABLE "public"."Student" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Student" ALTER COLUMN "status" TYPE "public"."StudentStatus_new" USING ("status"::text::"public"."StudentStatus_new");
ALTER TYPE "public"."StudentStatus" RENAME TO "StudentStatus_old";
ALTER TYPE "public"."StudentStatus_new" RENAME TO "StudentStatus";
DROP TYPE "public"."StudentStatus_old";
ALTER TABLE "public"."Student" ALTER COLUMN "status" SET DEFAULT 'AKTIF';
COMMIT;

-- CreateTable
CREATE TABLE "public"."SchoolBalance" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT,

    CONSTRAINT "SchoolBalance_pkey" PRIMARY KEY ("id")
);
