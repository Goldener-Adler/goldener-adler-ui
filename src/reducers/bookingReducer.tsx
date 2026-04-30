import type {Action, NewBookingState} from "@/assets/bookingTypes";
import {getInitialBookingFormValues} from "@/assets/guestTypes";

export const initialState: NewBookingState = {
  status: "uninitialized",
  checkIn: undefined,
  checkOut: undefined,
  requestedRooms: [],
  sessionId: null,
};

/*
 * Reducer for managing Booking State
 * It should only manage state and not call or handle requests.
 * Leave this to the Context.
 *
 * Store sessionId, checkIn, checkOut and requestedRooms in sessionStorage (if cookies allowed)
 * Pull on initialisation, else set initial state
 */

export function bookingReducer(
  state: NewBookingState,
  action: Action
): NewBookingState {
  switch (action.type) {
    case "SET_REQUEST": {
      const totalGuests = action.rooms.reduce((sum, room) => sum + room.people, 0);
      const additionalGuestCount = Math.max(0, totalGuests - 1);
      return {
        ...state,
        status: "initialized",
        checkIn: action.checkIn,
        checkOut: action.checkOut,
        sessionId: action.sessionId,
        requestedRooms: action.rooms,
        roomHoldings: [],
        guestFormValues: getInitialBookingFormValues(additionalGuestCount),
        guestFormIsValid: false
      };
    }

    case "ADD_OR_UPDATE_ROOM_HOLDINGS": {
      if (state.status === 'uninitialized') return state;

      let newRoomHoldings = {...state.roomHoldings};
      newRoomHoldings[action.index] = action.room;

      return {
        ...state,
        roomHoldings: newRoomHoldings,
      };
    }

    case "REMOVE_ROOM_HOLDING": {
      if (state.status === 'uninitialized') return state;
      const newRoomHoldings = {...state.roomHoldings};
      delete newRoomHoldings[action.index];
      return {
        ...state,
        roomHoldings: newRoomHoldings,
      };
    }

    case "UPDATE_BOOKING_FORM_VALUES": {
      if (state.status === 'uninitialized') return state;
      return {
        ...state,
        guestFormValues: action.guestFormValues,
        guestFormIsValid: action.isValid
      }
    }

    case "RESET_BOOKING": {
      return initialState;
    }
    default:
      return state;
  }
}