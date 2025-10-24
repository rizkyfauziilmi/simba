"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDateToNow, formattedDate } from "@/lib/date";
import { ClassStatus, StudentStatus } from "@/lib/generated/prisma";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Calendar, Users } from "lucide-react";

// Status badge colors
const getStatusColor = (status: StudentStatus | ClassStatus) => {
  switch (status) {
    case "AKTIF":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
    case "NON_AKTIF":
      return "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200";
    case "ALUMNI":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "KELUAR":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  }
};

export function StudentHistoryTable() {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.class.getMyClassHistories.queryOptions(),
  );

  if (data.length === 0) {
    // TODO: use empty component
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30 py-12">
        <Users className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground">
          Tidak Ada Riwayat
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Tidak ada riwayat kelas siswa untuk ditampilkan.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((record) => (
        <Card
          key={record.id}
          className="border-border transition-all hover:shadow-md"
        >
          <div className="p-4 md:p-6">
            {/* Header Row */}
            <div className="mb-4 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {record.class.namaKelas}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {record.class.tingkat}
                  {record.class.ruang && ` • Ruang ${record.class.ruang}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className={getStatusColor(record.student.status)}>
                  {record.student.status}
                </Badge>
                <Badge className={getStatusColor(record.class.status)}>
                  {record.class.status}
                </Badge>
              </div>
            </div>

            {/* Details Row */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Tanggal Masuk
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {formattedDate(record.createdAt)}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatDateToNow(record.createdAt)}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  ID Kelas
                </p>
                <p className="text-sm font-mono text-foreground">
                  {record.classId}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground">
                  ID Siswa
                </p>
                <p className="text-sm font-mono text-foreground">
                  {record.studentId}
                </p>
              </div>
            </div>

            {/* Last Class Indicator */}
            {record.class.isLast && (
              <div className="mt-4 rounded-md bg-blue-50 p-3 dark:bg-blue-950">
                <p className="text-xs font-medium text-blue-900 dark:text-blue-200">
                  ✓ Ini adalah riwayat kelas terakhir siswa
                </p>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
