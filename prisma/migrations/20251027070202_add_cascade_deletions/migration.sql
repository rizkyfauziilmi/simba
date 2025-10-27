-- DropForeignKey
ALTER TABLE "public"."ClassHistory" DROP CONSTRAINT "ClassHistory_classId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClassHistory" DROP CONSTRAINT "ClassHistory_studentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClassSchedule" DROP CONSTRAINT "ClassSchedule_kelasId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ClassSchedule" DROP CONSTRAINT "ClassSchedule_subjectId_fkey";

-- AddForeignKey
ALTER TABLE "public"."ClassHistory" ADD CONSTRAINT "ClassHistory_classId_fkey" FOREIGN KEY ("classId") REFERENCES "public"."Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassHistory" ADD CONSTRAINT "ClassHistory_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassSchedule" ADD CONSTRAINT "ClassSchedule_kelasId_fkey" FOREIGN KEY ("kelasId") REFERENCES "public"."Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ClassSchedule" ADD CONSTRAINT "ClassSchedule_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "public"."Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
