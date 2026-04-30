import type {TranslationKey} from "@/assets/i18n/i18n";
import type {PricePer} from "@/assets/types";

export const pricePerTranslationMap: Record<PricePer, TranslationKey> = {
  night: "public.Rooms.Extras.Per.Night",
  stay: "public.Rooms.Extras.Per.Stay",
  person: "public.Rooms.Extras.Per.Guest",
  nightAndPerson: "public.Rooms.Extras.Per.NightAndGuest"
} as const;