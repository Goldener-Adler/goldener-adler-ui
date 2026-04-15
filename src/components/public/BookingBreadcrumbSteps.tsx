import type {FunctionComponent} from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

// TODO: Turn into step based view with left & right arrow buttons on mobile with active step in the middle

export const BookingBreadcrumbSteps: FunctionComponent = () => {
  return (
    <Breadcrumb className="ml-5 py-4">
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/new-booking/rooms">
            1. Zimmer wählen
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/new-booking/guests">
            2. Gästeangaben ausfüllen
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="/new-booking/check-out">
            3. Überprüfen
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}