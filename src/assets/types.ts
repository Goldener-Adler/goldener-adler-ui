import type {TranslationKeys} from "@/i18n.ts";
import {BOOKING_OPTIONS} from "@/assets/consts.ts";
import {createBookingSchema} from "@/helpers/createBookingSchema.ts";
import {z} from "zod";

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
  label: string,
  path: string,
}

export type Room = {
  id: string,
  type: 'single' | 'double' | 'apartment',
}

export type Booking = {
  id: string,
  from: Date,
  to: Date,
  rooms: string[],
  people: number,
  firstName: string,
  lastName: string,
  email: string,
  phone: string | null,
  message: string,
  extras: BookingExtras,
}
