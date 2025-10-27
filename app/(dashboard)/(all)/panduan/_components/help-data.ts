import { HelpData } from "./help-component";

export const adminHelpData: HelpData = {
  title: "Panduan Admin SIMBA",
  description:
    "Panduan lengkap untuk pengelolaan Sistem Informasi Manajemen Bustanul Arifin",

  quickStart: [
    {
      title: "Membuat Akun Admin",
      content:
        "Buka halaman 'Kelola Akun', klik tombol 'Buat Admin' dan isi formulir yang muncul. Pastikan untuk menyimpan email dan kata sandi dengan aman agar tidak lupa. Akun admin ini untuk cadangan dalam kasus kehilangan akses akun utama.",
    },
    {
      title: "Mengelola Data Master",
      content:
        "Akses menu 'Data Master' untuk mengelola informasi siswa, guru, kelas, dan mata pelajaran. Anda dapat menambah, mengubah, menghapus, dan mengekspor data dalam format CSV, Excel, atau PDF.",
    },
    {
      title: "Pencatatan Keuangan",
      content:
        "Navigasikan ke bagian 'Keuangan' untuk mencatat pengeluaran dan pemasukan. Anda dapat memfilter transaksi berdasarkan tanggal dan kategori, serta mengunduh laporan keuangan dalam berbagai format.",
    },
    {
      title: "Mengatur Profil & Tema",
      content:
        "Klik menu 'Profil' untuk mengatur foto profil, username, dan nama tampilan Anda. Kunjungi menu 'Pengaturan' untuk memilih tema yang Anda sukai seperti Ghibli, Bold Tech, dan tema lainnya.",
    },
  ],

  faqs: [
    // Akun
    {
      question: "Bagaimana cara mengelola akun pengguna?",
      answer:
        "Buka menu 'Kelola Akun', di sini Anda dapat membuat admin baru, mengatur ulang kata sandi, mengubah email, menyamar sebagai pengguna lain untuk troubleshooting, memblokir pengguna, mencabut semua sesi aktif, dan menghapus pengguna jika diperlukan.",
      category: "Akun",
    },
    {
      question: "Cara menyamar sebagai pengguna lain?",
      answer:
        "Pada menu 'Kelola Akun', temukan pengguna yang ingin Anda masuki akunnya, klik tombol 'Aksi' (titik tiga) dan pilih 'Menyamar'. Anda akan masuk ke akun pengguna tersebut untuk membantu troubleshooting. Klik Tombol 'Berhenti Penyamaran' di pojok kanan atas untuk kembali ke akun admin.",
      category: "Akun",
    },

    // Profil & Pengaturan
    {
      question: "Bagaimana cara mengubah foto profil?",
      answer:
        "Klik menu 'Profil' di sidebar, kemudian pilih tab 'Informasi Umum'. Klik pada area foto profil untuk mengunggah foto baru. Setelah memilih foto, klik 'Simpan' untuk mengonfirmasi perubahan.",
      category: "Profil & Pengaturan",
    },
    {
      question: "Bagaimana cara mengubah username atau nama tampilan?",
      answer:
        "Akses menu 'Profil' di sidebar, pilih tab 'Informasi Umum'. Anda dapat mengubah username dan nama tampilan pada form yang tersedia. Setelah melakukan perubahan, klik tombol 'Simpan'.",
      category: "Profil & Pengaturan",
    },
    {
      question: "Bagaimana cara mengubah kata sandi?",
      answer:
        "Klik menu 'Profil' di sidebar, lalu pilih tab 'Keamanan'. Masukkan kata sandi lama Anda, kemudian masukkan dan konfirmasi kata sandi baru. Klik 'Perbarui Kata Sandi' untuk menyimpan perubahan.",
      category: "Profil & Pengaturan",
    },
    {
      question: "Bagaimana cara menghapus sesi login lain?",
      answer:
        "Klik menu 'Profil' di sidebar, pilih tab 'Sesi'. Di sini Anda akan melihat daftar perangkat yang saat ini login ke akun Anda. Klik 'Cabut Sesi' pada sesi yang ingin Anda akhiri, atau 'Cabut Semua Sesi Lain' untuk mengakhiri semua login kecuali yang sedang Anda gunakan.",
      category: "Profil & Pengaturan",
    },
    {
      question: "Bagaimana cara mengubah tema aplikasi?",
      answer:
        "Akses menu 'Pengaturan' di sidebar. Pada bagian tema, Anda dapat memilih dari berbagai pilihan tema seperti Ghibli, Bold Tech, dan tema lainnya. Perubahan tema akan langsung diterapkan tanpa perlu me-refresh halaman.",
      category: "Profil & Pengaturan",
    },
    {
      question: "Bagaimana cara menambahkan data siswa baru?",
      answer:
        "Akses menu 'Data Master' > 'Siswa' dan klik tombol 'Tambah Siswa'. Isi formulir dengan informasi lengkap siswa seperti NIS, nama, kelas, dan data lainnya. Klik 'Simpan' untuk menambahkan data siswa ke sistem.",
      category: "Data Master",
    },
    {
      question: "Cara menambahkan data guru baru?",
      answer:
        "Buka menu 'Data Master' > 'Guru' dan klik tombol 'Tambah Guru'. Isi semua informasi yang diperlukan seperti NIP, nama lengkap, mata pelajaran yang diampu, dan data kontak. Klik 'Simpan' untuk menyelesaikan.",
      category: "Data Master",
    },
    {
      question: "Bagaimana cara mengelola jadwal pelajaran?",
      answer:
        "Akses menu 'Data Master' > 'Kelas'. Isi formulir untuk membuat kelas. Kemudian akses menu 'Data Master' > 'Mata Pelajaran'. Buat mata pelajaran baru dan buat jadwal pelajaran baru dengan tombol Tambah Jadwal. Klik 'Simpan' untuk menyimpan jadwal.",
      category: "Data Master",
    },
    {
      question: "Bagaimana cara mengekspor data master?",
      answer:
        "Buka menu 'Data Master', pilih jenis data yang ingin diekspor (siswa, guru, kelas, atau Mata Pelajaran). Gunakan filter yang tersedia jika perlu, lalu klik tombol 'Ekspor' dan pilih format yang diinginkan (CSV, Excel, atau PDF).",
      category: "Data Master",
    },
    {
      question: "Cara mencatat transaksi keuangan?",
      answer:
        "Buka menu 'Keuangan' > klik tombol 'Tambah Transaksi'. Pilih jenis transaksi (pemasukan/pengeluaran), kategori, jumlah, tanggal, dan keterangan. Anda dapat melampirkan bukti transaksi jika ada. Klik 'Simpan' untuk menyimpan transaksi.",
      category: "Keuangan",
    },
  ],

  features: [
    {
      name: "Manajemen Data Master",
      description:
        "Kelola informasi siswa, guru, kelas, dan mata pelajaran termasuk jadwal",
      tips: [
        "Gunakan fitur ekspor untuk membuat cadangan data penting",
        "Update data master di awal tahun ajaran untuk meminimalisir kesalahan",
        "Verifikasi data secara berkala untuk memastikan keakuratan",
      ],
    },
    {
      name: "Pengelolaan Akun",
      description: "Kontrol penuh atas akun pengguna dalam sistem SIMBA",
      tips: [
        "Simpan kredensial admin di tempat yang aman",
        "Gunakan fitur 'Menyamar' untuk membantu pengguna yang mengalami kesulitan",
        "Lakukan audit akun secara berkala untuk keamanan sistem",
      ],
    },
    {
      name: "Pencatatan Keuangan",
      description:
        "Catat pengeluaran dan pemasukan dengan filter tanggal dan kategori",
      tips: [
        "Kategorikan transaksi dengan benar untuk memudahkan pelaporan",
        "Lampirkan bukti digital untuk setiap transaksi penting",
        "Lakukan rekonsiliasi data keuangan secara berkala",
      ],
    },
    {
      name: "Ekspor Data",
      description:
        "Unduh data master atau laporan keuangan dalam format CSV, Excel, atau PDF",
      tips: [
        "Gunakan filter untuk mendapatkan data yang spesifik sebelum mengekspor",
        "Pilih format yang sesuai dengan kebutuhan (PDF untuk cetakan, Excel/CSV untuk analisis)",
        "Simpan hasil ekspor di tempat yang aman dan terorganisir",
      ],
    },
    {
      name: "Pengaturan Profil",
      description:
        "Kelola informasi profil, keamanan akun, dan sesi login Anda",
      tips: [
        "Gunakan foto profil profesional untuk identifikasi yang lebih baik",
        "Ubah kata sandi secara berkala untuk keamanan tambahan",
        "Periksa sesi login aktif dan cabut sesi yang tidak dikenali",
      ],
    },
    {
      name: "Kustomisasi Tema",
      description:
        "Pilih tema tampilan yang sesuai dengan preferensi visual Anda",
      tips: [
        "Coba berbagai tema untuk menemukan yang paling nyaman untuk mata Anda",
        "Gunakan tema gelap untuk penggunaan di malam hari",
        "Pilih tema yang meningkatkan produktivitas dan fokus Anda",
      ],
    },
  ],

  tips: [
    {
      icon: "💡",
      title: "Tip Pro: Keamanan Akun",
      description:
        "Gunakan kata sandi yang kuat dan simpan dengan aman. Sebagai admin, akun Anda memiliki akses ke semua data penting dalam sistem.",
    },
    {
      icon: "⚡",
      title: "Efisiensi CRUD Data Master",
      description:
        "Kelola data dengan sistematis dan gunakan fitur ekspor untuk membuat cadangan penting atau membuat laporan komprehensif dalam berbagai format.",
    },
    {
      icon: "🔔",
      title: "Pengelolaan Keuangan Efektif",
      description:
        "Catat transaksi segera setelah terjadi dan gunakan kategori yang konsisten untuk memudahkan pelaporan dan analisis keuangan.",
    },
    {
      icon: "⚙️",
      title: "Personalisasi Tampilan",
      description:
        "Manfaatkan fitur pengaturan tema untuk menyesuaikan tampilan SIMBA sesuai preferensi Anda, meningkatkan kenyamanan dan produktivitas.",
    },
  ],
};

