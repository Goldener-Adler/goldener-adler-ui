import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNewBooking } from "@/contexts/NewBookingContext";
import { createRoomHolding, updateRoomHolding } from "@/api/bookingAPI";
import type {ExtrasFormValues, RequestedRoom} from "@/assets/bookingTypes";
import type {CreateRoomHoldingPayload, RoomCategory} from "@/assets/types";
import {toast} from "sonner";
import {getDiagnosticCodeMessage} from "@/assets/i18n/i18nConsts";
import {useTranslation} from "react-i18next";

type UpdateRoomSelectionInput = {
  requestedRoom: RequestedRoom;
  room: RoomCategory;
  selectedExtras: ExtrasFormValues;
};

export function useUpdateRoomSelection() {
  const { state, dispatch } = useNewBooking();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateRoomSelectionInput) => {
      const { requestedRoom, room, selectedExtras } = input;

      if (state.status !== "initialized") {
        throw new Error("Invalid state");
      }

      const sessionId = state.sessionId;
      const existingHolding = state.roomHoldings[requestedRoom.id];

      const payload: CreateRoomHoldingPayload = {
        roomCategoryId: room.id,
        requestedRoomId: requestedRoom.id,
        people: requestedRoom.people,
        selectedExtras,
        checkIn: state.checkIn,
        checkOut: state.checkOut,
      };

      if (existingHolding?.holdingId) {
        return updateRoomHolding(sessionId, existingHolding.holdingId, payload);
      } else {
        return createRoomHolding(sessionId, payload);
      }
    },

    onSuccess: (holding, input) => {
      const { requestedRoom } = input;

      dispatch({
        type: "ADD_OR_UPDATE_ROOM_HOLDINGS",
        room: holding,
        requestedRoomId: requestedRoom.id,
      });

      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },

    onError: (error) => {
      console.error(error);
      toast.error(t(getDiagnosticCodeMessage['SAVE_ROOM_HOLD_FAILED']));
      queryClient.invalidateQueries({ queryKey: ["availability"] });
    },
  });
}