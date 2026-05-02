import type {FunctionComponent} from "react";
import {Button} from "@/components/ui/button";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {useLocation, useNavigate} from "react-router";
import type {TranslationKey} from "@/assets/i18n/i18n";
import {useTranslation} from "react-i18next";
import {useNewBooking} from "@/contexts/NewBookingContext";
import {useIsMobile} from "@/hooks/use-mobile";
import {bookingSchema} from "@/assets/guestTypes";

type Step = {
  path: string;
  key: TranslationKey;
  onNext?: "submit-form" | "navigate" | "custom";
  formId?: string;
};

const steps: Step[] = [
  {
    path: "/new-booking/rooms",
    key: "public.Booking.Headings.RoomSelection",
    onNext: "navigate",
  },
  {
    path: "/new-booking/guests",
    key: "public.Booking.Headings.GuestDetails",
    onNext: "submit-form",
    formId: 'guest-form'
  },
  {
    path: "/new-booking/check-out",
    key: "public.Booking.Headings.CheckOut",
    onNext: "navigate",
  },
] as const;

export const BookingSteps: FunctionComponent = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useNewBooking();

  const isMobile = useIsMobile();

  const currentIndex = steps.findIndex((s) => s.path === location.pathname);
  const current = steps[currentIndex];

  if (state.status === "uninitialized") return;

  const handlePrevButton = () => {
    const prev = steps[currentIndex - 1];
    if (prev) navigate(prev.path);
  };

  const handleNextButton = () => {
    if (!current) return;

    switch (current.onNext) {
      case "submit-form": {
        const form = document.getElementById(current.formId ?? "");
        if (form instanceof HTMLFormElement) {
          form.requestSubmit(); // triggers RHF + validation
        }
        if (bookingSchema.safeParse(state.guestFormValues).success) {
          const next = steps[currentIndex + 1];
          navigate(next.path);
        }

        return;
      }

      case "navigate": {
        const next = steps[currentIndex + 1];
        if (next) navigate(next.path);
        return;
      }

      default:
        return;
    }
  };

  const getStep = (direction: "prev" | "current" | "next"): TranslationKey => {
    const index = steps.findIndex((s) => s.path === location.pathname);

    if (index === -1) return "public.Default.Title";

    if (direction === "current") {
      return steps[index].key;
    }

    if (direction === "prev") {
      return steps[index - 1]?.key ?? steps[index].key;
    }

    if (direction === "next") {
      return steps[index + 1]?.key ?? steps[index].key;
    }

    return "public.Default.Title";
  };

  return (
    <div className={`${isMobile && "sticky z-40 top-16 bg-background"} h-14 flex items-center justify-between mx-2`}>
      {currentIndex > 0 ? <Button variant="link" size="sm" onClick={handlePrevButton}>
        <ChevronLeft />
        {t(getStep("prev"))}
      </Button> : <div></div>}

      {currentIndex < steps.length - 1 ? <Button variant="link" size="sm" onClick={handleNextButton}>
        {t(getStep("next"))}
        <ChevronRight />
      </Button> : <div></div>}
    </div>
  )
}