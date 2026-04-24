import type {FunctionComponent} from "react";
import {Page} from "@/layouts/Page";
import {useNewBooking} from "@/contexts/NewBookingContext";

export const CheckOut: FunctionComponent = () => {
  const { state } = useNewBooking();

  if (state.status === "uninitialized") return;

  return (
    <Page>

    </Page>
  )
}