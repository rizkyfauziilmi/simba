/*
  Warnings:

  - You are about to drop the column `email` on the `Teacher` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."Teacher_email_key";

-- AlterTable
ALTER TABLE "public"."Teacher" DROP COLUMN "email";
