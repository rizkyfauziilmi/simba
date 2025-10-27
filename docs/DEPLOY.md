# Panduan Deployment Aplikasi SIMBA

Panduan ini akan menjelaskan langkah-langkah untuk melakukan deployment aplikasi SIMBA pada server Ubuntu dengan IP statis dan konfigurasi reverse proxy menggunakan Nginx.

## Daftar Isi
1. [Konfigurasi IP Statis](#1-konfigurasi-ip-statis)
2. [Instalasi Software yang Dibutuhkan](#2-instalasi-software-yang-dibutuhkan)
3. [Konfigurasi SSH untuk GitHub](#3-konfigurasi-ssh-untuk-github)
4. [Kloning Repositori](#4-kloning-repositori)
5. [Konfigurasi Environment](#5-konfigurasi-environment)
6. [Instalasi dan Konfigurasi Nginx](#6-instalasi-dan-konfigurasi-nginx)
7. [Deployment dengan Docker Compose](#7-deployment-dengan-docker-compose)
8. [Konfigurasi Firewall](#8-konfigurasi-firewall)
9. [Verifikasi Deployment](#9-verifikasi-deployment)
10. [Koneksi SSH dari Laptop Lain](#10-koneksi-ssh-dari-laptop-lain)
11. [Troubleshooting](#11-troubleshooting)

## 1. Konfigurasi IP Statis

Pertama, kita perlu mengatur IP statis pada server Ubuntu:

### Identifikasi Interface Jaringan

```bash
# Melihat daftar interface jaringan
ip link show
```

Catat nama interface jaringan utama Anda (biasanya `enp0s3`, `ens33`, `eth0`, atau sejenisnya).

### Konfigurasi IP Statis menggunakan Netplan (Ubuntu 18.04 ke atas)

1. Identifikasi pengaturan jaringan saat ini:

```bash
# Cek IP saat ini
ip addr

# Cek gateway
ip route | grep default

# Cek DNS
cat /etc/resolv.conf
```

2. Buat atau edit file konfigurasi Netplan:

```bash
sudo nano /etc/netplan/00-installer-config.yaml
```

3. Tambahkan konfigurasi berikut (sesuaikan dengan jaringan Anda):

```yaml
network:
  version: 2
  ethernets:
    enp0s3:  # Ganti dengan nama interface Anda
      dhcp4: no
      addresses:
        - 192.168.1.100/24  # Ganti dengan IP statis yang diinginkan
      gateway4: 192.168.1.1  # Ganti dengan IP router/gateway Anda
      nameservers:
          addresses: [8.8.8.8, 8.8.4.4]  # Server DNS
```

4. Terapkan perubahan:

```bash
# Uji konfigurasi
sudo netplan try

# Terapkan konfigurasi secara permanen
sudo netplan apply
```

5. Verifikasi IP baru:

```bash
ip addr show
```

### Untuk Ubuntu Versi Lama (menggunakan file interfaces)

1. Edit file interfaces:

```bash
sudo nano /etc/network/interfaces
```

2. Konfigurasi interface jaringan:

```
auto enp0s3  # Ganti dengan nama interface Anda
iface enp0s3 inet static
    address 192.168.1.100
    netmask 255.255.255.0
    gateway 192.168.1.1
    dns-nameservers 8.8.8.8 8.8.4.4
```

3. Restart layanan networking:

```bash
sudo systemctl restart networking
```

## 2. Instalasi Software yang Dibutuhkan

Install Docker, Docker Compose, Git, dan tools lainnya:

```bash
# Update daftar paket
sudo apt update

# Install paket yang dibutuhkan
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common git

# Tambahkan GPG key Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Tambahkan repositori Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update lagi daftar paket
sudo apt update

# Install Docker CE
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Jalankan Docker dan aktifkan autostart
sudo systemctl start docker
sudo systemctl enable docker

# Tambahkan user ke group docker agar bisa menjalankan Docker tanpa sudo
sudo usermod -aG docker $USER
```

Log out dan log in kembali, atau jalankan:

```bash
newgrp docker  # Untuk menggunakan Docker tanpa logout pada sesi saat ini
```

## 3. Konfigurasi SSH untuk GitHub

Generate dan konfigurasi SSH key untuk akses GitHub:

```bash
# Generate SSH key (tekan Enter untuk menerima default, opsional set passphrase)
ssh-keygen -t ed25519 -C "email-anda@example.com"

# Jalankan SSH agent
eval "$(ssh-agent -s)"

# Tambahkan SSH key ke agent
ssh-add ~/.ssh/id_ed25519

# Tampilkan public key untuk ditambahkan ke GitHub
cat ~/.ssh/id_ed25519.pub
```

Salin output dari perintah terakhir, yang merupakan public SSH key Anda.

Kemudian, tambahkan SSH key ini ke akun GitHub Anda:
1. Login ke GitHub
2. Buka Settings > SSH and GPG keys
3. Klik "New SSH key"
4. Paste public key dan simpan

Uji koneksi SSH:
```bash
ssh -T git@github.com
```

Anda seharusnya melihat pesan seperti "Hi username! You've successfully authenticated, but GitHub does not provide shell access."

## 4. Kloning Repositori

Sekarang Anda dapat mengkloning repositori:

```bash
# Buat direktori untuk project
sudo mkdir -p /opt/simba

# Atur kepemilikan yang sesuai
sudo chown $USER:$USER /opt/simba

# Pindah ke direktori tersebut
cd /opt/simba

# Kloning repositori
git clone git@github.com:rizkyfauziilmi/simba.git .
```

## 5. Konfigurasi Environment

Copy file `.env.example` menjadi `.env`:

```bash
# Copy file .env.example menjadi .env
cp .env.example .env
```

Update file `.env` dengan IP statis Anda:

```bash
# Edit file .env
nano .env
```

Update nilai `DATABASE_URL`, `BETTER_AUTH_SECRET`, dan `BETTER_AUTH_URL`:

```
DATABASE_URL="postgresql://user:password@postgres:5432/mydb?schema=public"

BETTER_AUTH_SECRET= # Generate dengan openssl rand -base64 32
BETTER_AUTH_URL=http://192.168.1.100  # Ganti dengan IP statis Anda
```

## 6. Instalasi dan Konfigurasi Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Buat file konfigurasi untuk aplikasi Anda
sudo nano /etc/nginx/sites-available/simba
```

Tambahkan konfigurasi berikut (ganti dengan IP statis Anda):

```
server {
    listen 80;
    server_name 192.168.1.100;  # Ganti dengan IP statis Anda

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Aktifkan site:

```bash
# Buat symbolic link untuk mengaktifkan site
sudo ln -s /etc/nginx/sites-available/simba /etc/nginx/sites-enabled/

# Hapus site default untuk menghindari konflik (opsional)
sudo rm /etc/nginx/sites-enabled/default

# Uji konfigurasi Nginx
sudo nginx -t

# Reload Nginx untuk menerapkan perubahan
sudo systemctl reload nginx
```

## 7. Deployment dengan Docker Compose

Deploy aplikasi menggunakan Docker Compose:

```bash
# Pindah ke direktori project
cd /opt/simba

# Build dan jalankan container dalam mode detached
npm run docker:up:detached
```

Ini akan menarik image yang diperlukan, build aplikasi Anda, dan menjalankan service sesuai dengan file docker-compose.yml.

## 8. Konfigurasi Firewall

Izinkan traffic HTTP melalui firewall:

```bash
# Install UFW jika belum terinstall
sudo apt install -y ufw

# Izinkan SSH (penting untuk tidak mengunci diri sendiri)
sudo ufw allow ssh

# Izinkan traffic HTTP
sudo ufw allow 80/tcp

# Aktifkan firewall jika belum diaktifkan
sudo ufw enable

# Cek status
sudo ufw status
```

## 9. Verifikasi Deployment

Periksa bahwa container berjalan dengan baik:

```bash
docker-compose ps
docker-compose logs
```

Sekarang Anda seharusnya dapat mengakses aplikasi dengan memasukkan alamat IP statis Anda (misalnya, `http://192.168.1.100`) di browser web dari perangkat apapun dalam jaringan yang sama.

## 10. Koneksi SSH dari Laptop Lain

Untuk mengakses server Ubuntu dari laptop atau komputer lain dalam jaringan, Anda dapat menggunakan SSH. Ikuti langkah-langkah berikut:

### Di Server Ubuntu

1. Pastikan SSH server sudah terinstal:

```bash
sudo apt install openssh-server
```

2. Periksa status layanan SSH:

```bash
sudo systemctl status ssh
```

3. Jika belum berjalan, aktifkan layanan SSH:

```bash
sudo systemctl enable ssh
sudo systemctl start ssh
```

4. Pastikan port SSH diizinkan di firewall:

```bash
sudo ufw allow ssh
```

### Di Laptop/Komputer Lain (Windows)

1. Jika menggunakan Windows, install klien SSH seperti PuTTY atau gunakan Windows Terminal/PowerShell:

   Menggunakan PowerShell/Windows Terminal:
   ```
   ssh username@192.168.1.100
   ```

   Ganti `username` dengan nama pengguna di server Ubuntu dan `192.168.1.100` dengan IP statis server Anda.

### Di Laptop/Komputer Lain (Linux/Mac)

1. Buka terminal dan gunakan perintah ssh:

```bash
ssh username@192.168.1.100
```

2. Untuk mempermudah koneksi, Anda dapat membuat konfigurasi SSH:

```bash
nano ~/.ssh/config
```

3. Tambahkan konfigurasi berikut:

```
Host simba
    HostName 192.168.1.100
    User username
    Port 22
```

4. Sekarang Anda dapat terhubung hanya dengan mengetik:

```bash
ssh simba
```

### Transfer File dengan SCP atau SFTP

1. Untuk mentransfer file dari laptop ke server:

```bash
scp /path/to/local/file username@192.168.1.100:/path/to/destination
```

2. Untuk mentransfer file dari server ke laptop:

```bash
scp username@192.168.1.100:/path/to/remote/file /path/to/local/destination
```

## 11. Troubleshooting

Jika Anda mengalami masalah:

1. Periksa status container Docker:
   ```bash
   docker ps
   docker-compose logs
   ```

2. Periksa log Nginx:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

3. Uji aplikasi secara langsung:
   ```bash
   curl http://localhost:3000
   ```

4. Periksa apakah port terbuka:
   ```bash
   sudo netstat -tulpn | grep -E '80|3000'
   ```

5. Jika ada masalah dengan koneksi database, periksa:
   ```bash
   docker-compose exec postgres pg_isready -U user -d mydb
   ```

---

Panduan ini harus membantu Anda untuk mengatur IP statis dan men-deploy aplikasi SIMBA dengan sukses pada server Ubuntu Anda. Ingat untuk mengganti alamat IP contoh dengan nilai aktual yang sesuai dengan konfigurasi jaringan Anda.
