import type { RequestedRoom, RoomHolding } from "@/assets/bookingTypes";

export function revalidateHoldings(
  holdings: RoomHolding[],
  requestedRooms: RequestedRoom[]
) {
  const valid: Record<string, RoomHolding> = {};
  const invalid: RoomHolding[] = [];

  // Map requested rooms by id for fast lookup
  const requestedMap = new Map(
    requestedRooms.map(requestedRoom => [requestedRoom.id, requestedRoom])
  );

  holdings.forEach(holding => {
    const requestedRoom = requestedMap.get(holding.requestedRoomId);

    if (requestedRoom && requestedRoom.people <= holding.capacity) {
      valid[holding.requestedRoomId] = holding;
    } else {
      invalid.push(holding);
    }
  });

  return { valid, invalid };
}