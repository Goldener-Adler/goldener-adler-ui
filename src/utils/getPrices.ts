import type {ExtraPrice, RequestedRoom, SelectedRoom} from "@/assets/bookingTypes";
import {getTypedEntries} from "@/utils/getTypedEntries";

export const getExtraPrice = (extra: ExtraPrice, people: number, nights: number) => {
  switch(extra.per) {
    case "night":
      return extra.amount * nights;
    case "person":
      return extra.amount * people;
    case "nightAndPerson":
      return extra.amount * nights * people;
    case "stay":
      return extra.amount;
    default:
      return extra.amount;
  }
}

export function getRoomTotal(room: SelectedRoom, people: number, nights: number): number {
  const extrasTotal = getTypedEntries(room.extras)
    .filter(([key, value]) => value !== false && value !== "none" && room.extraPrices[key])
    .reduce((sum, [key]) => sum + getExtraPrice(room.extraPrices[key]!, people, nights), 0);

  return room.pricePerNight * nights + extrasTotal;
}

export const getTotalPrice = (selectedRooms: Partial<Record<number, SelectedRoom>>, requestedRooms: RequestedRoom[], nights: number)=> {
  return Object.entries(selectedRooms).reduce((sum, [index, room]) => {
    if (!room) return sum;
    return sum + getRoomTotal(room, requestedRooms[Number(index)].people, nights);
  }, 0);
}