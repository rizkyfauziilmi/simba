-- DropForeignKey
ALTER TABLE "public"."Teacher" DROP CONSTRAINT "Teacher_userId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Teacher" ADD CONSTRAINT "Teacher_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
