"use client";

import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../locales/en.json";
import ru from "../locales/ru.json";
import hy from "../locales/hy.json";

const resources = {
    hy: { translation: hy },
    en: { translation: en },
    ru: { translation: ru },
};

if (!i18next.isInitialized) {
    i18next.use(initReactI18next).init({
        resources,
        lng: "hy",          // ✅ միշտ en
        fallbackLng: "hy",
        interpolation: { escapeValue: false },
    });
}

export default i18next;
