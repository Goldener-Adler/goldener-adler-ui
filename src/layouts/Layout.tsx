import {Outlet, useLocation} from "react-router";
import {Navbar} from "@/components/public/Navbar.tsx";
import {Footer} from "@/components/public/Footer.tsx";

function Layout() {
  const location = useLocation();

  const isBooking = location.pathname.startsWith("/new-booking");

  return (
    <>
    {!isBooking && <Navbar />}
      <div className="flex flex-col h-dvh">
        <div id="content" className="flex-1 w-full">
          <Outlet />
        </div>
        {!isBooking && <Footer/>}
      </div>
    </>
  )
}

export default Layout
