"use server";

import { auth } from "@/lib/auth";
import { APIError } from "better-auth/api";

export async function createAdmin(values: {
  username: string;
  email: string;
  password: string;
}) {
  try {
    const response = await auth.api.createUser({
      body: {
        name: values.username,
        email: values.email,
        password: values.password,
        data: {
          username: values.username,
          displayUsername: values.username,
        },
        role: "admin",
      },
      asResponse: true,
    });

    if (!response.ok) {
      throw new APIError("INTERNAL_SERVER_ERROR");
    }

    return { success: true };
  } catch (error) {
    if (error instanceof APIError) {
      return { success: false, message: error.message };
    }
    return { success: false, message: "Terjadi error yang tidak terduga" };
  }
}
