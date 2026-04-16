import type {RequestedRoom} from "@/assets/bookingTypes";
import {API_ENDPOINT, EMPTY_AVAILABLE_ROOMS_MAP} from "@/assets/consts";
import type {AvailableRoomMap} from "@/assets/types";

async function fetchAvailableRooms(checkIn: Date, checkOut: Date, requestedRooms: RequestedRoom[]): Promise<AvailableRoomMap> {
  const requestBody = {
    checkIn,
    checkOut,
    requestedRooms
  }
  try {
    const response = await fetch(API_ENDPOINT + "/available-rooms",
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(requestBody),
      }
    );

    return await response.json();
  } catch {
    return EMPTY_AVAILABLE_ROOMS_MAP;
  }
}

export {
  fetchAvailableRooms,
}