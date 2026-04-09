import type {BookingFormValues} from "@/assets/types.ts";
import {EMPTY_STRING} from "@/assets/consts.ts";

export const isValidBookingForm = (bookingFormValues: BookingFormValues): boolean => {
  return (
    bookingFormValues.dateRange !== undefined && typeof bookingFormValues.dateRange.from === 'object' && typeof bookingFormValues.dateRange.to === 'object' &&
    bookingFormValues.rooms !== undefined && (bookingFormValues.rooms.singleBedRooms !== EMPTY_STRING || bookingFormValues.rooms.doubleBedRooms !== EMPTY_STRING || bookingFormValues.rooms.apartmentGuests !== EMPTY_STRING) &&
    bookingFormValues.firstName !== EMPTY_STRING && bookingFormValues.lastName !== EMPTY_STRING && bookingFormValues.email !== EMPTY_STRING
  );
}
