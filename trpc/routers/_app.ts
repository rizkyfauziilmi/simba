import { createTRPCRouter } from "../init";
import { classRouter } from "./class.router";
import { studentRouter } from "./student.router";
import { teacherRouter } from "./teacher.router";

export const appRouter = createTRPCRouter({
  student: studentRouter,
  teacher: teacherRouter,
  class: classRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
