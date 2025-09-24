import { AdminDashboard } from "./admin-dashboard";
import { StudentDashboard } from "./student-dashboard";
import { TeacherDashboard } from "./teacher-dashboard";

interface DashboardVariantsProps {
  userRole: "admin" | "teacher" | "student";
}

export function DashboardVariants({ userRole }: DashboardVariantsProps) {
  switch (userRole) {
    case "admin":
      return <AdminDashboard />;
    case "teacher":
      return <TeacherDashboard />;
    case "student":
      return <StudentDashboard />;
    default:
      return <AdminDashboard />;
  }
}
