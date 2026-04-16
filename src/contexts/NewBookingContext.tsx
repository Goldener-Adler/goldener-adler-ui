import {
  createContext,
  useReducer,
  type ReactNode, useContext,
} from "react";

import { bookingReducer, initialState } from "@/reducers/bookingReducer";
import type {NewBookingState, Action, RequestedRoom, RoomExtrasForm} from "@/assets/bookingTypes";
import {deleteRoomHold, fetchAvailableRooms, updateRoomHolds} from "@/api/bookingAPI";
import type {RoomTypeKey} from "@/assets/types";
import {createSessionId} from "@/utils/createSessionId";

type BookingContextType = {
  state: NewBookingState;
  dispatch: React.Dispatch<Action>;
  makeNewBookingRequest: (checkIn: Date, checkOut: Date, requestedRooms: RequestedRoom[]) => Promise<void>;
  updateRoomSelection: (sessionId: string, roomIndex: number, roomType: RoomTypeKey, extras: RoomExtrasForm) => void;
  deleteRoomSelection: (roomIndex: number) => Promise<void>;
};

const NewBookingContext = createContext<BookingContextType | undefined>(
  undefined
);

export function NewBookingProvider({children}: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  //TODO: Add functions for
  /*
    X - fetch availability request
    X - create or update RoomHolds. (If create fails because concurrent bookings reduced availability to 0, error toast to user and return previous state. Trigger availability refetch after)
    O - delete RoomHolds (On Remove from Sidebar)
    O - reset booking (delete room holds if existing, finally clear state)
    O - confirm booking
   */

  const makeNewBookingRequest = async (checkIn: Date, checkOut: Date, requestedRooms: RequestedRoom[]) => {
    const availableRooms = await fetchAvailableRooms(checkIn, checkOut, requestedRooms);
    dispatch({
      type: "SET_REQUEST",
      checkIn,
      checkOut,
      sessionId: createSessionId(),
      rooms: requestedRooms,
      availableRooms,
    });
  }

  const updateRoomSelection = async (sessionId: string, requestedRoomIndex: number, roomType: RoomTypeKey, extras: RoomExtrasForm) => {
    if (state.step === "request") {
      return;
    }

    const holdingId = await updateRoomHolds(sessionId, roomType, requestedRoomIndex, state.checkIn, state.checkOut, state.selectedRooms[requestedRoomIndex]?.id);

    console.log(holdingId);
    dispatch({
      type: "ADD_OR_UPDATE_SELECTED_ROOM",
      room: {
        id: holdingId,
        type: roomType,
        extras,
      },
      index: requestedRoomIndex,
    });
  }

  const deleteRoomSelection = async (roomIndex: number) => {
    if (state.step === "request") {
      return;
    }

    const selectedRoom = state.selectedRooms[roomIndex];

    if (!selectedRoom) {
      throw new Error("Could not delete selected room");
    }

    await deleteRoomHold(selectedRoom.id);

    dispatch({
      type: 'REMOVE_SELECTED_ROOM',
      index: roomIndex
    })
  }

  return (
    <NewBookingContext.Provider value={{ state, dispatch, makeNewBookingRequest, updateRoomSelection, deleteRoomSelection }}>
      {children}
    </NewBookingContext.Provider>
  );
}

export function useNewBooking() {
  const context = useContext(NewBookingContext);

  if (!context) {
    throw new Error("useBooking must be used within NewBookingProvider");
  }

  return context;
}