export const teacherHelpData: HelpData = {
  title: "Panduan Guru SIMBA",
  description:
    "Panduan lengkap untuk guru dalam menggunakan Sistem Informasi Manajemen Bustanul Arifin",

  quickStart: [
    {
      title: "Melihat Jadwal Mengajar",
      content:
        "Akses menu 'Jadwal Mengajar' untuk melihat jadwal mengajar Anda. Di halaman ini, Anda dapat melihat jadwal lengkap yang telah disusun oleh administrator sekolah.",
    },
    {
      title: "Melihat Kelas Wali",
      content:
        "Kunjungi halaman 'Kelas Saya' untuk melihat informasi tentang kelas yang Anda walikan (jika Anda ditugaskan sebagai wali kelas). Anda dapat melihat daftar siswa dan informasi kelas.",
    },
    {
      title: "Mengatur Profil & Tema",
      content:
        "Klik menu 'Profil' untuk mengatur foto profil, username, dan nama tampilan Anda. Kunjungi menu 'Pengaturan' untuk memilih tema yang Anda sukai seperti Ghibli, Bold Tech, dan tema lainnya.",
    },
  ],

  faqs: [
    // Profil & Pengaturan
    {
      question: "Bagaimana cara mengubah foto profil?",
      answer:
        "Klik menu 'Profil' di sidebar, kemudian pilih tab 'Informasi Umum'. Klik pada area foto profil untuk mengunggah foto baru. Setelah memilih foto, klik 'Simpan' untuk mengonfirmasi perubahan.",
      category: "Profil & Pengaturan",
    },
    {
      question: "Bagaimana cara mengubah username atau nama tampilan?",
      answer:
        "Akses menu 'Profil' di sidebar, pilih tab 'Informasi Umum'. Anda dapat mengubah username dan nama tampilan pada form yang tersedia. Setelah melakukan perubahan, klik tombol 'Simpan'.",
      category: "Profil & Pengaturan",
    },
    {
      question: "Bagaimana cara mengubah kata sandi?",
      answer:
        "Klik menu 'Profil' di sidebar, lalu pilih tab 'Keamanan'. Masukkan kata sandi lama Anda, kemudian masukkan dan konfirmasi kata sandi baru. Klik 'Perbarui Kata Sandi' untuk menyimpan perubahan.",
      category: "Profil & Pengaturan",
    },
    {
      question: "Bagaimana cara menghapus sesi login lain?",
      answer:
        "Klik menu 'Profil' di sidebar, pilih tab 'Sesi'. Di sini Anda akan melihat daftar perangkat yang saat ini login ke akun Anda. Klik 'Cabut Sesi' pada sesi yang ingin Anda akhiri, atau 'Cabut Semua Sesi Lain' untuk mengakhiri semua login kecuali yang sedang Anda gunakan.",
      category: "Profil & Pengaturan",
    },
    {
      question: "Bagaimana cara mengubah tema aplikasi?",
      answer:
        "Akses menu 'Pengaturan' di sidebar. Pada bagian tema, Anda dapat memilih dari berbagai pilihan tema seperti Ghibli, Bold Tech, dan tema lainnya. Perubahan tema akan langsung diterapkan tanpa perlu me-refresh halaman.",
      category: "Profil & Pengaturan",
    },

    // Jadwal & Kelas
    {
      question: "Bagaimana cara melihat jadwal mengajar?",
      answer:
        "Akses menu 'Jadwal Mengajar' di sidebar. Halaman ini menampilkan jadwal mengajar Anda yang telah disusun oleh administrator. Anda dapat melihat jadwal berdasarkan hari dan jam.",
      category: "Jadwal & Kelas",
    },
    {
      question: "Bagaimana cara melihat informasi kelas wali?",
      answer:
        "Klik menu 'Kelas Saya' di sidebar. Di halaman ini, Anda akan melihat informasi tentang kelas yang Anda walikan, termasuk daftar siswa dan informasi umum tentang kelas tersebut.",
      category: "Jadwal & Kelas",
    },
    {
      question: "Dapatkah saya mengubah jadwal mengajar saya?",
      answer:
        "Tidak, jadwal mengajar dibuat dan dikelola oleh administrator sekolah. Jika Anda memerlukan perubahan pada jadwal, silakan hubungi administrator atau kepala sekolah.",
      category: "Jadwal & Kelas",
    },
  ],

  features: [
    {
      name: "Jadwal Mengajar",
      description:
        "Lihat jadwal mengajar yang telah disusun oleh administrator sekolah",
      tips: [
        "Periksa jadwal secara rutin untuk mempersiapkan pembelajaran",
        "Catat jadwal mengajar untuk referensi pribadi jika diperlukan",
        "Pantau perubahan jadwal yang mungkin diumumkan oleh administrator",
      ],
    },
    {
      name: "Informasi Kelas Wali",
      description: "Akses informasi tentang kelas yang Anda walikan",
      tips: [
        "Tinjau daftar siswa di awal semester untuk mengenal siswa Anda",
        "Simpan informasi penting tentang kelas untuk referensi cepat",
        "Pantau perkembangan siswa melalui informasi yang tersedia",
      ],
    },
    {
      name: "Pengaturan Profil",
      description:
        "Kelola informasi profil, keamanan akun, dan sesi login Anda",
      tips: [
        "Gunakan foto profil profesional untuk identifikasi yang lebih baik",
        "Ubah kata sandi secara berkala untuk keamanan tambahan",
        "Periksa sesi login aktif dan cabut sesi yang tidak dikenali",
      ],
    },
    {
      name: "Kustomisasi Tema",
      description:
        "Pilih tema tampilan yang sesuai dengan preferensi visual Anda",
      tips: [
        "Coba berbagai tema untuk menemukan yang paling nyaman untuk mata Anda",
        "Gunakan tema gelap untuk penggunaan di malam hari",
        "Pilih tema yang meningkatkan produktivitas dan fokus Anda",
      ],
    },
  ],

  tips: [
    {
      icon: "🔑",
      title: "Keamanan Akun",
      description:
        "Pastikan untuk keluar dari akun Anda ketika menggunakan komputer bersama dan secara rutin periksa sesi aktif pada tab 'Sesi' di menu Profil.",
    },
    {
      icon: "📱",
      title: "Akses Mobile-Friendly",
      description:
        "SIMBA dirancang responsif, sehingga Anda dapat mengakses informasi jadwal dan kelas dari perangkat mobile ketika tidak berada di sekolah.",
    },
    {
      icon: "⚙️",
      title: "Personalisasi Tampilan",
      description:
        "Manfaatkan fitur pengaturan tema untuk menyesuaikan tampilan SIMBA sesuai preferensi Anda, meningkatkan kenyamanan dan produktivitas.",
    },
  ],
};

