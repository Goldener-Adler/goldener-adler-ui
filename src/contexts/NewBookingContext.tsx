import {
  createContext,
  useReducer,
  type ReactNode, useContext,
} from "react";

import { bookingReducer, initialState } from "@/reducers/bookingReducer";
import type {NewBookingState, Action} from "@/assets/bookingTypes";
import {clearBookingSession, loadBookingSession} from "@/utils/bookingSession";

type BookingContextType = {
  state: NewBookingState;
  dispatch: React.Dispatch<Action>;
};

const NewBookingContext = createContext<BookingContextType | undefined>(
  undefined
);

const getInitialState = () => {
  if (typeof window === "undefined") {
    return initialState;
  }

  const storedValue = loadBookingSession();

  if (!storedValue) return initialState;

  try {
    if (storedValue) {
        return {
          status: "rehydrating",
          sessionId: storedValue.sessionId,
          checkIn: new Date(storedValue.checkIn),
          checkOut: new Date(storedValue.checkOut),
          requestedRooms: storedValue.requestedRooms,
          roomHoldings: [],
          guestFormValues: storedValue.guestFormValues,
          guestFormIsValid: false,
        } satisfies Extract<NewBookingState, { status: "rehydrating" }>;
    }
    return initialState;
  } catch {
    clearBookingSession();
    return initialState;
  }
}

export function NewBookingProvider({children}: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState, getInitialState);

  //TODO: Rehydrate selected rooms with a backend fetch on init (useEffect with empty dependency)

  //TODO: Add Hooks for
  /*
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