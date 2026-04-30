import type {RequestedRoom, RoomHolding} from "@/assets/bookingTypes";
import type {Price} from "@/assets/types";

export const getExtraPrice = (price: Price, value: boolean | string | number, people: number, nights: number): number => {
  if (value === false) return 0;

  switch (price.per) {
    case "night":           return price.amount.eur * nights;
    case "person":          return price.amount.eur * people;
    case "nightAndPerson":  return price.amount.eur * nights * people;
    case "stay":            return price.amount.eur;
    default:                return price.amount.eur;
  }
}

export function getRoomTotal(room: RoomHolding, price: Price, people: number, nights: number): number {
  const extrasTotal = room.extrasSnapshot
    .filter(extra => extra.value !== false)
    .reduce((sum, extra) => {
      if (!extra.price) return sum;
      return sum + getExtraPrice(extra.price, extra.value, people, nights);
    }, 0);

  return price.amount.eur * nights + extrasTotal;
}

// Pass Prices form BE

export const getTotalPrice = (selectedRooms: Partial<Record<number, RoomHolding>>, requestedRooms: RequestedRoom[], nights: number)=> {
  return Object.entries(selectedRooms).reduce((sum, [index, room]) => {
    if (!room) return sum;
    return sum + getRoomTotal(room, {amount: { eur: 5000 }, per: "night"}, requestedRooms[Number(index)].people, nights);
  }, 0);
}