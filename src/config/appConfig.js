import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import Constants from "expo-constants";

// Environment variables
export const ENV = {
  OPENWEATHERMAP_API_KEY:
    Constants.expoConfig?.extra?.openWeatherMapApiKey || "",
};

// i18n translations
i18next.use(initReactI18next).init({
  resources: {
    en: {
      translation: require("../locales/en").default,
    },
    ar: {
      translation: require("../locales/ar").default,
    },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
