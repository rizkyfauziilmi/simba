# Panduan Gaya Kode untuk SIMBA

Dokumen ini menguraikan pedoman gaya kode untuk proyek SIMBA untuk memastikan konsistensi dan kemudahan pemeliharaan di seluruh basis kode.

## Daftar Isi

1. [Pendahuluan](#pendahuluan)
2. [Alat Pemformatan](#alat-pemformatan)
3. [Konfigurasi Prettier](#konfigurasi-prettier)
4. [Konfigurasi ESLint](#konfigurasi-eslint)
5. [Git Pre-commit Hooks](#git-pre-commit-hooks)
6. [Pedoman Pesan Commit](#pedoman-pesan-commit)
7. [Perintah Pemformatan](#perintah-pemformatan)
8. [Integrasi Editor](#integrasi-editor)
9. [Praktik Terbaik](#praktik-terbaik)

## Pendahuluan

SIMBA menggunakan kombinasi Prettier dan ESLint untuk menerapkan pemformatan kode yang konsisten dan praktik terbaik. Alat-alat ini dikonfigurasi untuk bekerja bersama memberikan pengalaman pengembangan yang lancar.

## Alat Pemformatan

- **Prettier**: Menangani pemformatan kode (spasi, panjang baris, tanda kutip, dll.)
- **ESLint**: Menangani aturan kualitas kode dan pola
- **lint-staged**: Menjalankan linter pada file yang di-stage sebelum commit dan mencegah commit jika ada error
- **Husky**: Mengelola Git hooks untuk menjalankan lint-staged sebelum commit (v9+)
- **Commitizen**: Membuat pesan commit terstandarisasi melalui prompt interaktif
- **Commitlint**: Memvalidasi pesan commit berdasarkan format konvensional

## Konfigurasi Prettier

Konfigurasi Prettier didefinisikan dalam `.prettierrc.json` dengan pengaturan berikut:

```json
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "arrowParens": "avoid",
  "bracketSpacing": true,
  "endOfLine": "lf",
  "plugins": []
}
```

- `semi: false` - Tanpa titik koma
- `singleQuote: true` - Menggunakan tanda kutip tunggal alih-alih tanda kutip ganda
- `tabWidth: 2` - Menggunakan 2 spasi untuk indentasi
- `trailingComma: "es5"` - Menambahkan koma di akhir jika valid di ES5
- `printWidth: 100` - Membungkus kode pada 100 karakter
- `arrowParens: "avoid"` - Menghilangkan tanda kurung di sekitar parameter fungsi panah tunggal jika memungkinkan
- `bracketSpacing: true` - Mencetak spasi di antara kurung dalam literal objek
- `endOfLine: "lf"` - Akhir baris menggunakan LF (gaya Unix)

### File yang Diabaikan

File `.prettierignore` menentukan file mana yang harus dikecualikan dari pemformatan:

- `node_modules/`
- `.next/`
- `prisma/`
- Output build, file cache, dan lainnya

## Konfigurasi ESLint

ESLint dikonfigurasi untuk bekerja dengan Prettier dan aturan Next.js. Konfigurasi ada di `eslint.config.mjs` dan mencakup:

- Aturan yang direkomendasikan Next.js
- Dukungan TypeScript
- Integrasi dengan Prettier untuk menghindari konflik

## Git Pre-commit Hooks

SIMBA menggunakan Husky untuk menjalankan lint-staged sebelum setiap commit. Hal ini memastikan bahwa semua kode yang di-commit mengikuti pedoman gaya kode kita.

Hook pre-commit secara otomatis memformat file yang di-stage menggunakan Prettier dan memeriksa kode dengan ESLint. Jika ditemukan error linting, commit akan dibatalkan sampai error tersebut diperbaiki. SIMBA menggunakan konfigurasi Husky v9+ modern yang lebih ringan dan lebih cepat dari versi sebelumnya.

## Pedoman Pesan Commit

SIMBA mengikuti spesifikasi Conventional Commits untuk pesan commit. Ini memberikan format terstruktur yang membuat riwayat commit lebih mudah dibaca dan memungkinkan pembuatan changelog secara otomatis.

### Format Commit

```
<type>(<optional scope>): <description>

<optional body>

<optional footer>
```

### Jenis-jenis

- `feat`: Fitur baru
- `fix`: Perbaikan bug
- `docs`: Perubahan dokumentasi saja
- `style`: Perubahan yang tidak mempengaruhi arti kode (pemformatan, dll.)
- `refactor`: Perubahan kode yang tidak memperbaiki bug atau menambahkan fitur
- `perf`: Peningkatan kinerja
- `test`: Menambahkan atau memperbaiki pengujian
- `chore`: Perubahan pada proses build atau alat bantu
- `ci`: Perubahan pada konfigurasi CI
- `revert`: Membatalkan commit sebelumnya

### Contoh

```
feat(auth): menambahkan login dengan Google
fix(dashboard): menyelesaikan masalah pemuatan data di komponen grafik
docs: memperbarui instruksi instalasi
style: memformat kode sesuai aturan prettier baru
```

### Menggunakan Commitizen

Untuk membuat commit yang diformat dengan benar dengan mudah, gunakan Commitizen CLI dengan:

```bash
npm run commit
```

Ini akan meluncurkan prompt interaktif yang memandu Anda dalam membuat commit konvensional.

## Perintah Pemformatan

Beberapa skrip npm tersedia untuk pemformatan dan linting:

- `npm run format` - Memformat semua file dengan Prettier
- `npm run format:check` - Memeriksa apakah file sudah diformat dengan benar tanpa mengubahnya
- `npm run lint` - Menjalankan ESLint untuk memeriksa masalah kualitas kode
- `npm run lint-format` - Menjalankan ESLint dan Prettier secara berurutan
- `npm run commit` - Membuat pesan commit yang diformat dengan benar menggunakan Commitizen

## Integrasi Editor

### VS Code

Untuk pengguna VS Code, kami merekomendasikan menginstal ekstensi berikut:

1. **Prettier - Code formatter**
2. **ESLint**

Konfigurasikan VS Code untuk memformat saat menyimpan:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### JetBrains IDE (WebStorm, IntelliJ IDEA)

1. Instal plugin Prettier
2. Konfigurasikan Prettier sebagai formatter default
3. Aktifkan "Run on save" dalam konfigurasi Prettier

## Praktik Terbaik

1. **Jangan Lewati Hook**: Hindari menggunakan `--no-verify` dengan Git commit kecuali benar-benar diperlukan, atau alternatifnya set `HUSKY=0` sementara
2. **Perbaiki Error Linting**: Pastikan untuk memperbaiki semua error ESLint karena sistem tidak akan mengizinkan commit jika terdapat error linting; error ini sering menunjukkan bug potensial
3. **Format Sebelum PR**: Selalu pastikan kode Anda diformat sebelum membuat pull request
4. **Gunakan Conventional Commits**: Ikuti pedoman pesan commit untuk menjaga riwayat yang bersih
5. **Gunakan Commitizen**: Jalankan `npm run commit` alih-alih `git commit` untuk memastikan format pesan commit yang tepat
6. **Integrasi Editor**: Konfigurasikan editor Anda untuk pengalaman terbaik dengan umpan balik real-time
7. **Perbarui Konfigurasi**: Jika Anda mengubah aturan Prettier atau ESLint, komunikasikan dengan tim

---

Untuk pertanyaan atau saran tentang panduan gaya kode ini, silakan hubungi pengelola proyek.
