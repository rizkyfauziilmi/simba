import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import db from "./db";
import { username, admin as adminPlugin } from "better-auth/plugins";
import { ac, admin, student, teacher } from "@/lib/permissions";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  trustedOrigins: ["http://*"],
  plugins: [
    username(),
    adminPlugin({
      defaultRole: "student",
      ac,
      roles: {
        admin,
        student,
        teacher,
      },
    }),
  ],
});

export type Session = typeof auth.$Infer.Session;
