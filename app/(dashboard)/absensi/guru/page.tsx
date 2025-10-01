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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CalendarIcon,
  Download,
  Plus,
  Search,
  UserCheck,
  UserX,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

// Data dummy untuk contoh
const dummyData = [
  {
    id: 1,
    nip: "198501012010011001",
    nama: "Dr. Agus Setiawan, M.Pd",
    mapel: "Matematika",
    status: "Hadir",
    waktu: "06:45",
    keterangan: "-",
  },
  {
    id: 2,
    nip: "198703152011012002",
    nama: "Dra. Siti Aminah, M.Pd",
    mapel: "Bahasa Indonesia",
    status: "Hadir",
    waktu: "06:50",
    keterangan: "-",
  },
  {
    id: 3,
    nip: "199001202015011003",
    nama: "Ahmad Fauzi, S.Pd",
    mapel: "Bahasa Inggris",
    status: "Izin",
    waktu: "-",
    keterangan: "Keperluan keluarga",
  },
  {
    id: 4,
    nip: "198805102012012004",
    nama: "Rina Wulandari, S.Si",
    mapel: "Fisika",
    status: "Hadir",
    waktu: "06:55",
    keterangan: "-",
  },
  {
    id: 5,
    nip: "199203252016011005",
    nama: "Budi Hartono, S.Kom",
    mapel: "TIK",
    status: "Hadir",
    waktu: "07:00",
    keterangan: "-",
  },
  {
    id: 6,
    nip: "198912152014012006",
    nama: "Dewi Kusuma, S.Pd",
    mapel: "Biologi",
    status: "Sakit",
    waktu: "-",
    keterangan: "Demam",
  },
  {
    id: 7,
    nip: "199105082017011007",
    nama: "Eko Prasetyo, S.Pd",
    mapel: "Sejarah",
    status: "Hadir",
    waktu: "06:48",
    keterangan: "-",
  },
];

export default function AbsensiGuruPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [mapelFilter, setMapelFilter] = useState("semua");
  const [statusFilter, setStatusFilter] = useState("semua");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
      item.nip.includes(searchQuery);
    const matchesMapel = mapelFilter === "semua" || item.mapel === mapelFilter;
    const matchesStatus =
      statusFilter === "semua" || item.status === statusFilter;
    return matchesSearch && matchesMapel && matchesStatus;
  });

  const stats = {
    hadir: dummyData.filter((d) => d.status === "Hadir").length,
    izin: dummyData.filter((d) => d.status === "Izin").length,
    sakit: dummyData.filter((d) => d.status === "Sakit").length,
    total: dummyData.length,
  };

  const persentaseKehadiran = ((stats.hadir / stats.total) * 100).toFixed(1);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Absensi Guru</h1>
        <p className="text-muted-foreground">
          Kelola dan pantau kehadiran guru dan tenaga pendidik
        </p>
      </div>

      {/* Statistik Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Guru</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Guru terdaftar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hadir</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.hadir}</div>
            <p className="text-xs text-muted-foreground">Guru hadir hari ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tidak Hadir</CardTitle>
            <UserX className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.izin + stats.sakit}</div>
            <p className="text-xs text-muted-foreground">
              Izin & sakit hari ini
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Persentase</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{persentaseKehadiran}%</div>
            <p className="text-xs text-muted-foreground">Tingkat kehadiran</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter dan Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Data Absensi</CardTitle>
          <CardDescription>
            Gunakan filter untuk mencari data absensi guru
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="search">Cari Guru</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nama atau NIP..."
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
              <Label htmlFor="mapel">Mata Pelajaran</Label>
              <Select value={mapelFilter} onValueChange={setMapelFilter}>
                <SelectTrigger id="mapel">
                  <SelectValue placeholder="Pilih mata pelajaran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Mapel</SelectItem>
                  <SelectItem value="Matematika">Matematika</SelectItem>
                  <SelectItem value="Bahasa Indonesia">
                    Bahasa Indonesia
                  </SelectItem>
                  <SelectItem value="Bahasa Inggris">Bahasa Inggris</SelectItem>
                  <SelectItem value="Fisika">Fisika</SelectItem>
                  <SelectItem value="Biologi">Biologi</SelectItem>
                  <SelectItem value="TIK">TIK</SelectItem>
                  <SelectItem value="Sejarah">Sejarah</SelectItem>
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
            <CardTitle>Data Absensi Guru</CardTitle>
            <CardDescription>
              Menampilkan {filteredData.length} dari {dummyData.length} data
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Absensi
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tambah Data Absensi</DialogTitle>
                  <DialogDescription>
                    Isi form di bawah untuk menambahkan data absensi guru
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="guru">Pilih Guru</Label>
                    <Select>
                      <SelectTrigger id="guru">
                        <SelectValue placeholder="Pilih guru" />
                      </SelectTrigger>
                      <SelectContent>
                        {dummyData.map((guru) => (
                          <SelectItem key={guru.id} value={guru.nip}>
                            {guru.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="status-absen">Status Kehadiran</Label>
                    <Select>
                      <SelectTrigger id="status-absen">
                        <SelectValue placeholder="Pilih status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hadir">Hadir</SelectItem>
                        <SelectItem value="izin">Izin</SelectItem>
                        <SelectItem value="sakit">Sakit</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="keterangan">Keterangan</Label>
                    <Input
                      id="keterangan"
                      placeholder="Masukkan keterangan (opsional)"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button onClick={() => setIsDialogOpen(false)}>Simpan</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">NIP</TableHead>
                  <TableHead>Nama Guru</TableHead>
                  <TableHead>Mata Pelajaran</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Keterangan</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.nip}</TableCell>
                      <TableCell>{item.nama}</TableCell>
                      <TableCell>{item.mapel}</TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>{item.waktu}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {item.keterangan}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Detail
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
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
