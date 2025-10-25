import { APIError, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import db from "./db";
import {
  username,
  admin as adminPlugin,
  createAuthMiddleware,
} from "better-auth/plugins";
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
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      const path = ctx.path;
      const response = ctx.context.returned as APIError;

      // * use for debugging custom message when error occurs
      // console.log({
      //   path,
      //   response,
      // });

      if (
        path.startsWith("/sign-in") &&
        response.body?.code === "INVALID_EMAIL_OR_PASSWORD"
      ) {
        throw new APIError("UNAUTHORIZED", {
          ...response.body,
          message: "Email atau kata sandi tidak valid",
        });
      }
      if (
        path.startsWith("/sign-in") &&
        response.body?.code === "INVALID_USERNAME_OR_PASSWORD"
      ) {
        throw new APIError("UNAUTHORIZED", {
          ...response.body,
          message: "Nama Pengguna atau kata sandi tidak valid",
        });
      }
      if (
        path.startsWith("/change-password") &&
        response.body?.code === "INVALID_PASSWORD"
      ) {
        throw new APIError("BAD_REQUEST", {
          ...response.body,
          message: "Kata sandi saat ini tidak valid",
        });
      }
    }),
  },
  plugins: [
    username(),
    adminPlugin({
      defaultBanReason: "Tanpa alasan diberikan",
      bannedUserMessage:
        "Akun Anda telah dibanned. Silakan hubungi administrator untuk informasi lebih lanjut.",
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
