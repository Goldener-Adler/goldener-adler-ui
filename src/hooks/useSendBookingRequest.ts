import {useState} from "react";
import type {BookingFormValues} from "@/assets/types.ts";
import {IS_TEST_MODE, MOCK_TIMEOUT} from "@/assets/consts.ts";
import {toast} from "sonner";
import {useNavigate} from "react-router";
import {useBooking} from "@/pages/booking/BookingContext.tsx";

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

  const onError = () => {
    setLoading(false);
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

  const sendMockBookingRequest = async (bookingFormValues: BookingFormValues, altchaPayload: string) => {
    const requestBody = {
      ...bookingFormValues,
      altchaPayload: altchaPayload,
    }

    const promise = new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
        console.log("MOCK send mail with:", requestBody);
      }, MOCK_TIMEOUT);
    });

    toast.promise(promise, {
      loading: 'Versendet Buchungsanfrage...',
      success: {
        message: 'Buchungsanfrage versendet',
        description: 'Sie werden in 5 Sekunden zur Startseite weitergeleitet.',
        onDismiss: onSuccess,
        onAutoClose: onSuccess,
      },
      error: {
        message: 'Error sending Mail',
        description: 'Bitte versuchen Sie es später nochmal.',
        onDismiss: onError,
        onAutoClose: onError,
      },
    });
  }

  return { sendBookingRequest: IS_TEST_MODE ? sendMockBookingRequest : sendBookingRequest, loading, setLoading };
}