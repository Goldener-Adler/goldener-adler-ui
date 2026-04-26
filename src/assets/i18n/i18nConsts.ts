import type {RoomExtrasForm} from "@/assets/bookingTypes";
import type {TranslationKey} from "@/assets/i18n/i18n";

export const titleKeyMap = {
  single: 'public.Rooms.General.SingleBedroom_one',
  double: 'public.Rooms.General.DoubleBedroom_one',
  apartment: 'public.Rooms.General.Apartment',
} as const;

type ExtrasTranslationMap = {
  [K in keyof RoomExtrasForm]: {
    label: TranslationKey;
    values?: Partial<Record<string, TranslationKey>>;
  };
};

export const extrasTranslationMap: ExtrasTranslationMap = {
  breakfast: {
    label: "public.Rooms.Extras.Breakfast.Label",
    values: {
      none: "public.Rooms.Extras.Breakfast.Values.None",
      default: "public.Rooms.Extras.Breakfast.Values.Default",
      vegetarian: "public.Rooms.Extras.Breakfast.Values.Vegetarian",
      vegan: "public.Rooms.Extras.Breakfast.Values.Vegan",
    },
  },
  bikeParking: { label: "public.Rooms.Extras.BikeParking.Label" },
  motorbike:   { label: "public.Rooms.Extras.Motorbike.Label" },
  pet:         { label: "public.Rooms.Extras.Pets.Label" },
  extraBed:   { label: "public.Rooms.Extras.ExtraBed.Label" },
};

export const pricePerTranslationMap: Record<string, TranslationKey> = {
  night: "public.Rooms.Extras.Per.Night",
  stay: "public.Rooms.Extras.Per.Stay",
  guest: "public.Rooms.Extras.Per.Guest",
  nightAndPerson: "public.Rooms.Extras.Per.NightAndGuest"
} as const;