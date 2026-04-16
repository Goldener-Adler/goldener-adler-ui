import type {Action, NewBookingState} from "@/assets/bookingTypes";
import {EMPTY_AVAILABLE_ROOMS_MAP} from "@/assets/consts";
import {getNights} from "@/utils/formatDate";

export const initialState: NewBookingState = {
  step: "request",
  checkIn: undefined,
  checkOut: undefined,
  requestedRooms: [],
};

/*
 * Reducer for managing Booking State
 * It should only manage state and not call or handle requests.
 * Leave this to the Context.
 */

export function bookingReducer(
  state: NewBookingState,
  action: Action
): NewBookingState {
  switch (action.type) {
    case "SET_REQUEST": {
      return {
        step: "selection",
        checkIn: action.checkIn,
        checkOut: action.checkOut,
        sessionId: action.sessionId,
        nights: getNights(action.checkIn, action.checkOut),
        requestedRooms: action.rooms,
        availableRooms: action.availableRooms ?? EMPTY_AVAILABLE_ROOMS_MAP,
        selectedRooms: [],
      };
    }

    case "SET_AVAILABLE_ROOMS": {
      if (state.step === "request") return state;

      return {
        ...state,
        availableRooms: action.rooms,
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
        availableRooms: state.availableRooms,
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