import i18n from "i18next";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translateEn from "./locales/en_EN.json";
import translateEs from "./locales/es_ES.json";

const resources = {
  eng: {
    translation: translateEn,
  },
  esp: {
    translation: translateEs,
  },
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("i18nextLng") || "eng",
    interpolation: {
      escapeValue: true,
    },
  });

export default i18n;
