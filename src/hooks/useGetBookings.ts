import {API_ENDPOINT, EMPTY_STRING} from "@/assets/consts.ts";
import type {Booking} from "@/assets/types.ts";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import type {DateRange} from "react-day-picker";

export const getBookingsQueryKey = (
  searchParameter: string,
  dateRange?: DateRange,
) => ['bookings', searchParameter, dateRange];

export const useGetBookings = (
  searchParameter: string = EMPTY_STRING,
  dateRange?: DateRange,
) => {
  const fetchBookings = async () => {
    const response = await fetch(
      API_ENDPOINT + "/bookings",
      {
        body: JSON.stringify({
          search: searchParameter,
          dateRange: dateRange,
        }),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const result: Booking[] = await response.json();
    const parsed: Booking[] = result.map((b: any) => ({
      ...b,
      from: new Date(b.from),
      to: new Date(b.to),
    }));
    return parsed;
  }

  return useQuery({
    queryKey: getBookingsQueryKey(searchParameter, dateRange),
    queryFn: fetchBookings,
    staleTime: 10000,
    placeholderData: keepPreviousData
  });
}