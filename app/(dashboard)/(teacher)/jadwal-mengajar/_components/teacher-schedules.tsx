"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, BookOpen, Users } from "lucide-react";
import { useTRPC } from "@/trpc/client";
import { Hari, StudentGrade } from "@/lib/generated/prisma";
import { useSuspenseQuery } from "@tanstack/react-query";
import { enumToReadable } from "@/lib/string";

const hariOrder: Record<Hari, number> = {
  SENIN: 1,
  SELASA: 2,
  RABU: 3,
  KAMIS: 4,
  JUMAT: 5,
  SABTU: 6,
};

const gradeColors: Record<StudentGrade, string> = {
  SD: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  SMP: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  SMK: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
};

export function TeacherSchedules() {
  const [selectedGrade, setSelectedGrade] = useState<StudentGrade | "all">(
    "all",
  );
  const [selectedDay, setSelectedDay] = useState<Hari | "all">("all");
  const trpc = useTRPC();
  const { data: schedules } = useSuspenseQuery(
    trpc.subject.getTeacherSchedules.queryOptions(),
  );

  const filteredData = schedules.filter((item) => {
    const gradeMatch =
      selectedGrade === "all" || item.kelas.tingkat === selectedGrade;
    const dayMatch = selectedDay === "all" || item.hari === selectedDay;
    return gradeMatch && dayMatch;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const dayDiff = hariOrder[a.hari] - hariOrder[b.hari];
    if (dayDiff !== 0) return dayDiff;
    return a.jamMulai.localeCompare(b.jamMulai);
  });

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Jadwal Mengajar
        </h1>
        <p className="text-muted-foreground">lihat jadwal mengajar Anda</p>
      </div>

      {/* Filters */}
      <Card className="mb-6 border-border">
        <CardHeader>
          <CardTitle className="text-lg">Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Grade Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Tingkat Kelas
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedGrade === "all" ? "default" : "outline"}
                  onClick={() => setSelectedGrade("all")}
                  className="text-sm"
                >
                  Semua
                </Button>
                {Object.values(StudentGrade).map((grade) => (
                  <Button
                    key={grade}
                    variant={selectedGrade === grade ? "default" : "outline"}
                    onClick={() => setSelectedGrade(grade)}
                    className="text-sm"
                  >
                    Kelas {grade}
                  </Button>
                ))}
              </div>
            </div>

            {/* Day Filter */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Hari
              </label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedDay === "all" ? "default" : "outline"}
                  onClick={() => setSelectedDay("all")}
                  className="text-sm"
                >
                  Semua
                </Button>
                {Object.values(Hari).map((day) => (
                  <Button
                    key={day}
                    variant={selectedDay === day ? "default" : "outline"}
                    onClick={() => setSelectedDay(day)}
                    className="text-sm"
                  >
                    {enumToReadable(day)}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule List */}
      <div className="space-y-3">
        {sortedData.length > 0 ? (
          sortedData.map((item, index) => (
            <Card
              key={index}
              className="border-border hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
                  {/* Subject Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <h3 className="font-semibold text-foreground">
                        {item.subject.nama}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {item.subject.kode}
                    </p>
                  </div>

                  {/* Class Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="font-medium text-foreground">
                        {item.kelas.namaKelas}
                      </span>
                    </div>
                    <Badge className={gradeColors[item.kelas.tingkat]}>
                      Kelas {item.kelas.tingkat}
                    </Badge>
                  </div>

                  {/* Time Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="font-medium text-foreground">
                        {item.jamMulai} - {item.jamSelesai}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.hari}</p>
                  </div>

                  {/* Room Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="font-medium text-foreground">
                        {item.kelas.ruang ? `Ruang ${item.kelas.ruang}` : "TBD"}
                      </span>
                    </div>
                    {!item.kelas.ruang && (
                      <Badge variant="secondary" className="text-xs">
                        Belum ditentukan
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-border">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">
                Tidak ada jadwal yang sesuai dengan filter
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Summary */}
      <Card className="mt-6 border-border bg-muted/50">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            Total jadwal:{" "}
            <span className="font-semibold text-foreground">
              {sortedData.length}
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
