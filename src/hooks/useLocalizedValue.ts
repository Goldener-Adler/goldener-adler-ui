import { useTranslation } from 'react-i18next';
import type {MultilingualString} from "@/assets/types"; // or your i18n lib

export function useLocalizedValue() {
  const { i18n } = useTranslation();

  return (value: MultilingualString, fallback = 'en'): string => {
    const lang = i18n.language;
    const base = lang.split('-')[0];

    return value[lang]      // exact match first
      ?? value[base]        // then base language
      ?? value[fallback]    // then configured fallback
      ?? Object.values(value)[0]  // last resort: first available
      ?? '';
  };
}