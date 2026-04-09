import 'react-i18next';
import type {Resources} from "@/assets/i18n/i18n.ts";

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: Resources;
    }
  }
}
