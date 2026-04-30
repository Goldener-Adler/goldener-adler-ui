import type {ExtrasFormValues, RequestedRoom} from "@/assets/bookingTypes";
import {API_ENDPOINT} from "@/assets/consts";
import type {RoomCategory} from "@/assets/types";
import type {BookingForm} from "@/assets/guestTypes";

async function fetchAvailableRooms(checkIn: Date, checkOut: Date, requestedRooms: RequestedRoom[], sessionId: string): Promise<RoomCategory[]> {
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
    return [];
  }
}

async function updateRoomHolds(sessionId: string, roomCategoryId: string, requestedRoomIndex: number, people: number, from: Date, to: Date, extras: ExtrasFormValues, holdingId?: string): Promise<string> {
  const requestBody = {
    sessionId,
    roomCategoryId,
    requestedRoomIndex,
    people,
    from,
    to,
    extras,
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

async function confirmBooking(
  sessionId: string, // used to find roomHolds (selected rooms)
  checkIn: Date,
  checkOut: Date,
  requestedRooms: RequestedRoom[],
  guestsData: BookingForm,
): Promise<void> {
  const requestBody = {
    sessionId,
    checkIn,
    checkOut,
    requestedRooms,
    guestsData,
  }

  const response = await fetch(API_ENDPOINT + "/booking/confirm",
    {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(requestBody)
    });
  return await response.json();
}

export {
  fetchAvailableRooms,
  updateRoomHolds,
  deleteRoomHold,
  confirmBooking
}