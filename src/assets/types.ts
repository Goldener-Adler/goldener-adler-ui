import {type TranslationKey} from "@/assets/i18n/i18n.ts";
import {AMENITY_KEYS, BOOKING_OPTIONS} from "@/assets/consts.ts";
import {createBookingSchema} from "@/utils/createBookingSchema.ts";
import {z} from "zod";
import type {IconType} from "react-icons";
import type {ExtraPrices} from "@/assets/bookingTypes";

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

export type MenuItem = {
  label: TranslationKey,
  path: string,
}

export type RoomTypeKey = "single" | "double" | "apartment";

export type AvailableRoomDetails = {
  capacity: number;
  available: number;
  price: number;
  extraPrices: ExtraPrices;
  amenities: AmenityKey[];
}

export type AvailableRoomMap = Record<RoomTypeKey, AvailableRoomDetails>

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
