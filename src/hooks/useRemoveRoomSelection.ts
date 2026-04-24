import {useNewBooking} from "@/contexts/NewBookingContext";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteRoomHold} from "@/api/bookingAPI";

export function useRemoveRoomSelection() {
  const { state, dispatch } = useNewBooking();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestedRoomIndex: number) => {

      if (state.status === "uninitialized") {
        throw new Error("Invalid state");
      }

      const existingHoldId = state.selectedRooms[requestedRoomIndex]?.id;

      if (!existingHoldId) {
        throw new Error("Could not find hold for requested room " + requestedRoomIndex);
      }

      return deleteRoomHold(existingHoldId);
    },
    onSuccess: (_, requestedRoomIndex) => {
      dispatch({
        type: 'REMOVE_SELECTED_ROOM',
        index: requestedRoomIndex
      })

      queryClient.invalidateQueries({
        queryKey: ["availability"],
      });
    },

    onError: (error) => {
      // 🚨 race condition happened
      console.error(error);
      alert("Could not remove room");

      queryClient.invalidateQueries({
        queryKey: ["availability"],
      });
    },
  })
}