import i18n from 'i18next';
import languageDetector from 'i18next-browser-languagedetector';
import { initReactI18next} from "react-i18next";

import de from './de.ts';
import en from './en.ts';

export const resources = {
  default: {
    translation: en,
  },
  en: {
    translation: en,
  },
  de: {
    translation: de,
  }
};

export type DotPrefix<T extends string, P extends string> =
  T extends '' ? P : `${P}.${T}`;

export type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & (string)]:
  ObjectType[Key] extends object
    ? DotPrefix<NestedKeyOf<ObjectType[Key]>, Key>
    : Key;
}[keyof ObjectType & string];

export type Resources = typeof resources['default']['translation'];
export type TranslationKey = NestedKeyOf<Resources>;

export type Language = Exclude<keyof typeof resources, 'default'>;

export const defaultLanguage: Language = 'en';

i18n
  .use(initReactI18next)
  .use(languageDetector)
  .init({
    resources,
    fallbackLng: defaultLanguage,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
