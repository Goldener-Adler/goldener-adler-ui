import { useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import {bookingSchema} from "@/assets/guestTypes";
import { confirmBooking } from "@/api/bookingAPI";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import type {SafeNewBookingState} from "@/assets/bookingTypes";

type Params = {
  state: SafeNewBookingState;
  onSuccess: () => void;
};

export function useCheckoutSubmission({ state, onSuccess }: Params) {
  const { t } = useTranslation();

  const parseResult = useMemo(
    () => bookingSchema.safeParse(state.guestFormValues),
    [state.guestFormValues]
  );

  const mutation = useMutation({
    mutationFn: () => {
      if (!parseResult.success || !state.sessionId) {
        throw new Error("Booking state not ready");
      }

      return confirmBooking(
        state.sessionId,
        state.checkIn,
        state.checkOut,
        state.requestedRooms,
        parseResult.data
      );
    },
    onSuccess: () => {
      toast.success(t("public.Toast.BookingSuccess"));
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const isDisabled =
    !state.checkIn ||
    !state.checkOut ||
    mutation.isPending ||
    !parseResult.success;

  return {
    submit: mutation.mutate,
    isSubmitting: mutation.isPending,
    isDisabled,
    isValidGuestData: parseResult.success,
  };
}