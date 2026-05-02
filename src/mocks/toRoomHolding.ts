import type { RoomHolding } from "@/assets/bookingTypes";
import type {RoomHoldingBE} from "@/assets/types";
import {MOCK_ROOM_CATEGORIES} from "@/mocks/mockData";

export function toRoomHolding(be: RoomHoldingBE): RoomHolding {
  const category = MOCK_ROOM_CATEGORIES.find(c => c.id === be.roomCategoryId);

  return {
    holdingId: be.holdingId,
    id: be.roomCategoryId,
    requestedRoomId: be.requestedRoom.id,
    capacity: be.capacity,
    price: be.price,
    title: category?.title ?? { en: be.roomCategoryId },
    extrasSnapshot: be.extras,
  };
}