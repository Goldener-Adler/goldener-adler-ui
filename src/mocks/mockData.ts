import type { NewBookingState } from "@/assets/bookingTypes";
import type {Amenity, Booking, RoomType} from "@/assets/types.ts";
import {
  PiAlarm,
  PiBed, PiOven,
  PiPhone, PiPlus, PiShower, PiSpeakerSimpleSlash,
  PiTelevisionSimple,
  PiThermometer,
  PiToilet,
  PiTowel,
  PiWifiHigh
} from "react-icons/pi";

export const AMENITIES: Amenity[] = [
  {
    id: "wifi",
    label: 'public.Rooms.Labels.WiFi',
    icon: PiWifiHigh,
    variant: "secondary"
  },
  {
    id: "tv",
    label: 'public.Rooms.Labels.TV',
    icon: PiTelevisionSimple,
    variant: "secondary"
  },
  {
    id: "phone",
    label: 'public.Rooms.Labels.Phone',
    icon: PiPhone,
    variant: "secondary"
  },
  {
    id: "alarm",
    label: 'public.Rooms.Labels.Alarm',
    icon: PiAlarm,
    variant: "secondary"
  },
  {
    id: "heating",
    label: 'public.Rooms.Labels.Heating',
    icon: PiThermometer,
    variant: "secondary"
  },
  {
    id: "sheets",
    label: 'public.Rooms.Labels.Sheets',
    icon: PiBed,
    variant: "secondary"
  },
  {
    id: "towels",
    label: 'public.Rooms.Labels.Towels',
    icon: PiTowel,
    variant: "secondary"
  },
  {
    id: "bath",
    label: 'public.Rooms.Labels.Bath',
    icon: PiToilet,
    variant: "secondary"
  },
  {
    id: "shower",
    label: 'public.Rooms.Labels.Shower',
    icon: PiShower,
    variant: "secondary"
  },
  {
    id: "windows",
    label: 'public.Rooms.Labels.IsolatedWindows',
    icon: PiSpeakerSimpleSlash,
    variant: "secondary"
  },
  {
    id: "kitchen",
    label: 'public.Rooms.Labels.Kitchen',
    icon: PiOven,
    variant: "secondary"
  },
  {
    id: "additionalBed",
    label: 'public.Rooms.Labels.AdditionalBed',
    icon: PiPlus,
    variant: "default"
  },
]

export const MOCK_AVAILABLE_ROOMS_RESPONSE: RoomType[] = [
  {
    type: "single",
    capacity: 1,
    available: 2,
    price: 40,
  },
  {
    type: "double",
    capacity: 2,
    available: 4,
    price: 55,
    extraBed: {
      available: 2,
      priceIncrease: 10,
    }
  },
  {
    type: "apartment",
    capacity: 3,
    available: 1,
    price: 60,
    extraBed: {
      available: 1,
      priceIncrease: 10,
    }
  },
]

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "b1",
    from: new Date("2026-05-01"),
    to: new Date("2026-05-05"),
    people: 2,
    firstName: "Alice",
    lastName: "Müller",
    email: "alice.mueller@example.com",
    phone: "+491234567890",
    message: "Late arrival expected.",
    extras: { breakfast: true, parking: false },
    status: 'confirmed'
  },
  {
    id: "b2",
    from: new Date("2026-05-10"),
    to: new Date("2026-05-15"),
    people: 3,
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    phone: null,
    message: "",
    extras: { breakfast: true, parking: true },
    status: 'confirmed'
  },
  {
    id: "b3",
    from: new Date("2026-05-01"),
    to: new Date("2026-05-03"),
    people: 1,
    firstName: "Emma",
    lastName: "Schneider",
    email: "emma.schneider@example.com",
    phone: "+491111111111",
    message: "Quiet room preferred.",
    extras: { breakfast: false, parking: false },
    status: 'confirmed'
  },
  {
    id: "b4",
    from: new Date("2026-05-12"),
    to: new Date("2026-05-20"),
    people: 4,
    firstName: "Liam",
    lastName: "Brown",
    email: "liam.brown@example.com",
    phone: "+441234567890",
    message: "Family vacation.",
    extras: { breakfast: true, parking: true },
    status: 'confirmed'
  },
  {
    id: "b5",
    from: new Date("2026-05-28"),
    to: new Date("2026-06-01"),
    people: 2,
    firstName: "Sophia",
    lastName: "Wagner",
    email: "sophia.wagner@example.com",
    phone: null,
    message: "",
    extras: { breakfast: false, parking: true },
    status: 'confirmed'
  },
  {
    id: "b6",
    from: new Date("2026-06-01"),
    to: new Date("2026-06-10"),
    people: 3,
    firstName: "Noah",
    lastName: "Fischer",
    email: "noah.fischer@example.com",
    phone: "+491222222222",
    message: "Business trip.",
    extras: { breakfast: true, parking: false },
    status: 'confirmed'
  },
  {
    id: "b7",
    from: new Date("2026-06-15"),
    to: new Date("2026-06-18"),
    people: 1,
    firstName: "Mia",
    lastName: "Weber",
    email: "mia.weber@example.com",
    phone: null,
    message: "Early check-in if possible.",
    extras: { breakfast: true, parking: false },
    status: 'confirmed'
  },
  {
    id: "b8",
    from: new Date("2026-06-20"),
    to: new Date("2026-06-27"),
    people: 3,
    firstName: "Lucas",
    lastName: "Hoffmann",
    email: "lucas.hoffmann@example.com",
    phone: "+491333333333",
    message: "Holiday stay.",
    extras: { breakfast: true, parking: true },
    status: 'confirmed'
  },
  {
    id: "b9",
    from: new Date("2026-06-29"),
    to: new Date("2026-07-06"),
    people: 1,
    firstName: "Olivia",
    lastName: "Klein",
    email: "olivia.klein@example.com",
    phone: "+491444444444",
    message: "",
    extras: { breakfast: false, parking: false },
    status: 'confirmed'
  },
  {
    id: "b10",
    from: new Date("2026-06-14"),
    to: new Date("2026-06-16"),
    people: 2,
    firstName: "Ethan",
    lastName: "Wolf",
    email: "ethan.wolf@example.com",
    phone: "+491555555555",
    message: "Anniversary stay.",
    extras: { breakfast: true, parking: true },
    status: 'confirmed'
  }
];

export const MOCK_NEW_BOOKING_REQUEST: NewBookingState = {
  step: "selection",
  checkIn: new Date("2026-05-15"),
  checkOut: new Date("2026-05-18"),
  requestedRooms: [
    { people: 2 },
    { people: 1 },
  ],
  availableRooms: MOCK_AVAILABLE_ROOMS_RESPONSE,
  selectedRooms: [],
};