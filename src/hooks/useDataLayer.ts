import { useEffect } from "react";
import { dataLayer } from "../lib/data-layer";

export const useDataLayer = () => {
    useEffect(() => {
        // Initialize data layer (listeners, etc.) only once on mount
        dataLayer.init();
    }, []);

    return {
        trackEvent: dataLayer.trackEvent.bind(dataLayer),
    };
};
