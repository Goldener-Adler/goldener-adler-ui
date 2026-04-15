import type {Action, NewBookingState} from "@/assets/bookingTypes";

export const initialState: NewBookingState = {
  step: "request",
  requestedRooms: [],
};

export function bookingReducer(
  state: NewBookingState,
  action: Action
): NewBookingState {
  switch (action.type) {
    case "SET_REQUEST": {
      // TODO: Fetch here (but extract it?)

      return {
        step: "selection",
        checkIn: action.checkIn,
        checkOut: action.checkOut,
        requestedRooms: action.rooms,
        availableRooms: [],
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

      // TODO: Create or Update RoomHolds. If create fails because concurrent bookings reduced availability to 0, error toast to user and return previous state. Also trigger availability refetch

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