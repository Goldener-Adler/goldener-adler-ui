import {z} from "zod";
import {createNewBookingSchema} from "@/utils/createNewBookingRequestSchema";
import type {RoomTypeKey} from "@/assets/types";
import type {BookingForm} from "@/assets/guestTypes";

export const newBookingRequestSchema = createNewBookingSchema();

export type NewBookingRequest = z.infer<typeof newBookingRequestSchema>;

export const initialBookingRequestValues: NewBookingRequest = {
  dateRange: undefined,
  requestedRooms: [{people: 1}]
}

export const EXTRA_KEYS = ["breakfast", "bikeParking", "motorbike", "pet", "extraBed"] as const;
export type ExtraKey = typeof EXTRA_KEYS[number];

export const extraPriceSchema = z.object({
  amount: z.number(),
  currency: z.string(),
  per: z.enum(["night", "stay", "person", "nightAndPerson"]),
});

export const extraPricesSchema = z.record(z.enum(EXTRA_KEYS), extraPriceSchema.optional());

export type ExtraPrice = z.infer<typeof extraPriceSchema>;
export type ExtraPrices = z.infer<typeof extraPricesSchema>;

export const roomExtrasSchema = z.object({
  breakfast: z.enum(["none", "default", "vegetarian", "vegan"]),
  bikeParking: z.boolean(),
  motorbike: z.boolean(),
  pet: z.boolean(),
  extraBed: z.boolean(),
}) satisfies z.ZodType<Record<ExtraKey, string | boolean>>;

export type RoomExtrasForm = z.infer<typeof roomExtrasSchema>;

export type RequestedRoom = {
  people: number,
}

export type BookingSession = {
  sessionId: string;
  checkIn: Date;
  checkOut: Date;
  requestedRooms: RequestedRoom[];
}

export type SelectedRoom = {
  id: string;
  type: RoomTypeKey;
  extras: RoomExtrasForm;
  extraPrices: ExtraPrices;
  pricePerNight: number;
};

export type NewBookingState = {
  sessionId: string | null;
  } & (
  | {
  status: "uninitialized";
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  requestedRooms: RequestedRoom[];
}
  | {
  status: "initialized";
  checkIn: Date;
  checkOut: Date;
  requestedRooms: RequestedRoom[];
  selectedRooms: Partial<Record<number, SelectedRoom>>;
  guestFormValues: BookingForm;
  guestFormIsValid: boolean;
});

export type Action =
  | { type: "SET_REQUEST"; checkIn: Date; checkOut: Date, rooms: RequestedRoom[], sessionId: string }
  | { type: "ADD_OR_UPDATE_SELECTED_ROOM"; room: SelectedRoom, index: number }
  | { type: "REMOVE_SELECTED_ROOM"; index: number }
  | { type: "GO_TO_GUESTS" }
  | { type: "UPDATE_BOOKING_FORM_VALUES"; guestFormValues: BookingForm, isValid: boolean }
  | { type: "GO_TO_CHECKOUT" }
  | { type: "RESET_BOOKING" };