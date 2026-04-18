import {useNewBooking} from "@/contexts/NewBookingContext";
import {useQuery} from "@tanstack/react-query";
import {fetchAvailableRooms} from "@/api/bookingAPI";

/*
 * Only checks for availability and updates state with available rooms.
 * Does require a sessionId to be created or read from session storage.
 */
export const useCheckAvailability = () => {
  const { state } = useNewBooking();

  return useQuery({
    queryKey: ["availability", state.checkIn, state.checkOut, state.requestedRooms, state.sessionId],
    staleTime: 1000 * 60,
    queryFn: () =>
      fetchAvailableRooms(
        state.checkIn!,
        state.checkOut!,
        state.requestedRooms,
        state.sessionId!,
      ),
    enabled: !!state.sessionId && !!state.checkIn && !!state.checkOut,
  });
}