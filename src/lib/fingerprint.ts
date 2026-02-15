import { getFingerprint } from "@thumbmarkjs/thumbmarkjs";
import { UAParser } from "ua-parser-js";

export interface DeviceData {
    fingerprint: string;
    userAgent: string;
    browser: {
        name?: string;
        version?: string;
        major?: string;
    };
    engine: {
        name?: string;
        version?: string;
    };
    os: {
        name?: string;
        version?: string;
    };
    device: {
        model?: string;
        type?: string;
        vendor?: string;
    };
    cpu: {
        architecture?: string;
    };
    screen: {
        width: number;
        height: number;
        colorDepth: number;
    };
    timezone: string;
    locale: string;
}

export const getDeviceData = async (): Promise<DeviceData> => {
    // 1. Generate unique fingerprint hash
    const fingerprint = await getFingerprint();

    // 2. Parse User Agent
    // @ts-ignore
    const parser = new UAParser();
    const result = parser.getResult();

    return {
        fingerprint: fingerprint as string,
        userAgent: result.ua,
        browser: result.browser,
        engine: result.engine,
        os: result.os,
        device: result.device,
        cpu: result.cpu,
        screen: {
            width: window.screen.width,
            height: window.screen.height,
            colorDepth: window.screen.colorDepth,
        },
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        locale: navigator.language,
    };
};
