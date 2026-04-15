import {
  createContext,
  useReducer,
  type ReactNode, useContext,
} from "react";

import { bookingReducer, initialState } from "@/reducers/bookingReducer";
import type { NewBookingState, Action } from "@/assets/bookingTypes";
import {MOCK_NEW_BOOKING_REQUEST} from "@/mocks/mockData";

type BookingContextType = {
  state: NewBookingState;
  dispatch: React.Dispatch<Action>;
};

const NewBookingContext = createContext<BookingContextType | undefined>(
  undefined
);

// TODO: Use Initial State when pulling data from Endpoint

export function NewBookingProvider({children}: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, MOCK_NEW_BOOKING_REQUEST /*initialState*/);

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