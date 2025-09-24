import { auth } from "@/lib/auth";
import { DashboardVariants } from "./_components/dashboard-variants";
import { headers } from "next/headers";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const role = session.user.role;

  if (!role || !["admin", "student", "teacher"].includes(role)) {
    return <div>sedang memuat...</div>;
  }

  return (
    <DashboardVariants userRole={role as "admin" | "student" | "teacher"} />
  );
}
