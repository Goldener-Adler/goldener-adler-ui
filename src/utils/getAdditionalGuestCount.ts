import type {RequestedRoom} from "@/assets/bookingTypes";

export default function getAdditionalGuestCount(rooms: RequestedRoom[]) {
  const totalGuests = rooms.reduce((sum, room) => sum + room.people, 0);
  return Math.max(0, totalGuests - 1);
}