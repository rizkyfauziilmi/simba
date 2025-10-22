"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { StudentStatus } from "@/lib/generated/prisma";

export function StudentsList() {
  const trpc = useTRPC();

  const { data: kelas } = useSuspenseQuery(
    trpc.class.getMyHomeroomClass.queryOptions(),
  );

  const getStatusColor = (status: StudentStatus) => {
    switch (status) {
      case "AKTIF":
        return "bg-green-100 text-green-800";
      case "ALUMNI":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  if (!kelas || kelas.students.length === 0) {
    return (
      <Card className="border-border">
        <CardContent className="pt-6">
          <p className="text-muted-foreground">
            Tidak ada siswa dalam kelas ini.
          </p>
        </CardContent>
      </Card>
    );
  }

  const students = kelas.students;

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Daftar Siswa</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>NISN</TableHead>
                <TableHead>Jenis Kelamin</TableHead>
                <TableHead>Tanggal Lahir</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.nama}</TableCell>
                  <TableCell>{student.nisn}</TableCell>
                  <TableCell>{student.jenisKelamin}</TableCell>
                  <TableCell>
                    {new Date(student.tanggalLahir).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(student.status)}>
                      {student.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          Total: {students.length} siswa
        </p>
      </CardContent>
    </Card>
  );
}
