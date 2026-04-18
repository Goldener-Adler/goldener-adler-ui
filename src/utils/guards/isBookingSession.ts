import type {BookingSession} from "@/assets/bookingTypes";

export const isBookingSession = (
  value: unknown
): value is BookingSession => {
  return (
    value !== null &&
    typeof value === "object" &&
    "sessionId" in value &&
    typeof value.sessionId === "string" &&
    "checkIn" in value && typeof value.checkIn === "string" && !isNaN(new Date(value.checkIn).getTime()) &&
    "checkOut" in value && typeof value.checkOut === "string" && !isNaN(new Date(value.checkOut).getTime()) &&
    "requestedRooms" in value &&
    Array.isArray(value.requestedRooms) && value.requestedRooms.length > 0 &&
    value.requestedRooms.every(requestedRoom => (
      typeof requestedRoom === "object" &&
      "people" in requestedRoom && typeof requestedRoom.people === "number"
    ))
  );
};