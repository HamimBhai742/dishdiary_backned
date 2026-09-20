# 🚀 DishDiary Backend — VPS Docker Deployment Guide

This guide explains how to deploy and run the **DishDiary Backend** on any Linux VPS (Ubuntu, Debian, DigitalOcean, Hetzner, AWS EC2, Contabo, Linode, etc.) using Docker.

---

## 1. Prerequisites on your VPS

Ensure **Docker** and **Docker Compose** are installed. If not, run:

```bash
# Install Docker via official script
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add current user to docker group (optional, avoids typing sudo)
sudo usermod -aG docker $USER
newgrp docker
```

---

## 2. Deploying the Backend

### Option A: Using Docker Compose (Recommended)

1. Clone or copy the `backend` folder to your VPS:
   ```bash
   git clone https://github.com/<your-username>/dishdiry.git
   cd dishdiry/backend
   ```

2. Create and configure your `.env` file:
   ```bash
   cp .env.example .env
   nano .env
   ```
   *Fill in your MongoDB Atlas URL, JWT secret, Cloudinary keys, and frontend domain.*

3. Start the container in detached mode:
   ```bash
   docker compose up -d --build
   ```

4. Verify that the container is running:
   ```bash
   docker compose ps
   ```

---

### Option B: Using Standalone Docker Commands

1. **Build the Docker image:**
   ```bash
   docker build -t dishdiary-backend:latest .
   ```

2. **Run the container:**
   ```bash
   docker run -d \
     --name dishdiary-backend \
     --restart always \
     -p 5942:5942 \
     --env-file .env \
     dishdiary-backend:latest
   ```

---

## 3. Useful Management Commands

- **View Live Logs:**
  ```bash
  docker compose logs -f
  ```
  *(Or `docker logs -f dishdiary-backend`)*

- **Restart the Server:**
  ```bash
  docker compose restart
  ```

- **Rebuild after Code Changes:**
  ```bash
  docker compose up -d --build
  ```

- **Stop the Server:**
  ```bash
  docker compose down
  ```

- **Check API Status:**
  ```bash
  curl http://localhost:5942/
  # Output: my-server is running............
  ```

---

## 4. Nginx Reverse Proxy & SSL for Cloudflare Subdomain

To connect your subdomain `https://api-dishdiary.hamim.dpdns.org/` to your Docker backend on port `5942`:

1. **Install Nginx & Certbot:**
   ```bash
   sudo apt update
   sudo apt install -y nginx certbot python3-certbot-nginx
   ```

2. **Create Nginx Configuration:**
   Create `/etc/nginx/sites-available/dishdiary-api`:
   ```bash
   sudo nano /etc/nginx/sites-available/dishdiary-api
   ```
   Paste the following:
   ```nginx
   server {
       server_name api-dishdiary.hamim.dpdns.org;

       location / {
           proxy_pass http://127.0.0.1:5942;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. **Enable the site and restart Nginx:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/dishdiary-api /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

4. **Issue Free SSL Certificate (HTTPS):**
   ```bash
   sudo certbot --nginx -d api-dishdiary.hamim.dpdns.org
   ```
   *Certbot will automatically install the certificate and enable HTTPS!*

