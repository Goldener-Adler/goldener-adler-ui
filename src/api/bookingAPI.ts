import type {RequestedRoom, RoomHolding} from "@/assets/bookingTypes";
import {API_ENDPOINT} from "@/assets/consts";
import type {CreateRoomHoldingPayload, RoomCategory} from "@/assets/types";
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

async function fetchRoomHoldings(sessionId: string): Promise<RoomHolding[]> {
  const response = await fetch(`${API_ENDPOINT}/sessions/${sessionId}/room-holdings`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) throw new Error(`Failed to fetch room holdings: ${response.status}`);
  return response.json();
}

async function createRoomHolding(
  sessionId: string,
  payload: CreateRoomHoldingPayload
): Promise<RoomHolding> {
  const response = await fetch(`${API_ENDPOINT}/sessions/${sessionId}/room-holdings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error(`Failed to create room holding: ${response.status}`);
  return response.json();
}

async function updateRoomHolding(
  sessionId: string,
  holdingId: string,
  payload: Partial<CreateRoomHoldingPayload>
): Promise<RoomHolding> {
  const response = await fetch(`${API_ENDPOINT}/sessions/${sessionId}/room-holdings/${holdingId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error(`Failed to update room holding: ${response.status}`);
  return response.json();
}

async function deleteRoomHolding(
  sessionId: string,
  holdingId: string
): Promise<void> {
  const response = await fetch(`${API_ENDPOINT}/sessions/${sessionId}/room-holdings/${holdingId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) throw new Error(`Failed to delete room holding: ${response.status}`);
}

async function deleteRoomHoldings(sessionId: string, holdings: RoomHolding[]) {
  await Promise.all(
    holdings.map(h =>
      fetch(`${API_ENDPOINT}/sessions/${sessionId}/room-holdings/${h.holdingId}`, {
        method: "DELETE",
      })
    )
  );
}

async function clearRoomHoldings(sessionId: string): Promise<void> {
  const response = await fetch(`${API_ENDPOINT}/sessions/${sessionId}/room-holdings`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!response.ok) throw new Error(`Failed to delete room holding: ${response.status}`);
}

export async function fetchPrices(sessionId: string): Promise<RoomHolding[]> {
  const res = await fetch(`${API_ENDPOINT}/sessions/${sessionId}/price-check`, {
    method: "POST",
  });

  if (!res.ok) throw new Error("Failed to fetch pricing");

  return res.json();
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
  fetchRoomHoldings,
  createRoomHolding,
  updateRoomHolding,
  deleteRoomHolding,
  deleteRoomHoldings,
  clearRoomHoldings,
  confirmBooking
}