/*
  Warnings:

  - The values [ACTIVE,INACTIVE] on the enum `StudentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."StudentStatus_new" AS ENUM ('AKTIF', 'TIDAK_AKTIF');
ALTER TABLE "public"."Student" ALTER COLUMN "status" TYPE "public"."StudentStatus_new" USING ("status"::text::"public"."StudentStatus_new");
ALTER TYPE "public"."StudentStatus" RENAME TO "StudentStatus_old";
ALTER TYPE "public"."StudentStatus_new" RENAME TO "StudentStatus";
DROP TYPE "public"."StudentStatus_old";
COMMIT;
