import {type TranslationKeys} from "@/assets/i18n/i18n.ts";
import {BOOKING_OPTIONS} from "@/assets/consts.ts";
import {createBookingSchema} from "@/utils/createBookingSchema.ts";
import {z} from "zod";
import type {IconType} from "react-icons";

export type BookingOption = {id: string, label: TranslationKeys}

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
  label: TranslationKeys,
  path: string,
}

export type RoomType = {
  type: "single" | "double" | "apartment";
  capacity: number;
  available: number;
  price: number;
  extraBed?: {
    available: number;
    priceIncrease: number;
  }
};

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

export type Amenity = {
  id: string,
  label: TranslationKeys,
  icon: IconType,
  variant: 'default' | 'secondary',
}
