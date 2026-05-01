import { useCallback } from "react";
import { useNewBooking } from "@/contexts/NewBookingContext";
import { createSessionId } from "@/utils/createSessionId";
import { saveBookingSession } from "@/utils/bookingSession";
import type {RequestedRoom, BookingSession, RoomHolding} from "@/assets/bookingTypes";
import { getInitialBookingFormValues } from "@/assets/guestTypes";
import getAdditionalGuestCount from "@/utils/getAdditionalGuestCount";
import {clearRoomHoldings, deleteRoomHoldings, fetchRoomHoldings} from "@/api/bookingAPI";
import {revalidateHoldings} from "@/utils/revalidateHoldings";

type RequestInput = {
  checkIn: Date;
  checkOut: Date;
  requestedRooms: RequestedRoom[];
};

function didDatesChange(
  prev: { checkIn: Date; checkOut: Date },
  next: { checkIn: Date; checkOut: Date }
) {
  if (!prev.checkIn || !prev.checkOut) return true;
  return (
    prev.checkIn.getTime() !== next.checkIn.getTime() ||
    prev.checkOut.getTime() !== next.checkOut.getTime()
  );
}

export function useBookingSession() {
  const { state, dispatch } = useNewBooking();

  const ensureSession = useCallback(() => {
    if (state.status !== "uninitialized") {
      return state.sessionId;
    }
    return createSessionId();
  }, [state]);

  const clearHoldings = useCallback(async (sessionId: string) => {
    await clearRoomHoldings(sessionId);
  }, []);

  const handleNewRequest = useCallback(
    async ({ checkIn, checkOut, requestedRooms }: RequestInput) => {
      let sessionId = ensureSession();
      let roomHoldings: Partial<Record<string, RoomHolding>> = {};

      const datesChanged = didDatesChange(
        { checkIn: state.checkIn!, checkOut: state.checkOut! },
        { checkIn, checkOut }
      );

      if (datesChanged) {
        await clearHoldings(sessionId);
        sessionId = createSessionId();
      } else {
        const existing = await fetchRoomHoldings(sessionId);
        const { valid, invalid } = revalidateHoldings(existing, requestedRooms);

        if (invalid.length > 0) {
          await deleteRoomHoldings(sessionId, invalid);
        }
        roomHoldings = valid;
      }

      const bookingSession: BookingSession = {
        sessionId,
        checkIn,
        checkOut,
        requestedRooms,
        guestFormValues: getInitialBookingFormValues(
          getAdditionalGuestCount(requestedRooms)
        ),
      };

      saveBookingSession(bookingSession);

      dispatch({
        type: "SET_REQUEST",
        sessionId,
        checkIn,
        checkOut,
        rooms: requestedRooms,
        roomHoldings
      });

      return sessionId;
    },
    [state, ensureSession, clearHoldings, dispatch]
  );

  return {
    sessionId: state.sessionId,
    ensureSession,
    handleNewRequest,
  };
}