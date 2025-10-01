import { createTRPCRouter } from "../init";
import { studentRouter } from "./student.router";

export const appRouter = createTRPCRouter({
  student: studentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
