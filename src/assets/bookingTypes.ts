import {z} from "zod";
import {createNewBookingSchema} from "@/utils/createNewBookingRequestSchema";
import type {AvailableRoomMap, RoomTypeKey} from "@/assets/types";

export const newBookingRequestSchema = createNewBookingSchema();

export type NewBookingRequest = z.infer<typeof newBookingRequestSchema>;

export const initialBookingRequestValues: NewBookingRequest = {
  dateRange: undefined,
  requestedRooms: [{people: 1}]
}

export const roomExtrasSchema = z.object({
  breakfast: z.enum(["none", "default", "vegetarian", "vegan"]),
  bikeParking: z.boolean(),
  motorbike: z.boolean(),
  pet: z.boolean(),
});

export type RoomExtrasForm = z.infer<typeof roomExtrasSchema>;

export type RequestedRoom = {
  people: number,
}

export type SelectedRoom = {
  id: string;
  type: RoomTypeKey;
  extras: RoomExtrasForm;
};

export type NewBookingState =
  | {
  step: "request";
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  requestedRooms: RequestedRoom[];
}
  | {
  step: "selection";
  sessionId: string;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  requestedRooms: RequestedRoom[];
  availableRooms: AvailableRoomMap;
  selectedRooms: Partial<Record<number, SelectedRoom>>;
}
  | {
  step: "checkout";
  sessionId: string;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  requestedRooms: RequestedRoom[];
  availableRooms: AvailableRoomMap;
  selectedRooms: Partial<Record<number, SelectedRoom>>;
  // guest data
};

export type Action =
  | { type: "SET_REQUEST"; checkIn: Date; checkOut: Date, sessionId: string, rooms: RequestedRoom[], availableRooms?: AvailableRoomMap }
  | { type: "SET_AVAILABLE_ROOMS"; rooms: AvailableRoomMap }
  | { type: "ADD_OR_UPDATE_SELECTED_ROOM"; room: SelectedRoom, index: number }
  | { type: "REMOVE_SELECTED_ROOM"; index: number }
  | { type: "GO_TO_GUESTS" }
  | { type: "GO_TO_CHECKOUT" }
  | { type: "RESET_BOOKING" };