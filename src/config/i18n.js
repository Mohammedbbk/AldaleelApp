import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager } from "react-native";
import en from "../locales/en";
import ar from "../locales/ar";

i18next.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    ar: {
      translation: ar,
    },
  },
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  supportedLngs: ["en", "ar"],
  dir: (language) => {
    return language === "ar" ? "rtl" : "ltr";
  },
  // Add initialization handler
  init: {
    onInit: (services, options) => {
      const isRTL = services.language === "ar";
      if (I18nManager.isRTL !== isRTL) {
        I18nManager.forceRTL(isRTL);
      }
    },
  },
  // Add language change handler
  react: {
    useSuspense: false,
    onChange: (language) => {
      const isRTL = language === "ar";
      if (I18nManager.isRTL !== isRTL) {
        I18nManager.forceRTL(isRTL);
      }
    },
  },
});

// Handle initial RTL setup
const currentLanguage = i18next.language;
const isRTL = currentLanguage === "ar";
if (I18nManager.isRTL !== isRTL) {
  I18nManager.allowRTL(isRTL);
  I18nManager.forceRTL(isRTL);
}

export default i18next;
