import {z} from "zod";
import {createNewBookingSchema} from "@/utils/createNewBookingRequestSchema";
import type {BookingForm} from "@/assets/guestTypes";
import type {Extra, MultilingualString, SelectedExtraSnapshot} from "@/assets/types";
import type {DeepPartial} from "react-hook-form";

export const newBookingRequestSchema = createNewBookingSchema();

export type NewBookingRequest = z.infer<typeof newBookingRequestSchema>;

export const initialBookingRequestValues: NewBookingRequest = {
  dateRange: undefined,
  requestedRooms: [{people: 1}]
}

export function buildExtrasSchema(extras: Extra[]) {
  const shape = Object.fromEntries(
    extras.map(extra => [
      extra.label.en,
      extra.options === undefined
        ? z.boolean()                          // yes/no extra
        : z.union([
          z.string(),
          z.number(),
        ])                                   // multi-value extra
    ])
  );

  return z.object(shape);
}

export type ExtrasFormValues = Record<string, boolean | string | number>;

export type RequestedRoom = {
  people: number,
}

// What should be stored in session storage
export type BookingSession = {
  sessionId: string;
  checkIn: Date;
  checkOut: Date;
  requestedRooms: RequestedRoom[];
  guestFormValues: DeepPartial<BookingForm>;
}

export type RoomHolding = {
  id: string;
  title: MultilingualString;
  extrasFormValues: ExtrasFormValues;
  extrasSnapshot: SelectedExtraSnapshot[];
  holdingId: string;
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
  status: "rehydrating";
  checkIn: Date;
  checkOut: Date;
  requestedRooms: RequestedRoom[];
  guestFormValues: DeepPartial<BookingForm>;
  guestFormIsValid: boolean;
}
  | {
  status: "initialized";
  checkIn: Date;
  checkOut: Date;
  requestedRooms: RequestedRoom[];
  roomHoldings: Partial<Record<number, RoomHolding>>;
  guestFormValues: DeepPartial<BookingForm>;
  guestFormIsValid: boolean;
});

export type Action =
  | { type: "SET_REQUEST"; checkIn: Date; checkOut: Date, rooms: RequestedRoom[], sessionId: string }
  | { type: "SET_REHYDRATING"; checkIn: Date, checkOut: Date, rooms: RequestedRoom[], sessionId: string /* guestFormValues, isValid*/ }
  | { type: "REHYDRATE_ROOM_HOLDINGS"; roomHoldings: Partial<Record<number, RoomHolding>> }
  | { type: "ADD_OR_UPDATE_ROOM_HOLDINGS"; room: RoomHolding, index: number }
  | { type: "REMOVE_ROOM_HOLDING"; index: number }
  | { type: "GO_TO_GUESTS" }
  | { type: "UPDATE_BOOKING_FORM_VALUES"; guestFormValues: BookingForm, isValid: boolean }
  | { type: "GO_TO_CHECKOUT" }
  | { type: "RESET_BOOKING" };