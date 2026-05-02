import {useMemo} from "react";
import {useRevalidatePricing} from "@/hooks/useRevalidatePricing";
import type {RoomHolding} from "@/assets/bookingTypes";

type RoomHoldingMap = Partial<Record<string, RoomHolding>>;

export function useCheckoutPricing(
  sessionId: string,
  roomHoldings: RoomHoldingMap,
) {
  const { data: pricedHoldings, isPending } = useRevalidatePricing(sessionId);

  const validRoomHoldings: RoomHoldingMap = useMemo(() => {
    const base = roomHoldings ?? {};

    if (!pricedHoldings) return base;

    const serverMap = Object.fromEntries(
      pricedHoldings.map(h => [h.requestedRoomId, h])
    );

    return {
      ...base,
      ...serverMap,
    };
  }, [pricedHoldings, roomHoldings]);

  const hasPriceChanged = useMemo(() => {
    if (!pricedHoldings) return false;

    return pricedHoldings.some(serverRoom => {
      const localRoom = roomHoldings[serverRoom.requestedRoomId];
      if (!localRoom) return false;

      const roomChanged =
        localRoom.price.amount !== serverRoom.price.amount;

      const extrasChanged = serverRoom.extrasSnapshot.some((serverExtra, i) => {
        const localExtra = localRoom.extrasSnapshot[i];
        if (!localExtra) return false;

        return (
          localExtra.price?.amount !== serverExtra.price?.amount ||
          localExtra.optionPrice?.amount !== serverExtra.optionPrice?.amount
        );
      });

      return roomChanged || extrasChanged;
    });
  }, [pricedHoldings, roomHoldings]);

  return {
    validRoomHoldings,
    hasPriceChanged,
    isRevalidationPending: isPending,
  };
}