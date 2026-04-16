import {Navigate, Route, Routes} from "react-router";
import Layout from "@/layouts/Layout.tsx";
import {Home} from "@/pages/public/Home.tsx";
import {Rooms} from "@/pages/public/Rooms.tsx";
import {Contact} from "@/pages/public/Contact.tsx";
import {Torgelow} from "@/pages/public/Torgelow.tsx";
import {Imprint} from "@/pages/public/Imprint.tsx";
import {LegalNotice} from "@/pages/public/LegalNotice.tsx";
import {BookingProvider} from "@/contexts/BookingContext.tsx";
import {Booking} from "@/pages/public/booking/Booking.tsx";
import {BookingReview} from "@/pages/public/booking/BookingReview.tsx";
import {Login} from "@/pages/dashboard/Login.tsx";
import {DashboardLayout} from "@/layouts/DashboardLayout.tsx";
import {Dashboard} from "@/pages/dashboard/Dashboard.tsx";
import {Bookings} from "@/pages/dashboard/bookings/Bookings.tsx";
import {BookingDetails} from "@/pages/dashboard/bookings/BookingDetails.tsx";
import {BookingRoomSelection} from "@/pages/public/newBooking/BookingRoomSelection";
import {BookingLayout} from "@/layouts/BookingLayout";
import {NewBookingProvider} from "@/contexts/NewBookingContext";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={
        <NewBookingProvider>
          <Layout />
        </NewBookingProvider>
      }>
        <Route index element={<Home />} />
        <Route path="rooms" element={<Rooms />} />
        <Route path="contact" element={<Contact />} />
        <Route path="torgelow" element={<Torgelow />} />
        <Route path="imprint" element={<Imprint />} />
        <Route path="legal" element={<LegalNotice />} />
        <Route
          path="/booking/*"
          element={
            <BookingProvider>
              <Routes>
                <Route path="" element={<Booking />} />
                <Route path="review" element={<BookingReview />} />
              </Routes>
            </BookingProvider>
          }
        />
        <Route path="/new-booking" element={
            <BookingLayout/>
        }>
          <Route index element={<Navigate to="rooms" replace />} />
          <Route path="rooms" element={<BookingRoomSelection />}/>
          <Route path="guests"/>
          <Route path="check-out"/>
        </Route>
      </Route>

      <Route path="/login" element={<Login />} />

      {/* Protect using wrapping Auth Guard Route */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="bookings/:id" element={<BookingDetails/>}/>
      </Route>
    </Routes>
  )
}