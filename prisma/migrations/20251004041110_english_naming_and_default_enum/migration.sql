/*
  Warnings:

  - The `status` column on the `Guru` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."TeacherStatus" AS ENUM ('AKTIF', 'TIDAK_AKTIF', 'CUTI');

-- AlterTable
ALTER TABLE "public"."Guru" DROP COLUMN "status",
ADD COLUMN     "status" "public"."TeacherStatus" NOT NULL DEFAULT 'AKTIF';

-- AlterTable
ALTER TABLE "public"."Student" ALTER COLUMN "status" SET DEFAULT 'AKTIF';

-- DropEnum
DROP TYPE "public"."Teacher";
