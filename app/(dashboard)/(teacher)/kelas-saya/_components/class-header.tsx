"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export function ClassHeader() {
  const trpc = useTRPC();

  const { data: kelas } = useSuspenseQuery(
    trpc.class.getMyHomeroomClass.queryOptions(),
  );

  if (!kelas || !kelas.waliKelas) {
    return (
      <Card className="border-border">
        <CardContent className="pt-6">
          <p className="text-muted-foreground">
            Anda belum ditugaskan sebagai wali kelas
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-2xl">Informasi Kelas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Nama Kelas
            </h3>
            <p className="text-lg font-semibold text-foreground">
              {kelas.namaKelas}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Tingkat
            </h3>
            <p className="text-lg font-semibold text-foreground">
              Kelas {kelas.tingkat}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Jumlah Siswa
            </h3>
            <div className="flex items-center gap-2">
              <p className="text-lg font-semibold text-foreground">
                {kelas.students.length} Siswa
              </p>
              <Badge variant="secondary">{kelas.students.length}</Badge>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Wali Kelas
            </h3>
            <p className="text-lg font-semibold text-foreground">
              {kelas.waliKelas.nama}
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-4 mt-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Detail Wali Kelas
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">NIP</span>
              <span className="text-sm font-medium text-foreground">
                {kelas.waliKelas.nip}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
