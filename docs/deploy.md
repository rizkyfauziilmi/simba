# 1. Prepare Your Ubuntu Server

## 1.1. (Optional) Set a Static IP Address

If you want your server to always have the same local IP, set a static IP using Netplan:

1. Find your network interface name:
   ```sh
   ip link
   ```
   (Usually `eth0` or `ens33`.)

2. Edit Netplan config (replace `01-netcfg.yaml` with your actual file in `/etc/netplan/`):
   ```sh
   sudo nano /etc/netplan/01-netcfg.yaml
   ```

3. Example config (replace with your details):
   ```yaml
   network:
     version: 2
     ethernets:
       eth0:
         dhcp4: no
         addresses: [192.168.1.100/24]
         gateway4: 192.168.1.1
         nameservers:
           addresses: [8.8.8.8,8.8.4.4]
   ```
   - `addresses`: Your desired static IP and subnet.
   - `gateway4`: Your router’s IP.
   - `nameservers`: DNS servers.

4. Apply changes:
   ```sh
   sudo netplan apply
   ```

5. Verify:
   ```sh
   ip addr show eth0
   ```

If you skip this step, your server may get a different IP after reboot (DHCP).
---

# 2. Install Docker and Docker Compose

```sh
sudo apt update
sudo apt install docker.io docker-compose -y
sudo systemctl enable --now docker
```

---

# 3. Copy Your Project to the Server

- Use `scp`, `rsync`, or `git clone` to transfer your project folder.

Example with `scp`:
```sh
scp -r /path/to/your/project username@192.168.1.100:/home/username/
```

---

# 4. Configure Environment Variables

Edit your `.env` file in the project directory:

```env
DATABASE_URL="postgresql://user:password@postgres:5432/mydb?schema=public"
BETTER_AUTH_SECRET=KyKSqDUMz8lU2DZ0oC8kV7+JbLZxgAJSYXMj+0rP8bI=
BETTER_AUTH_URL=http://your-server-ip:3000
```

- For local network, set `BETTER_AUTH_URL` to your server's IP, e.g. `http://192.168.1.100:3000`
- Make sure `.env` is present before running Docker Compose.

---

# 5. Configure Docker Compose

Your `docker-compose.yml` for local development should look like this:

```yaml
services:
  postgres:
    image: postgres:17
    restart: always
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  web:
    build: .
    depends_on:
      - postgres
    command: sh -c "npx prisma migrate deploy && node server.js"
    environment:
      - DATABASE_URL=postgresql://user:password@postgres:5432/mydb?schema=public
      - BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}
      - BETTER_AUTH_URL=${BETTER_AUTH_URL}
    ports:
      - "3000:3000"
    env_file:
      - .env

volumes:
  postgres_data:
```
- No resource limits or healthchecks for local use.
- The web service runs Prisma migrations automatically before starting.

---

# 6. Build and Start Your Containers

From your project directory:

```sh
docker compose up --build -d
```
Or, if you use npm scripts:
```sh
npm run docker:compose:up:build:detached
```

---

# 7. (Optional) Install and Configure Nginx

If you want to access your app via port 80 (HTTP) or set up a custom domain, install Nginx:

```sh
sudo apt install nginx -y
```

You can set up a reverse proxy if needed, but for local network access, you can use the server's IP and port 3000 directly.

---

# 8. (Optional) Set Up SSL with Let’s Encrypt

If you have a public domain pointing to your server, you can use Certbot and Nginx for SSL.
For local network only, you can skip this step.

---

# 9. Open Firewall Ports

If using UFW:

```sh
sudo ufw allow 3000
sudo ufw allow 5432
sudo ufw reload
```

(Allow 80/443 if using Nginx and SSL.)

---

# 10. Access Your App

- On your local network:
  `http://your-server-ip:3000`
- From any device in the same network.

---

# 11. Updating Your App

- Pull new code or make changes.
- Rebuild and restart:
  ```sh
  docker compose up --build -d
  ```
  or
  ```sh
  npm run docker:compose:up:build:detached
  ```

---
