import type {FunctionComponent} from "react";
import ScrollToTop from "@/ScrollToTop.tsx";
import {BrowserRouter, Route, Routes} from "react-router";
import Layout from "@/components/layouts/Layout.tsx";
import {Home} from "@/pages/Home.tsx";
import {Rooms} from "@/pages/Rooms.tsx";
import {Contact} from "@/pages/Contact.tsx";
import {Torgelow} from "@/pages/Torgelow.tsx";
import {Booking} from "@/pages/booking/Booking.tsx";
import {Login} from "@/pages/Login.tsx";
import {DashboardLayout} from "@/components/layouts/DashboardLayout.tsx";
import {Dashboard} from "@/pages/dashboard/Dashboard.tsx";
import {BookingReview} from "@/pages/booking/BookingReview.tsx";
import {BookingProvider} from "@/pages/booking/BookingContext.tsx";
import {Imprint} from "@/pages/Imprint.tsx";
import {LegalNotice} from "@/pages/LegalNotice.tsx";
import {AppGuard} from "@/AppGuard.tsx";
import {Toaster} from "@/components/ui/sonner.tsx";

export const App: FunctionComponent = () => {
  return (
    <AppGuard>
    <BrowserRouter>
      <Toaster position="top-center" richColors theme="light" />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
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
        </Route>
        
        <Route path="/login" element={<Login />} />
        
        {/* Protect using wrapping Auth Guard Route */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </AppGuard>
  )
}
