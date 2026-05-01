import type { RoomHolding } from "@/assets/bookingTypes";
import type {RoomHoldingBE} from "@/assets/types";
import {MOCK_ROOM_CATEGORIES} from "@/mocks/mockData";
import {buildExtrasSnapshots} from "@/utils/buildExtrasSnapshot";

export function toRoomHolding(be: RoomHoldingBE): RoomHolding {
  const category = MOCK_ROOM_CATEGORIES.find(c => c.id === be.roomCategoryId);

  return {
    holdingId: be.holdingId,
    id: be.roomCategoryId,
    requestedRoomId: be.requestedRoomId,
    capacity: be.capacity,
    title: category?.title ?? { en: be.roomCategoryId },
    extrasFormValues: be.selectedExtras,
    extrasSnapshot: category
      ? buildExtrasSnapshots(be.selectedExtras, category.extras)
      : [],
  };
}