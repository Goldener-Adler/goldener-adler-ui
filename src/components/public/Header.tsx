import {useEffect, useState, type FunctionComponent} from "react";
import {Button} from "@/components/ui/button.tsx";
import {useLocation, useNavigate} from "react-router";
import {useTranslation} from "react-i18next";
import {LanguageSelect} from "@/components/public/LanguageSelect.tsx";
import {BOOKING_SESSION_STORAGE_KEY, COOKIE_KEY, TRANSPARENT_ROUTES} from "@/assets/consts.ts";
import type { MenuItem } from "@/assets/types.ts";
import { MenuDrawer } from "./MenuDrawer.tsx";
import Cookies from "js-cookie";

export const Header: FunctionComponent = () => {
  const [isTransparent, setIsTransparent] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  
  const MENU_ITEMS: MenuItem[] = [
    {
      label: t("public.Menu.Start"),
      path: "/",
    },
    {
      label: t("public.Menu.Rooms"),
      path: "/rooms",
    },
    {
      label: t("public.Menu.Contact"),
      path: "/contact",
    },
    /*
    {
      label: t("public.Menu.Torgelow"),
      path: "/torgelow",
    },
     */
  ]
  
  useEffect(() => {
    const isTransparentRoute = TRANSPARENT_ROUTES.some(route => {
      if (route === "/") {
        return location.pathname === route;
      }
      return location.pathname.startsWith(route);
    });
    if (!isTransparentRoute){
      setIsTransparent(false);
      return;
    }
    const handleScroll = () => {
      setIsTransparent(window.scrollY === 0);
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initial setzen
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);
  
  const getBookingButton = () => {
    const hasConsent = Cookies.get(COOKIE_KEY) !== "none";
    const hasBookingDetails = hasConsent
      ? sessionStorage.getItem(BOOKING_SESSION_STORAGE_KEY) !== null
      : false;
    if(location.pathname.startsWith("/booking")) return;
    return (
      <Button onClick={() => navigate(hasBookingDetails ? '/booking/review' : '/booking')} className={`text-md ${isTransparent ? "" : ""}`} variant={isTransparent ? "secondary" : "default"}>
        {hasBookingDetails ? t("public.Buttons.Return") : t("public.Buttons.BookNow")}
      </Button>
    )
  }
  
  return (
    <div id="header-container" className={`fixed w-full top-0 z-50 transition-colors ${isTransparent ? "bg-transparent" : "bg-background shadow-md"}`}>
      <menu className="pr-5 pl-2 py-3 max-w-6xl m-auto flex gap-3 items-center">
        <li className="sm:hidden block">
          <MenuDrawer items={MENU_ITEMS} isTransparent={isTransparent} />
        </li>
        {MENU_ITEMS.map((menuItem, index) => (
          <li key={index} className="hidden sm:block">
            <Button onClick={() => navigate(menuItem.path)} size="sm" className={`text-md ${isTransparent ? "text-background" : ""}`} variant="link">{menuItem.label}</Button>
          </li>
        ))}
        <div className="flex-1"></div>
        <LanguageSelect isTop={isTransparent}></LanguageSelect>
        {getBookingButton()}
      </menu>
    </div>
  )
}
