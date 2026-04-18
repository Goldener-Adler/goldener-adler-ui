import {
  createContext,
  useReducer,
  type ReactNode, useContext,
} from "react";

import { bookingReducer, initialState } from "@/reducers/bookingReducer";
import type {NewBookingState, Action} from "@/assets/bookingTypes";

type BookingContextType = {
  state: NewBookingState;
  dispatch: React.Dispatch<Action>;
};

const NewBookingContext = createContext<BookingContextType | undefined>(
  undefined
);

export function NewBookingProvider({children}: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  //TODO: Add Hooks for
  /*
    X - fetch availability request
    X - create or update RoomHolds. (If create fails because concurrent bookings reduced availability to 0, error toast to user and return previous state. Trigger availability refetch after)
    X - delete RoomHolds (On Remove from Sidebar)
    O - reset booking (delete room holds if existing, finally clear state)
    O - confirm booking
   */

  return (
    <NewBookingContext.Provider value={{ state, dispatch }}>
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