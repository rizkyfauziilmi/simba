"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Download, Search, UserCheck, UserX } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Data dummy untuk contoh
const dummyData = [
  {
    id: 1,
    nis: "2024001",
    nama: "Ahmad Rizki",
    kelas: "X-A",
    status: "Hadir",
    waktu: "07:15",
    tanggal: "2024-01-15",
  },
  {
    id: 2,
    nis: "2024002",
    nama: "Siti Nurhaliza",
    kelas: "X-A",
    status: "Hadir",
    waktu: "07:20",
    tanggal: "2024-01-15",
  },
  {
    id: 3,
    nis: "2024003",
    nama: "Budi Santoso",
    kelas: "X-B",
    status: "Izin",
    waktu: "-",
    tanggal: "2024-01-15",
  },
  {
    id: 4,
    nis: "2024004",
    nama: "Dewi Lestari",
    kelas: "X-A",
    status: "Hadir",
    waktu: "07:18",
    tanggal: "2024-01-15",
  },
  {
    id: 5,
    nis: "2024005",
    nama: "Eko Prasetyo",
    kelas: "X-B",
    status: "Sakit",
    waktu: "-",
    tanggal: "2024-01-15",
  },
  {
    id: 6,
    nis: "2024006",
    nama: "Fitri Handayani",
    kelas: "X-C",
    status: "Hadir",
    waktu: "07:25",
    tanggal: "2024-01-15",
  },
  {
    id: 7,
    nis: "2024007",
    nama: "Gilang Ramadhan",
    kelas: "X-C",
    status: "Alpa",
    waktu: "-",
    tanggal: "2024-01-15",
  },
  {
    id: 8,
    nis: "2024008",
    nama: "Hana Pertiwi",
    kelas: "X-A",
    status: "Hadir",
    waktu: "07:10",
    tanggal: "2024-01-15",
  },
];

export default function AbsensiSiswaPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [kelasFilter, setKelasFilter] = useState("semua");
  const [statusFilter, setStatusFilter] = useState("semua");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Hadir":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">{status}</Badge>
        );
      case "Izin":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">{status}</Badge>
        );
      case "Sakit":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">{status}</Badge>
        );
      case "Alpa":
        return <Badge className="bg-red-500 hover:bg-red-600">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const filteredData = dummyData.filter((item) => {
    const matchesSearch =
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nis.includes(searchQuery);
    const matchesKelas = kelasFilter === "semua" || item.kelas === kelasFilter;
    const matchesStatus =
      statusFilter === "semua" || item.status === statusFilter;
    return matchesSearch && matchesKelas && matchesStatus;
  });

  const stats = {
    hadir: dummyData.filter((d) => d.status === "Hadir").length,
    izin: dummyData.filter((d) => d.status === "Izin").length,
    sakit: dummyData.filter((d) => d.status === "Sakit").length,
    alpa: dummyData.filter((d) => d.status === "Alpa").length,
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Absensi Siswa</h1>
        <p className="text-muted-foreground">
          Kelola dan pantau kehadiran siswa secara real-time
        </p>
      </div>

      {/* Statistik Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hadir</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hadir}</div>
            <p className="text-xs text-muted-foreground">
              Siswa hadir hari ini
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Izin</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.izin}</div>
            <p className="text-xs text-muted-foreground">Siswa izin hari ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sakit</CardTitle>
            <UserCheck className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sakit}</div>
            <p className="text-xs text-muted-foreground">
              Siswa sakit hari ini
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alpa</CardTitle>
            <UserX className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.alpa}</div>
            <p className="text-xs text-muted-foreground">Siswa alpa hari ini</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter dan Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Data Absensi</CardTitle>
          <CardDescription>
            Gunakan filter untuk mencari data absensi siswa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="search">Cari Siswa</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nama atau NIS..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="tanggal">Tanggal</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="tanggal"
                    variant="outline"
                    className="justify-start text-left font-normal bg-transparent"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date
                      ? format(date, "PPP", { locale: id })
                      : "Pilih tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => newDate && setDate(newDate)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="kelas">Kelas</Label>
              <Select value={kelasFilter} onValueChange={setKelasFilter}>
                <SelectTrigger id="kelas">
                  <SelectValue placeholder="Pilih kelas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Kelas</SelectItem>
                  <SelectItem value="X-A">X-A</SelectItem>
                  <SelectItem value="X-B">X-B</SelectItem>
                  <SelectItem value="X-C">X-C</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Status</SelectItem>
                  <SelectItem value="Hadir">Hadir</SelectItem>
                  <SelectItem value="Izin">Izin</SelectItem>
                  <SelectItem value="Sakit">Sakit</SelectItem>
                  <SelectItem value="Alpa">Alpa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabel Data Absensi */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Data Absensi Siswa</CardTitle>
            <CardDescription>
              Menampilkan {filteredData.length} dari {dummyData.length} data
            </CardDescription>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">NIS</TableHead>
                  <TableHead>Nama Siswa</TableHead>
                  <TableHead>Kelas</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.nis}</TableCell>
                      <TableCell>{item.nama}</TableCell>
                      <TableCell>{item.kelas}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>{item.waktu}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Tidak ada data ditemukan
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
