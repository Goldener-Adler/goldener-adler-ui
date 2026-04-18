import { useQueryClient } from "@tanstack/react-query";
import { useNewBooking } from "@/contexts/NewBookingContext";
import { fetchAvailableRooms } from "@/api/bookingAPI";
import type { RequestedRoom } from "@/assets/bookingTypes";
import {createSessionId} from "@/utils/createSessionId";

export function useCreateBookingRequest() {
  const { state, dispatch } = useNewBooking();
  const queryClient = useQueryClient();

  return async (
    checkIn: Date,
    checkOut: Date,
    requestedRooms: RequestedRoom[]
  ) => {
    const sessionId = state.sessionId ?? createSessionId();

    const availableRooms = await queryClient.fetchQuery({
      queryKey: [
        "availability",
        checkIn,
        checkOut,
        requestedRooms,
        sessionId,
      ],
      queryFn: () =>
        fetchAvailableRooms(
          checkIn,
          checkOut,
          requestedRooms,
          sessionId
        ),
    });

    const totalAvailable = Object.values(availableRooms).reduce(
      (sum, room) => sum + room.available,
      0
    );

    if (totalAvailable < requestedRooms.length) {
      throw new Error("Not enough available rooms");
    }

    dispatch({
      type: "SET_REQUEST",
      sessionId,
      checkIn,
      checkOut,
      rooms: requestedRooms,
    });
  };
}