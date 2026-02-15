import { get, set, update } from "idb-keyval";

export interface AnalyticsEvent {
    id: string;
    type: "form_submission" | "visit" | "interaction" | "test_concurrency";
    timestamp: string;
    payload: any;
    status: "pending" | "processing" | "failed";
    retryCount: number;
    sentTo: string[]; // Track which destinations have already received this event
}

const STORAGE_KEY = "analytics_queue";

export const storage = {
    async addToQueue(event: Omit<AnalyticsEvent, "id" | "status" | "retryCount" | "sentTo">) {
        const newEvent: AnalyticsEvent = {
            ...event,
            id: crypto.randomUUID(),
            status: "pending",
            retryCount: 0,
            sentTo: [],
        };

        await update(STORAGE_KEY, (val: AnalyticsEvent[] = []) => {
            return [...val, newEvent];
        });

        return newEvent;
    },

    async getQueue(): Promise<AnalyticsEvent[]> {
        return (await get(STORAGE_KEY)) || [];
    },

    async removeFromQueue(id: string) {
        await update(STORAGE_KEY, (val: AnalyticsEvent[] = []) => {
            return val.filter((item) => item.id !== id);
        });
    },

    async updateEventStatus(id: string, status: AnalyticsEvent["status"]) {
        await update(STORAGE_KEY, (val: AnalyticsEvent[] = []) => {
            return val.map(item => item.id === id ? { ...item, status } : item);
        });
    },

    async incrementRetry(id: string) {
        await update(STORAGE_KEY, (val: AnalyticsEvent[] = []) => {
            return val.map(item => item.id === id ? { ...item, retryCount: item.retryCount + 1 } : item);
        });
    },

    async markAsSent(id: string, destination: string) {
        await update(STORAGE_KEY, (val: AnalyticsEvent[] = []) => {
            return val.map(item => {
                if (item.id !== id) return item;
                const sentTo = new Set(item.sentTo || []);
                sentTo.add(destination);
                return { ...item, sentTo: Array.from(sentTo) };
            });
        });
    }
};
