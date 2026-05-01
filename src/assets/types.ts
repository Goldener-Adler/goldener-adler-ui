import {type TranslationKey} from "@/assets/i18n/i18n.ts";
import {AMENITY_KEYS, BOOKING_OPTIONS} from "@/assets/consts.ts";
import {createBookingSchema} from "@/utils/createBookingSchema.ts";
import {z} from "zod";
import type {IconType} from "react-icons";
import type {ExtrasFormValues} from "@/assets/bookingTypes";

/*
 * Legacy Values //TODO: Clean Up Legacy Types
 */

export type BookingOption = {id: string, label: TranslationKey}

export type BookingExtras = Record<
  (typeof BOOKING_OPTIONS)[number]["id"],
  boolean
>;

export type RoomSelection = { singleBedRooms: number; doubleBedRooms: string; apartmentGuests: number };
/*
export type BookingDetails = {
  dateRange?: DateRange;
  rooms: RoomSelection;
  extras: BookingExtras,
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message?: string;
}
 */

export const defaultExtras = Object.fromEntries(
  BOOKING_OPTIONS.map(opt => [opt.id, false])
) as Record<(typeof BOOKING_OPTIONS)[number]["id"], boolean>;

export const initialBookingFormValues: BookingFormValues = {
  dateRange: undefined,
  rooms: {
    singleBedRooms: "0",
    doubleBedRooms: "0",
    apartmentGuests: "0",
  },
  extras: defaultExtras,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
}

export const bookingformSchema = createBookingSchema();
export type BookingFormValues = z.infer<typeof bookingformSchema>;

/*
 * Current Values
 */

export type CookieConsent = "all" | "essential" | "none";

export type MenuItem = {
  label: TranslationKey,
  path: string,
}

export type MultilingualString = { en: string } & Record<string, string>;

export type MultiCurrencyAmount = { eur: number } & Record<string, number>;

export type PricePer = 'stay' | 'night' | 'person' | 'nightAndPerson';

export type Price = {
  amount: MultiCurrencyAmount;
  per: PricePer;
}

export type Icon = 'Wifi' | 'TV' | 'Phone' | 'Sheets' | 'Towels' | 'Bath' | 'Shower' | 'SoundIsolation' | 'Kitchen' | 'AdditionalBed';

export type NewAmenity = {
  icon: Icon,
  label: MultilingualString,
  highlight?: boolean,
}

type BaseExtra = {
  label: MultilingualString;
  price?: Price;
}

export type ExtraOption =
  | { value: string;  label: MultilingualString, price?: Price; }
  | { value: number;  label?: MultilingualString, price?: Price; }

export type ToggleExtra = BaseExtra & { options: undefined };
export type SelectExtra = BaseExtra & { options: ExtraOption[] };

export type Extra = ToggleExtra | SelectExtra;

export type SelectedExtraSnapshot = {
  extraLabel: MultilingualString;
} & (
  | { value: boolean; optionLabel?: never }           // yes/no
  | { value: ExtraOption['value']; optionLabel?: MultilingualString } // multi-value
  )

export type RoomCategory = {
  id: string;
  amount: number;
  title: MultilingualString;
  description: MultilingualString;
  price: Price;
  capacity: number;
  amenities: NewAmenity[];
  extras: Extra[];
}

/*
 * Dashboard / Backend Types (Export)
 */

export type Booking = {
  id: string,
  from: Date,
  to: Date,
  people: number,
  firstName: string,
  lastName: string,
  email: string,
  phone: string | null,
  message: string,
  extras: BookingExtras,
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'canceled' | 'no-show',
}

export type Room = {
  id: string,
  type: 'single' | 'double' | 'apartment',
  capacity: number,
}

export type BookingRoom = {
  id: string,
  bookingId: Booking['id'],
  roomId: Room['id'],
  people: number,
}

export type AmenityKey = typeof AMENITY_KEYS[number];

export type Amenity = {
  id: string,
  label: TranslationKey,
  icon: IconType,
  variant: 'default' | 'secondary',
}

export type CreateRoomHoldingPayload = {
  roomCategoryId: string;
  requestedRoomId: string;
  people: number;
  selectedExtras: ExtrasFormValues;
  checkIn: Date;
  checkOut: Date;
}

export type RoomHoldingBE = {
  holdingId: string;
  roomCategoryId: string;
  capacity: number;
  requestedRoomId: string;
  people: number;
  selectedExtras: ExtrasFormValues; // raw selection only
  checkIn: Date;
  checkOut: Date;
  expiresAt: Date;
}

export type DIAGNOSTIC_CODE =
  'REHYDRATION_FAILED' |
  'DELETE_ROOM_HOLD_FAILED' |
  'SAVE_ROOM_HOLD_FAILED'
