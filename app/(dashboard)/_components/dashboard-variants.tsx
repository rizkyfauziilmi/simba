import { HydrateClient, prefetch, trpc } from "@/trpc/server";
import { AdminDashboard } from "./admin-dashboard";
import { StudentDashboard } from "./student-dashboard";
import { TeacherDashboard } from "./teacher-dashboard";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { EmptyError } from "@/components/empty-error";
import { EmptyLoading } from "@/components/empty-loading";

interface DashboardVariantsProps {
  userRole: "admin" | "teacher" | "student";
}

export const dynamic = "force-dynamic";

export function DashboardVariants({ userRole }: DashboardVariantsProps) {
  if (userRole === "admin") {
    prefetch(trpc.roleData.getAdminDashboardData.queryOptions());
  } else if (userRole === "teacher") {
    prefetch(trpc.roleData.getTeacherDashboardData.queryOptions());
  } else if (userRole === "student") {
    prefetch(trpc.roleData.getStudentDashboardData.queryOptions());
  }

  return (
    <HydrateClient>
      {(() => {
        switch (userRole) {
          case "admin":
            return (
              <ErrorBoundary
                fallback={
                  <EmptyError
                    title="Gagal memuat dasbor admin"
                    description="Terjadi kesalahan saat memuat dasbor admin. Silakan coba lagi."
                  />
                }
              >
                <Suspense
                  fallback={
                    <EmptyLoading
                      title="Memuat dasbor admin"
                      description="Mohon tunggu sementara kami memuat dasbor admin."
                    />
                  }
                >
                  <AdminDashboard />
                </Suspense>
              </ErrorBoundary>
            );
          case "teacher":
            return (
              <ErrorBoundary
                fallback={
                  <EmptyError
                    title="Gagal memuat dasbor guru"
                    description="Terjadi kesalahan saat memuat dasbor guru. Silakan coba lagi."
                  />
                }
              >
                <Suspense
                  fallback={
                    <EmptyLoading
                      title="Memuat dasbor guru"
                      description="Mohon tunggu sementara kami memuat dasbor guru."
                    />
                  }
                >
                  <TeacherDashboard />
                </Suspense>
              </ErrorBoundary>
            );
          case "student":
            return (
              <ErrorBoundary
                fallback={
                  <EmptyError
                    title="Gagal memuat dasbor siswa"
                    description="Terjadi kesalahan saat memuat dasbor siswa. Silakan coba lagi."
                  />
                }
              >
                <Suspense
                  fallback={
                    <EmptyLoading
                      title="Memuat dasbor siswa"
                      description="Mohon tunggu sementara kami memuat dasbor siswa."
                    />
                  }
                >
                  <StudentDashboard />
                </Suspense>
              </ErrorBoundary>
            );
          default:
            return null;
        }
      })()}
    </HydrateClient>
  );
}
