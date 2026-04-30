// useCreateBookingRequest.ts
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useNewBooking } from "@/contexts/NewBookingContext";
import { fetchAvailableRooms } from "@/api/bookingAPI";
import type { BookingSession, RequestedRoom } from "@/assets/bookingTypes";
import { createSessionId } from "@/utils/createSessionId";
import { getInitialBookingFormValues } from "@/assets/guestTypes";
import getAdditionalGuestCount from "@/utils/getAdditionalGuestCount";
import { saveBookingSession } from "@/utils/bookingSession";
import {toast} from "sonner";
import {useTranslation} from "react-i18next";

export function useCreateBookingRequest() {
  const { state, dispatch } = useNewBooking();
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({ checkIn, checkOut, requestedRooms }: {
      checkIn: Date;
      checkOut: Date;
      requestedRooms: RequestedRoom[];
    }) => {
      const sessionId = state.sessionId ?? createSessionId(); // TODO: Generate on Backend

      const availableRooms = await queryClient.fetchQuery({
        queryKey: ["availability", checkIn, checkOut, requestedRooms, sessionId],
        queryFn: () => fetchAvailableRooms(checkIn, checkOut, requestedRooms, sessionId),
      });

      const totalAvailable = Object.values(availableRooms).reduce(
        (sum, room) => sum + room.amount, 0
      );

      if (totalAvailable < requestedRooms.length) {
        throw new Error(t('public.Toast.NoRoomsAvailable'));
      }

      return { sessionId, checkIn, checkOut, requestedRooms, availableRooms };
    },
    onSuccess: ({ sessionId, checkIn, checkOut, requestedRooms }) => {
      const newBookingSession: BookingSession = {
        sessionId,
        checkIn,
        checkOut,
        requestedRooms,
        guestFormValues: getInitialBookingFormValues(getAdditionalGuestCount(requestedRooms)),
      };

      saveBookingSession(newBookingSession);

      dispatch({
        type: "SET_REQUEST",
        sessionId,
        checkIn,
        checkOut,
        rooms: requestedRooms,
      });
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}