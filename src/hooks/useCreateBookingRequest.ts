import { useBookingSession } from "@/hooks/useBookingSession";
import type {RequestedRoom} from "@/assets/bookingTypes";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useTranslation} from "react-i18next";
import {fetchAvailableRooms} from "@/api/bookingAPI";
import {toast} from "sonner";

export function useCreateBookingRequest() {
  const queryClient = useQueryClient();
  const { handleNewRequest } = useBookingSession();
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async ({ checkIn, checkOut, requestedRooms }: {
      checkIn: Date,
      checkOut: Date,
      requestedRooms: RequestedRoom[],
    }) => {
      const sessionId = await handleNewRequest({
        checkIn,
        checkOut,
        requestedRooms,
      });

      const availableRooms = await queryClient.fetchQuery({
        queryKey: ["availability", checkIn, checkOut, requestedRooms, sessionId],
        queryFn: () =>
          fetchAvailableRooms(checkIn, checkOut, requestedRooms, sessionId),
      });

      const totalAvailable = Object.values(availableRooms).reduce(
        (sum, room) => sum + room.amount,
        0
      );

      if (totalAvailable < requestedRooms.length) {
        throw new Error(t("public.Toast.NoRoomsAvailable"));
      }

      return { sessionId, checkIn, checkOut, requestedRooms, availableRooms };
    },
    onError: (error) => {
      console.log(error);
      toast.error(error.message);
    },
  });
}