export const studentHelpData: HelpData = {
  title: "Panduan Siswa SIMBA",
  description:
    "Panduan lengkap untuk siswa dalam menggunakan Sistem Informasi Manajemen Bustanul Arifin",

  quickStart: [
    {
      title: "Melihat Jadwal Pelajaran",
      content:
        "Akses menu 'Jadwal Pelajaran' untuk melihat jadwal pelajaran kelas Anda. Di halaman ini, Anda dapat melihat mata pelajaran, waktu, dan guru pengampu untuk setiap jadwal yang telah disusun.",
    },
    {
      title: "Melihat Riwayat Kelas",
      content:
        "Kunjungi halaman 'Riwayat Kelas' untuk melihat informasi tentang kelas-kelas yang telah Anda lalui dan lulus. Ini termasuk informasi tentang kelas, tahun ajaran, dan data akademik terkait.",
    },
    {
      title: "Mengatur Profil & Tema",
      content:
        "Klik menu 'Profil' untuk mengatur foto profil, username, dan nama tampilan Anda. Kunjungi menu 'Pengaturan' untuk memilih tema yang Anda sukai seperti Ghibli, Bold Tech, dan tema lainnya.",
    },
  ],

  faqs: [
    // Profil & Pengaturan
    {
      question: "Bagaimana cara mengubah foto profil?",
      answer:
        "Klik menu 'Profil' di sidebar, kemudian pilih tab 'Informasi Umum'. Klik pada area foto profil untuk mengunggah foto baru. Setelah memilih foto, klik 'Simpan' untuk mengonfirmasi perubahan.",
      category: "Profil & Pengaturan",
    },
    {
      question: "Bagaimana cara mengubah username atau nama tampilan?",
      answer:
        "Akses menu 'Profil' di sidebar, pilih tab 'Informasi Umum'. Anda dapat mengubah username dan nama tampilan pada form yang tersedia. Setelah melakukan perubahan, klik tombol 'Simpan'.",
      category: "Profil & Pengaturan",
    },
    {
      question: "Bagaimana cara mengubah kata sandi?",
      answer:
        "Klik menu 'Profil' di sidebar, lalu pilih tab 'Keamanan'. Masukkan kata sandi lama Anda, kemudian masukkan dan konfirmasi kata sandi baru. Klik 'Perbarui Kata Sandi' untuk menyimpan perubahan.",
      category: "Profil & Pengaturan",
    },
    {
      question: "Bagaimana cara menghapus sesi login lain?",
      answer:
        "Klik menu 'Profil' di sidebar, pilih tab 'Sesi'. Di sini Anda akan melihat daftar perangkat yang saat ini login ke akun Anda. Klik 'Cabut Sesi' pada sesi yang ingin Anda akhiri, atau 'Cabut Semua Sesi Lain' untuk mengakhiri semua login kecuali yang sedang Anda gunakan.",
      category: "Profil & Pengaturan",
    },
    {
      question: "Bagaimana cara mengubah tema aplikasi?",
      answer:
        "Akses menu 'Pengaturan' di sidebar. Pada bagian tema, Anda dapat memilih dari berbagai pilihan tema seperti Ghibli, Bold Tech, dan tema lainnya. Perubahan tema akan langsung diterapkan tanpa perlu me-refresh halaman.",
      category: "Profil & Pengaturan",
    },

    // Jadwal & Akademik
    {
      question: "Bagaimana cara melihat jadwal pelajaran?",
      answer:
        "Akses menu 'Jadwal Pelajaran' di sidebar. Halaman ini menampilkan jadwal pelajaran Anda yang telah disusun oleh sekolah. Anda dapat melihat jadwal berdasarkan hari dan jam.",
      category: "Jadwal & Akademik",
    },
    {
      question: "Bagaimana cara melihat riwayat kelas yang telah diikuti?",
      answer:
        "Klik menu 'Riwayat Kelas' di sidebar. Di halaman ini, Anda akan melihat daftar kelas yang telah Anda lalui dan lulus, termasuk tahun ajaran dan data akademik terkait.",
      category: "Jadwal & Akademik",
    },
    {
      question: "Apakah saya bisa melihat nilai dalam SIMBA?",
      answer:
        "Saat ini, fitur untuk melihat nilai belum tersedia dalam SIMBA. Nilai akan diinformasikan melalui rapor fisik atau saluran lain yang ditentukan oleh sekolah.",
      category: "Jadwal & Akademik",
    },
  ],

  features: [
    {
      name: "Jadwal Pelajaran",
      description:
        "Lihat jadwal pelajaran kelas Anda yang telah disusun oleh sekolah",
      tips: [
        "Periksa jadwal secara rutin untuk mempersiapkan pembelajaran",
        "Catat jadwal pelajaran untuk referensi pribadi jika diperlukan",
        "Pantau perubahan jadwal yang mungkin diumumkan oleh sekolah",
      ],
    },
    {
      name: "Riwayat Kelas",
      description: "Akses informasi tentang kelas-kelas yang telah Anda lalui",
      tips: [
        "Tinjau riwayat kelas untuk melacak perjalanan akademik Anda",
        "Gunakan informasi ini untuk referensi saat merencanakan studi lanjutan",
        "Simpan informasi penting tentang kelas-kelas terdahulu",
      ],
    },
    {
      name: "Pengaturan Profil",
      description:
        "Kelola informasi profil, keamanan akun, dan sesi login Anda",
      tips: [
        "Gunakan foto profil yang jelas untuk identifikasi yang lebih baik",
        "Ubah kata sandi secara berkala untuk keamanan tambahan",
        "Periksa sesi login aktif dan cabut sesi yang tidak dikenali",
      ],
    },
    {
      name: "Kustomisasi Tema",
      description:
        "Pilih tema tampilan yang sesuai dengan preferensi visual Anda",
      tips: [
        "Coba berbagai tema untuk menemukan yang paling nyaman untuk mata Anda",
        "Gunakan tema gelap untuk penggunaan di malam hari",
        "Pilih tema yang meningkatkan produktivitas dan fokus Anda",
      ],
    },
  ],

  tips: [
    {
      icon: "📅",
      title: "Jadwal di Genggaman",
      description:
        "SIMBA dapat diakses dari perangkat mobile, sehingga Anda selalu dapat memeriksa jadwal pelajaran dari mana saja.",
    },
    {
      icon: "🔑",
      title: "Keamanan Akun",
      description:
        "Pastikan untuk keluar dari akun Anda ketika menggunakan komputer bersama dan secara rutin periksa sesi aktif pada tab 'Sesi' di menu Profil.",
    },
    {
      icon: "⚙️",
      title: "Personalisasi Tampilan",
      description:
        "Manfaatkan fitur pengaturan tema untuk menyesuaikan tampilan SIMBA sesuai preferensi Anda, meningkatkan pengalaman belajar Anda.",
    },
  ],
};
