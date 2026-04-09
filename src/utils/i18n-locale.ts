import { enUS, de } from "date-fns/locale";
import type { Locale } from "date-fns";
import i18n from "../assets/i18n/i18n.ts";
import type { Language } from "@/assets/i18n/i18n.ts";

const dateFnsLocales: Record<Language, Locale> = {
  en: enUS,
  de: de,
};

export function getCurrentLocale(): Locale {
  const lang = (i18n.resolvedLanguage ?? i18n.language) as Language;
  return dateFnsLocales[lang];
}
