"use client";

export const GA_ID = "G-BXL5J7QPYC";

declare global {
    interface Window {
        gtag: (...args: any[]) => void;
    }
}

export const gaEvent = (
    action: string,
    params?: Record<string, any>
) => {
    if (typeof window === "undefined") return;
    if (!window.gtag) return;

    window.gtag("event", action, params);
};
