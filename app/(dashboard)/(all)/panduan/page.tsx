import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { HelpComponent } from "./_components/help-component";
import {
  adminHelpData,
  teacherHelpData,
  studentHelpData,
} from "./_components/help-data";

export default async function PanduanPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  switch (session.user.role) {
    case "admin":
      return <HelpComponent helpData={adminHelpData} />;
    case "teacher":
      return <HelpComponent helpData={teacherHelpData} />;
    case "student":
      return <HelpComponent helpData={studentHelpData} />;
    default:
      redirect("/");
  }
}
