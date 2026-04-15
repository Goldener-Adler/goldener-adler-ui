import type {RoomType} from "@/assets/types";
import {z} from "zod";

export const roomExtrasSchema = z.object({
  breakfast: z.enum(["none", "default", "vegetarian", "vegan"]),
  bikeParking: z.boolean(),
  motorbike: z.boolean(),
  pet: z.boolean(),
});

export type RoomExtrasForm = z.infer<typeof roomExtrasSchema>;

export type SelectedRoom = {
  id: string;
  type: RoomType['type'];
  extras: RoomExtrasForm;
};

export type NewBookingState =
  | {
  step: "request";
  requestedRooms: { people: number }[];
}
  | {
  step: "selection";
  checkIn: Date;
  checkOut: Date;
  requestedRooms: { people: number }[];
  availableRooms: RoomType[];
  selectedRooms: Partial<Record<number, SelectedRoom>>;
}
  | {
  step: "checkout";
  checkIn: Date;
  checkOut: Date;
  requestedRooms: { people: number }[];
  availableRooms: RoomType[];
  selectedRooms: Partial<Record<number, SelectedRoom>>;
  // guest data
};

export type Action =
  | { type: "SET_REQUEST"; checkIn: Date; checkOut: Date, rooms: { people: number }[] }
  | { type: "SET_AVAILABLE_ROOMS"; rooms: RoomType[] }
  | { type: "ADD_OR_UPDATE_SELECTED_ROOM"; room: SelectedRoom, index: number }
  | { type: "REMOVE_SELECTED_ROOM"; index: number }
  | { type: "GO_TO_GUESTS" }
  | { type: "GO_TO_CHECKOUT" }
  | { type: "RESET_BOOKING" };