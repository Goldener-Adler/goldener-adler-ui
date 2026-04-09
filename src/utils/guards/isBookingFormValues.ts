import type {BookingExtras, BookingFormValues, RoomSelection} from "@/assets/types.ts";
import type {DateRange} from "react-day-picker";
import {BOOKING_OPTIONS, ISO_DATE_REGEX} from "@/assets/consts.ts";

export const isDateRange = (dateRange: unknown): dateRange is DateRange => {
  return (
    typeof dateRange === 'object' && dateRange !== null &&
    'from' in dateRange && typeof dateRange.from === 'string' && ISO_DATE_REGEX.test(dateRange.from) &&
    'to' in dateRange && typeof dateRange.to === 'string' && ISO_DATE_REGEX.test(dateRange.to)
  )
}

export const isRoomSelection = (roomSelection: unknown): roomSelection is RoomSelection => {
  return (
    typeof roomSelection === 'object' && roomSelection !== null &&
    'singleBedRooms' in roomSelection && roomSelection.singleBedRooms !== undefined && typeof roomSelection.singleBedRooms === 'string' &&
    'doubleBedRooms' in roomSelection && roomSelection.doubleBedRooms !== undefined && typeof roomSelection.doubleBedRooms === 'string' &&
    'apartmentGuests' in roomSelection && roomSelection.apartmentGuests !== undefined && typeof roomSelection.apartmentGuests === 'string'
  )
}

export const isBookingExtras = (extras: unknown): extras is BookingExtras => {
  if (typeof extras !== "object" || extras === null || Array.isArray(extras)) return false;
  
  const extrasRecord = extras as Record<string, unknown>;
  
  return BOOKING_OPTIONS.every(
    (option) =>
      Object.prototype.hasOwnProperty.call(extrasRecord, option.id) &&
      typeof extrasRecord[option.id] === "boolean"
  );
};


export const isBookingFormValues = (bookingFormValues: unknown): bookingFormValues is BookingFormValues => {
  return (
    typeof bookingFormValues === 'object' && bookingFormValues !== null &&
    (!('dateRange' in bookingFormValues) || bookingFormValues.dateRange === undefined || isDateRange(bookingFormValues.dateRange)) &&
    'rooms' in bookingFormValues && isRoomSelection(bookingFormValues.rooms) &&
    'extras' in bookingFormValues && isBookingExtras(bookingFormValues.extras) &&
    'firstName' in bookingFormValues && typeof bookingFormValues.firstName === 'string' &&
    'lastName' in bookingFormValues && typeof bookingFormValues.lastName === 'string' &&
    'email' in bookingFormValues && typeof bookingFormValues.email === 'string' &&
    'phone' in bookingFormValues && bookingFormValues.phone !== undefined && typeof bookingFormValues.phone === 'string' &&
    'message' in bookingFormValues && bookingFormValues.message !== undefined && typeof bookingFormValues.message === 'string'
  )
}
