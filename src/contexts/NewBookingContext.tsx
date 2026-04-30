import {
  createContext,
  useReducer,
  type ReactNode, useContext,
} from "react";

import { bookingReducer, initialState } from "@/reducers/bookingReducer";
import type {NewBookingState, Action} from "@/assets/bookingTypes";
import {SESSION_STORAGE_KEY} from "@/assets/consts";
import {isBookingSession} from "@/utils/guards/isBookingSession";
import {getInitialBookingFormValues} from "@/assets/guestTypes";
import getAdditionalGuestCount from "@/utils/getAdditionalGuestCount";

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

  const storedValue = sessionStorage.getItem(SESSION_STORAGE_KEY);

  if (!storedValue) return initialState;

  try {
    if (storedValue) {
      const parsedData = JSON.parse(storedValue);
      if (isBookingSession(parsedData)) {
        return {
          status: "initialized",
          sessionId: parsedData.sessionId,
          checkIn: new Date(parsedData.checkIn),
          checkOut: new Date(parsedData.checkOut),
          requestedRooms: parsedData.requestedRooms,
          roomHoldings: {},
          guestFormValues: getInitialBookingFormValues(getAdditionalGuestCount(parsedData.requestedRooms)), //TODO: Read booking form values from session storage
          guestFormIsValid: false,
        } satisfies Extract<NewBookingState, { status: "initialized" }>;
      }
    }
    return initialState;
  } catch {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
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