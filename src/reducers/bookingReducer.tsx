import type {Action, NewBookingState} from "@/assets/bookingTypes";
import {getNights} from "@/utils/formatDate";

export const initialState: NewBookingState = {
  step: "request",
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
      return {
        ...state,
        step: "selection",
        checkIn: action.checkIn,
        checkOut: action.checkOut,
        sessionId: action.sessionId,
        nights: getNights(action.checkIn, action.checkOut),
        requestedRooms: action.rooms,
        selectedRooms: [],
      };
    }

    case "ADD_OR_UPDATE_SELECTED_ROOM": {
      if (state.step !== "selection") return state;

      let newSelectedRooms = {...state.selectedRooms};
      newSelectedRooms[action.index] = action.room;

      return {
        ...state,
        selectedRooms: newSelectedRooms,
      };
    }

    case "REMOVE_SELECTED_ROOM": {
      if (state.step === 'request') return state;
      const newSelectedRooms = {...state.selectedRooms};
      delete newSelectedRooms[action.index];
      return {
        ...state,
        selectedRooms: newSelectedRooms
      };
    }

    case "GO_TO_CHECKOUT": {
      if (state.step === "request") return state;

      return {
        step: "checkout",
        checkIn: state.checkIn,
        checkOut: state.checkOut,
        sessionId: state.sessionId,
        nights: state.nights,
        requestedRooms: state.requestedRooms,
        selectedRooms: state.selectedRooms,
        // guest data
      };
    }

    case "RESET_BOOKING": {
      return initialState;
    }
    default:
      return state;
  }
}