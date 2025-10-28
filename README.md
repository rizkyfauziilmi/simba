# SIMBA - Sistem Informasi Manajemen

Aplikasi SIMBA adalah sistem informasi manajemen berbasis web yang dibangun dengan [Next.js](https://nextjs.org).

## Kloning Repositori

Anda dapat mengkloning repositori ini menggunakan metode HTTPS atau SSH:

### Metode HTTPS

```bash
git clone https://github.com/rizkyfauziilmi/simba.git
cd simba
```

### Metode SSH (Disarankan)

1. Pastikan Anda telah [mengatur SSH key di GitHub](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)

2. Kloning repositori:

```bash
git clone git@github.com:rizkyfauziilmi/simba.git
cd simba
```

## Dokumentasi

Aplikasi ini memiliki dua dokumentasi utama:

1. [Panduan Development](docs/DEVELOPMENT.md) - Panduan untuk mengatur environment development lokal
2. [Panduan Deployment](docs/DEPLOY.md) - Panduan untuk men-deploy aplikasi di server Ubuntu lokal

## Memulai Development

Untuk memulai development, ikuti panduan development di [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) yang mencakup:

- Instalasi dependencies
- Konfigurasi environment
- Menjalankan database PostgreSQL
- Menjalankan aplikasi

## Teknologi yang Digunakan

- **Framework**: [Next.js](https://nextjs.org)
- **Database**: PostgreSQL [PostgreSQL](https://www.postgresql.org/)
- **ORM**: Prisma [Prisma](https://www.prisma.io/)
- **API**: [TRPC](https://trpc.io)
- **UI**: [Shadcn](https://ui.shadcn.com)
- **Containerization**: Docker [Docker](https://www.docker.com/)
- **Styling**: Tailwind CSS [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: Better-Auth [Better-Auth](https://better-auth.com/)

## Deployment

Untuk men-deploy aplikasi ke server Ubuntu lokal, ikuti panduan deployment di [Panduan Deployment](docs/DEPLOY.md) yang mencakup:

- Konfigurasi IP statis
- Instalasi software yang dibutuhkan
- Konfigurasi Nginx sebagai reverse proxy
- Deployment menggunakan Docker Compose
