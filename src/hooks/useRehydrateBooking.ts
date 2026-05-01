import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNewBooking } from "@/contexts/NewBookingContext";
import {deleteRoomHoldings, fetchRoomHoldings} from "@/api/bookingAPI";
import {toast} from "sonner";
import {getDiagnosticCodeMessage} from "@/assets/i18n/i18nConsts";
import {useTranslation} from "react-i18next";
import {revalidateHoldings} from "@/utils/revalidateHoldings";

export function useRehydrateBooking() {
  const { state, dispatch } = useNewBooking();
  const { t } = useTranslation();
  const isRehydrating = state.status === "rehydrating";

  const { data, isSuccess, isError } = useQuery({
    queryKey: ["holdings", state.sessionId],
    queryFn: () => fetchRoomHoldings(state.sessionId!),
    enabled: isRehydrating && !!state.sessionId,
    retry: 1,
  });

  useEffect(() => {
    if (!isRehydrating) return;

    const run = async () => {
      if (isSuccess && data) {
        const { valid, invalid } = revalidateHoldings(
          data,
          state.requestedRooms,
        );

        if (invalid.length > 0 && state.sessionId) {
          await deleteRoomHoldings(state.sessionId, invalid);
        }

        dispatch({
          type: "REHYDRATE_ROOM_HOLDINGS",
          roomHoldings: valid,
        });
      }

      if (isError) {
        toast.error(t(getDiagnosticCodeMessage["REHYDRATION_FAILED"]));
        dispatch({ type: "RESET_BOOKING" });
      }
    };

    run();
  }, [isSuccess, isError, isRehydrating]);

  return { isRehydrating };
}