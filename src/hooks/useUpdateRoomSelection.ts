import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNewBooking } from "@/contexts/NewBookingContext";
import { updateRoomHolds } from "@/api/bookingAPI";
import type { RoomTypeKey } from "@/assets/types";
import type { RoomExtrasForm } from "@/assets/bookingTypes";

type UpdateRoomSelectionInput = {
  roomIndex: number;
  roomType: RoomTypeKey;
  extras: RoomExtrasForm;
};

export function useUpdateRoomSelection() {
  const { state, dispatch } = useNewBooking();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateRoomSelectionInput) => {
      const { roomIndex, roomType } = input;

      if (state.step === "request") {
        throw new Error("Invalid state");
      }

      const existingHoldId = state.selectedRooms[roomIndex]?.id;

      return updateRoomHolds(
        state.sessionId!,
        roomType,
        roomIndex,
        state.checkIn,
        state.checkOut,
        existingHoldId
      );
    },

    onSuccess: (holdingId, input) => {
      const { roomIndex, roomType, extras } = input;

      dispatch({
        type: "ADD_OR_UPDATE_SELECTED_ROOM",
        room: {
          id: holdingId,
          type: roomType,
          extras
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