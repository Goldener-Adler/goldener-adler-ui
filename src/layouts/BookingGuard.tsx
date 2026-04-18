import {Navigate, Outlet} from "react-router";
import {useNewBooking} from "@/contexts/NewBookingContext";

export function BookingGuard() {
  const { state } = useNewBooking();

  if (state.step === "request") {
    return <Navigate to="/" replace />
  }

  return <Outlet/>
}