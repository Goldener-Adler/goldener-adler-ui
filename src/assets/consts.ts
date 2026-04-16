import type {AvailableRoomMap, BookingOption, MenuItem} from "@/assets/types.ts";

export const BOOKING_SESSION_STORAGE_KEY = 'bookingDetails';

export const DEFAULT_TITLE = "Pension Goldener Adler";

export const TRANSPARENT_ROUTES = ['/', '/rooms', '/contact', '/torgelow'];

export const ISO_DATE_REGEX = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/i;

export const EMPTY_STRING = "";

export const COOKIE_KEY = "cookie_consent";

export const API_ENDPOINT = "http://api.pension-goldener-adler";

export const IS_TEST_MODE = import.meta.env.VITE_MOCK_API === 'true'; // test mode enabled when msw

export const USE_NEW_BOOKING = true;

export const MOCK_TIMEOUT = 5000;

export const HOSTING_PROVIDER = {
  NAME: "Scaleway",
  URL: "https://www.scaleway.com/",
  POLICY_URL: "https://www.scaleway.com/en/privacy-policy/"
}

export const METADATA = {
  DOMAIN: "https://pension-goldener-adler.de", //TODO: Add real domain name
  NAME: "Pension \"Goldener Adler\"",
  STREET: "Pasewalker Str.",
  NR: "32",
  POSTCODE: "17358",
  CITY: "Torgelow",
  OWNER: "Henrik Rummel",
  OWNER_MAIL: "henrik.rummel@gasthof-goldener-adler.de", //TODO: Add new domain mail
  OWNER_PHONE: "+493976202045",
  OWNER_PHONE_DISPLAY: "+49 (0) 3976 202045",
  TAX_NR: "084-264-05114",
  UST_ID: "DE 364416038",
  REGISTER_CITY: "Pasewalk",
  REGISTER_ID: "HRB 74048"
}

export const MENU_ITEMS: MenuItem[] = [
  {
    label: "public.Menu.Start",
    path: "/",
  },
  {
    label: "public.Menu.Rooms",
    path: "/rooms",
  },
  {
    label: "public.Menu.Contact",
    path: "/contact",
  },
  {
    label: "public.Menu.Torgelow",
    path: "/torgelow",
  },
]

export const BOOKING_OPTIONS: BookingOption[] = [
  {
    id: "bike",
    label: "public.Forms.Labels.Bike",
  },
  {
    id: "motorcycle",
    label: "public.Forms.Labels.Motorcycle",
  },
  {
    id: "boat",
    label: "public.Forms.Labels.Boat",
  },
  {
    id: "pet",
    label: "public.Forms.Labels.Pet",
  },
] as const

export const EMPTY_AVAILABLE_ROOMS_MAP: AvailableRoomMap = {
  single: {
    capacity: 1,
    available: 0,
    price: 0,
    extraBed: {
      available: 0,
      priceIncrease: 0
    }
  },
  double: {
    capacity: 2,
    available: 0,
    price: 0,
    extraBed: {
      available: 0,
      priceIncrease: 0
    }
  },
  apartment: {
    capacity: 4,
    available: 0,
    price: 0,
    extraBed: {
      available: 0,
      priceIncrease: 0
    }
  }
};
