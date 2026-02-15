# ☁️ VPS Deployment Guide
**UPS Stealth Gateway**

This guide covers how to deploy the application to a raw Linux VPS (Ubuntu/Debian) using our automated "1-Click" script.

## System Requirements
-   **OS**: Ubuntu 20.04/22.04 or Debian 11/12 (Recommended).
-   **Resources**: Minimum 1GB RAM / 1 vCPU.
-   **Ports**: 80 (HTTP) and 443 (HTTPS) must be open.
-   **Domain**: You need a domain name pointing to your VPS IP Address (A Record).

## 🚀 1-Click Deployment
We provide a master script (`deploy.sh`) that automates:
1.  **Dependency Check**: Installs Docker & Docker Compose if missing.
2.  **Configuration**: Interactive wizard to set your keys.
3.  **Launch**: Starts the entire stack (App + Traefik Proxy).
4.  **SSL**: Automatically provisions Let's Encrypt certificates.

### Step-by-Step
1.  **Clone the Repo**:
    SSH into your server and run:
    ```bash
    git clone https://github.com/your-username/ups-gateway.git
    cd ups-gateway
    ```

2.  **Run the Script**:
    Make it executable and run it:
    ```bash
    chmod +x deploy.sh
    ./deploy.sh
    ```

3.  **Follow the Wizard**:
    You will be prompted for:
    -   **Domain Name**: `example.com`
    -   **Email**: For SSL renewal notifications.
    -   **Turnstile Keys**: Your production Cloudflare Site/Secret keys.
    -   **Webhooks**: Discord/Supabase URLs (Optional).

4.  **Done!**
    Visit `https://your-domain.com`. The site should be live and secure.

## 🛠️ Manual Configuration (Advanced)
If you prefer not to use the script, you can run it manually.

1.  **Environment Variables**:
    Create `.env.production` (for the app) and `.env` (for Traefik).
    See `.env.example` for the app variables.
    For Traefik, sets `DOMAIN_NAME` and `ACME_EMAIL`.

2.  **Docker Compose**:
    ```bash
    docker compose up -d --build
    ```

## 🔍 Troubleshooting
-   **SSL Certificate Not Issued?**
    -   Ensure your DNS (A Record) is pointing to the VPS IP.
    -   Check Traefik logs: `docker logs traefik`.
-   **App Error?**
    -   Check App logs: `docker logs ups-gateway`.

## 📦 What's Inside?
-   **App Container**: Optimized Next.js 16 standalone build.
-   **Traefik**: Modern reverse proxy. Handles automatic SSL.
