import type {RequestedRoom} from "@/assets/bookingTypes";
import {API_ENDPOINT, EMPTY_AVAILABLE_ROOMS_MAP} from "@/assets/consts";
import type {AvailableRoomMap, RoomTypeKey} from "@/assets/types";

async function fetchAvailableRooms(checkIn: Date, checkOut: Date, requestedRooms: RequestedRoom[], sessionId: string): Promise<AvailableRoomMap> {
  const requestBody = {
    checkIn,
    checkOut,
    requestedRooms,
    sessionId,
  }
  try {
    const response = await fetch(API_ENDPOINT + "/available-rooms",
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(requestBody),
      }
    );

    return response.json();
  } catch {
    return EMPTY_AVAILABLE_ROOMS_MAP;
  }
}

async function updateRoomHolds(sessionId: string, roomType: RoomTypeKey, requestedRoomIndex: number, from: Date, to: Date, holdingId?: string): Promise<string> {
  const requestBody = {
    sessionId,
    roomType,
    requestedRoomIndex,
    from,
    to,
    holdingId
  }

  const response = await fetch(API_ENDPOINT + "/room-holdings",
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(requestBody),
    }
  );

  return await response.json();
}

async function deleteRoomHold(holdId: string): Promise<void> {
  const response = await fetch(API_ENDPOINT + "/room-holdings/" + holdId,
    {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
    }
  );
  return await response.json();
}

export {
  fetchAvailableRooms,
  updateRoomHolds,
  deleteRoomHold
}