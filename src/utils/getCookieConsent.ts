import {COOKIE_KEY} from "@/assets/consts";
import type {CookieConsent} from "@/assets/types";
import Cookies from "js-cookie";

export function getConsent(): CookieConsent | undefined {
  return Cookies.get(COOKIE_KEY) as CookieConsent | undefined;
}