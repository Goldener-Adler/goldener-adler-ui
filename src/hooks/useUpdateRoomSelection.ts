import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNewBooking } from "@/contexts/NewBookingContext";
import { updateRoomHolds } from "@/api/bookingAPI";
import type {ExtrasFormValues} from "@/assets/bookingTypes";
import type {RoomCategory} from "@/assets/types";
import {buildExtrasSnapshots} from "@/utils/buildExtrasSnapshot";

type UpdateRoomSelectionInput = {
  roomIndex: number;
  room: RoomCategory;
  selectedExtras: ExtrasFormValues;
};

export function useUpdateRoomSelection() {
  const { state, dispatch } = useNewBooking();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateRoomSelectionInput) => {
      const { roomIndex, room, selectedExtras } = input;

      if (state.status === "uninitialized") {
        throw new Error("Invalid state");
      }

      const existingHoldId = state.roomHoldings[roomIndex]?.id;

      return updateRoomHolds(
        state.sessionId!,
        room.id,
        roomIndex,
        state.requestedRooms[roomIndex].people,
        state.checkIn,
        state.checkOut,
        selectedExtras,
        existingHoldId
      );
    },

    onSuccess: (holdingId, input) => {
      const { roomIndex, room, selectedExtras } = input;

      const extrasSnapshot = buildExtrasSnapshots(selectedExtras, room.extras);

      dispatch({
        type: "ADD_OR_UPDATE_ROOM_HOLDINGS",
        room: {
          id: room.id,
          title: room.title,
          extrasFormValues: selectedExtras,
          extrasSnapshot: extrasSnapshot,
          holdingId,
        },
        index: roomIndex,
      });

      queryClient.invalidateQueries({
        queryKey: ["availability"],
      });
    },

    onError: (error) => {
      // 🚨 race condition happened
      console.error(error);
      alert("Room is no longer available");

      queryClient.invalidateQueries({
        queryKey: ["availability"],
      });
    },
  });
}