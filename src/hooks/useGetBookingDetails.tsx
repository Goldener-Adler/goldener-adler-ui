import type {Booking} from "@/assets/types.ts";
import {API_ENDPOINT} from "@/assets/consts.ts";
import {keepPreviousData, useQuery} from "@tanstack/react-query";

export const getBookingDetailsQueryKey = (
  id: Booking['id'],
) => ['booking', id];

export const useGetBookingDetails = (id: Booking['id']) => {
  const fetchBookingDetails = async () => {
    const response = await fetch(
      API_ENDPOINT + "/bookings/" + id,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    );

    return await response.json();
  }

  return useQuery({
    queryKey: getBookingDetailsQueryKey(id),
    queryFn: fetchBookingDetails,
    staleTime: 10000,
    placeholderData: keepPreviousData,
    select: (data) => {
      return {
        ...data,
        from: new Date(data.from),
        to: new Date(data.to),
      }
    }
  });
}