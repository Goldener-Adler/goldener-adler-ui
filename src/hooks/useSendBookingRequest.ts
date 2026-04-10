import {useState} from "react";
import type {BookingFormValues} from "@/assets/types.ts";
import {toast} from "sonner";
import {useNavigate} from "react-router";
import {useBooking} from "@/contexts/BookingContext.tsx";

export const useSendBookingRequest = () => {
  const {resetBookingFormValues} = useBooking()
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  // TODO Add Toast Message Translations
  // TODO Make dismiss handler manage promise state (success / error)

  const onSuccess = () => {
    resetBookingFormValues();
    setLoading(false);
    navigate("/");
  }

  const sendBookingRequest = async (bookingFormValues: BookingFormValues, altchaPayload: string) => {
    const requestBody = {
      ...bookingFormValues,
      altchaPayload: altchaPayload,
    }

    try {
      const response = await fetch(
        import.meta.env.VITE_BOOKING_ENDPOINT,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Sent Mail", {onDismiss: onSuccess, onAutoClose: onSuccess});
      }
    } catch (error) {
      toast.error("Error sending mail: " + error);
      setLoading(false);
    }
  }

  return { sendBookingRequest, loading, setLoading };
}