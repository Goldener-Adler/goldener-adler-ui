import {
  createContext,
  useReducer,
  type ReactNode, useContext,
} from "react";

import { bookingReducer, initialState } from "@/reducers/bookingReducer";
import type {NewBookingState, Action, RequestedRoom, RoomExtrasForm} from "@/assets/bookingTypes";
import {fetchAvailableRooms} from "@/api/bookingAPI";
import type {RoomTypeKey} from "@/assets/types";

type BookingContextType = {
  state: NewBookingState;
  dispatch: React.Dispatch<Action>;
  makeNewBookingRequest: (checkIn: Date, checkOut: Date, requestedRooms: RequestedRoom[]) => Promise<void>;
  updateRoomSelection: (roomIndex: number, roomType: RoomTypeKey, extras: RoomExtrasForm) => void;
};

const NewBookingContext = createContext<BookingContextType | undefined>(
  undefined
);

export function NewBookingProvider({children}: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  //TODO: Add functions for
  /*
    X - fetch availability request
    O - create or update RoomHolds. (If create fails because concurrent bookings reduced availability to 0, error toast to user and return previous state. Trigger availability refetch after)
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
      rooms: requestedRooms,
      availableRooms,
    });
  }

  const updateRoomSelection = (roomIndex: number, roomType: RoomTypeKey, extras: RoomExtrasForm) => {
    // create / update room holds
    dispatch({
      type: "ADD_OR_UPDATE_SELECTED_ROOM",
      room: {
        id: `${roomIndex}-${roomType}`,
        type: roomType,
        extras,
      },
      index: roomIndex,
    });
  }

  return (
    <NewBookingContext.Provider value={{ state, dispatch, makeNewBookingRequest, updateRoomSelection }}>
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