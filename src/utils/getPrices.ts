import type {RequestedRoom, RoomHolding} from "@/assets/bookingTypes";
import type {Price, SelectedExtraSnapshot} from "@/assets/types";
import {isExtraSelected} from "@/utils/guards/isExtraSelected";

export function getExtraPriceCents(
  extra: SelectedExtraSnapshot,
  nights: number,
  people: number,
): number {
  const price = extra.optionPrice ?? extra.price;

  if (!price || !isExtraSelected(extra)) return 0;

  const base = price.amount;

  switch (price.per) {
    case "night":
      return base * nights;
    case "person":
      return base * people;
    case "nightAndPerson":
      return base * nights * people;
    case "stay":
      return base;
  }
}

export function getRoomCents(
  room: RoomHolding,
  nights: number,
): number {
  return room.price.amount * nights;
}

function getRoomTotalCents(
  room: RoomHolding,
  people: number,
  nights: number,
): number {
  const extras = room.extrasSnapshot.reduce((sum, extra) => {
    return sum + getExtraPriceCents(extra, nights, people);
  }, 0);

  return room.price.amount * nights + extras;
}

export function getTotalPrice(
  selectedRooms: Partial<Record<string, RoomHolding>>,
  requestedRooms: RequestedRoom[],
  nights: number,
) {
  return Object.entries(selectedRooms).reduce((sum, [id, room]) => {
    if (!room) return sum;

    const people =
      requestedRooms.find(r => r.id === id)?.people ?? 0;

    return sum + getRoomTotalCents(room, people, nights);
  }, 0);
}

export function getPriceInCents(price: Price, nights: number, people: number): number {
  const base = price.amount;

  switch (price.per) {
    case "night":
      return base * nights;

    case "person":
      return base * people;

    case "nightAndPerson":
      return base * nights * people;

    case "stay":
      return base;

    default:
      return base;
  }
}