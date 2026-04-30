import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import {COOKIE_KEY} from "@/assets/consts.ts";

export function useCookieConsent() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const consent = Cookies.get(COOKIE_KEY);
    if (!consent) {
      setIsOpen(true);
    }
  }, []);

  const accept = () => {
    Cookies.set(COOKIE_KEY, "accept", {
      expires: 365,
      path: "/",
      sameSite: "Lax",
    });
    setIsOpen(false);
  };

  const decline = () => {
    Cookies.set(COOKIE_KEY, "none", {
      expires: 365,
      path: "/",
      sameSite: "Lax",
    });
    sessionStorage.clear();
    setIsOpen(false);
  };

  const essential = () => {
    Cookies.set(COOKIE_KEY, "essential", {
      expires: 365,
      path: "/",
      sameSite: "Lax",
    });
    setIsOpen(false);
  }

  return { isOpen, setIsOpen, accept, decline, essential };
}
