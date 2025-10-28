# Panduan Development Aplikasi SIMBA

Panduan ini akan menjelaskan langkah-langkah untuk melakukan setup development environment dan menjalankan aplikasi SIMBA di mesin lokal Anda.

## Daftar Isi

1. [Prasyarat](#1-prasyarat)
2. [Instalasi Dependencies](#2-instalasi-dependencies)
3. [Konfigurasi Environment](#3-konfigurasi-environment)
4. [Menjalankan Database PostgreSQL](#4-menjalankan-database-postgresql)
5. [Menjalankan Aplikasi](#5-menjalankan-aplikasi)
6. [Kode Formatting dan Linting](#6-kode-formatting-dan-linting)
7. [Troubleshooting](#7-troubleshooting)

## 1. Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:

- [Node.js](https://nodejs.org/) (versi 20 atau yang lebih baru)
- [npm](https://www.npmjs.com/) atau [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com/get-started) dan [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/)

## 2. Instalasi Dependencies

Install semua dependencies yang diperlukan:

```bash
# Menggunakan npm
npm install

# ATAU menggunakan yarn
yarn install
```

## 3. Konfigurasi Environment

Salin file `.env.example` menjadi `.env.local`:

```bash
cp .env.example .env.local
```

Buka file `.env.local` dan sesuaikan konfigurasi. Khusus untuk `BETTER_AUTH_SECRET`, gunakan perintah berikut untuk menghasilkan nilai random yang aman:

```bash
openssl rand -base64 32
```

Salin output dari perintah di atas dan tempelkan sebagai nilai `BETTER_AUTH_SECRET` di file `.env.local`. Contoh isi file:

```
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
BETTER_AUTH_SECRET=HJfds9832fdsjkFDSA329fdsajkSDFA923/FDSAfdsa+423=
BETTER_AUTH_URL=http://localhost:3000
```

## 4. Menjalankan Database PostgreSQL

Aplikasi SIMBA menggunakan PostgreSQL sebagai database. Untuk menjalankannya dalam container Docker:

```bash
npm run dev:db
```

Perintah ini akan menjalankan PostgreSQL dalam container Docker menggunakan konfigurasi di `docker-compose.dev.yml`.

Detail konfigurasi database:

- **User**: user
- **Password**: password
- **Database**: mydb
- **Port**: 5432

Jika Anda ingin melihat status container database:

```bash
docker ps
```

## 5. Menjalankan Aplikasi

Setelah database berjalan, jalankan aplikasi dalam mode development:

```bash
npm run dev
```

Aplikasi akan berjalan pada `http://localhost:3000`. Buka alamat tersebut di browser untuk mengakses aplikasi SIMBA.

Mode development mendukung hot-reload, yang berarti perubahan pada kode akan langsung terlihat tanpa perlu restart aplikasi.

## 6. Kode Formatting dan Linting

Aplikasi SIMBA menggunakan Prettier untuk formatting kode dan ESLint untuk linting. Ini memastikan konsistensi kode di seluruh proyek.

### Menjalankan Prettier

Untuk memformat kode dengan Prettier:

```bash
npm run format
```

Untuk memeriksa apakah file sudah diformat dengan benar (tanpa mengubah):

```bash
npm run format:check
```

### Menjalankan ESLint

Untuk menjalankan ESLint:

```bash
npm run lint
```

### Formatting dan Linting Sekaligus

Untuk menjalankan ESLint dan Prettier sekaligus:

```bash
npm run lint-format
```

### Pre-commit Hook

Proyek ini menggunakan Husky untuk menjalankan lint-staged, yang akan otomatis memformat file yang diubah sebelum commit. Ini memastikan bahwa semua kode yang di-commit telah diformat dengan benar.

Pre-commit hook dijalankan otomatis saat Anda melakukan commit, dan akan memformat kode yang telah di-stage.

## 7. Troubleshooting

### Masalah Koneksi Database

Jika mengalami masalah koneksi database:

1. Pastikan container PostgreSQL berjalan:

   ```bash
   docker ps | grep postgres
   ```

2. Periksa log container PostgreSQL:

   ```bash
   docker logs $(docker ps -q --filter "name=simba-postgres")
   ```

3. Pastikan konfigurasi `DATABASE_URL` di `.env.local` sesuai dengan konfigurasi container.

### Masalah Port yang Sudah Digunakan

Jika port 3000 atau 5432 sudah digunakan oleh aplikasi lain:

1. Ubah port di file `docker-compose.dev.yml` untuk database:

   ```yaml
   ports:
     - '5433:5432' # Mengubah port host dari 5432 menjadi 5433
   ```

2. Ubah juga `DATABASE_URL` di `.env.local` untuk menyesuaikan dengan port baru.

3. Untuk mengubah port aplikasi, tambahkan opsi port saat menjalankan:
   ```bash
   PORT=3001 npm run dev
   ```

### Masalah Permission

Jika mengalami masalah izin saat menjalankan Docker:

```bash
sudo usermod -aG docker $USER
newgrp docker
```

---

Selamat mengembangkan aplikasi SIMBA! Jika memiliki pertanyaan lebih lanjut, silakan buat issue di repositori GitHub.
