import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNewBooking } from "@/contexts/NewBookingContext";
import { updateRoomHolds } from "@/api/bookingAPI";
import type { RoomTypeKey } from "@/assets/types";
import type {ExtraPrices, RoomExtrasForm} from "@/assets/bookingTypes";

type UpdateRoomSelectionInput = {
  roomIndex: number;
  roomType: RoomTypeKey;
  extras: RoomExtrasForm;
  extraPrices: ExtraPrices;
  pricePerNight: number;
};

export function useUpdateRoomSelection() {
  const { state, dispatch } = useNewBooking();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateRoomSelectionInput) => {
      const { roomIndex, roomType, extras, extraPrices } = input;

      if (state.status === "uninitialized") {
        throw new Error("Invalid state");
      }

      const existingHoldId = state.selectedRooms[roomIndex]?.id;

      return updateRoomHolds(
        state.sessionId!,
        roomType,
        roomIndex,
        state.checkIn,
        state.checkOut,
        extras,
        extraPrices,
        existingHoldId
      );
    },

    onSuccess: (holdingId, input) => {
      const { roomIndex, roomType, extras, extraPrices, pricePerNight } = input;

      dispatch({
        type: "ADD_OR_UPDATE_SELECTED_ROOM",
        room: {
          id: holdingId,
          type: roomType,
          extras,
          extraPrices,
          pricePerNight
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