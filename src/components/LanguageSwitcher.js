import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useTranslation } from "react-i18next";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <TouchableOpacity onPress={toggleLanguage}>
      <Text>{i18n.language === "en" ? "عربي" : "English"}</Text>
    </TouchableOpacity>
  );
};
