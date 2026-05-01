import {useNewBooking} from "@/contexts/NewBookingContext";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteRoomHolding} from "@/api/bookingAPI";
import {toast} from "sonner";
import {useTranslation} from "react-i18next";
import {getDiagnosticCodeMessage} from "@/assets/i18n/i18nConsts";

export function useRemoveRoomSelection() {
  const { state, dispatch } = useNewBooking();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestedRoomId: string) => {

      if (state.status !== "initialized") {
        throw new Error("Invalid state");
      }

      const existingHoldId = state.roomHoldings[requestedRoomId]?.holdingId;

      if (!existingHoldId) {
        throw new Error("Could not find hold for requested room " + requestedRoomId);
      }

      return deleteRoomHolding(state.sessionId, existingHoldId);
    },
    onSuccess: (_, requestedRoomId) => {
      dispatch({
        type: 'REMOVE_ROOM_HOLDING',
        requestedRoomId
      })

      queryClient.invalidateQueries({
        queryKey: ["availability"],
      });
    },

    onError: (error) => {
      // 🚨 race condition happened
      console.error(error);
      toast.error(t(getDiagnosticCodeMessage['DELETE_ROOM_HOLD_FAILED']));

      queryClient.invalidateQueries({
        queryKey: ["availability"],
      });
    },
  })
}