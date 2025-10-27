/*
  Warnings:

  - Changed the type of `tingkat` on the `Class` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."StudentGrade" AS ENUM ('SD', 'SMP', 'SMK');

-- AlterTable
ALTER TABLE "public"."Class" DROP COLUMN "tingkat",
ADD COLUMN     "tingkat" "public"."StudentGrade" NOT NULL;
