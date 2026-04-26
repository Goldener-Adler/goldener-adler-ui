import type {AvailableRoomMap, Booking, BookingRoom, Room} from "@/assets/types.ts";

import {AMENITY_KEYS} from "@/assets/consts";

/*
 * Mocks simulating persistent data
 */
export const MOCK_BOOKING_ROOMS: BookingRoom[] = [
  // b1, 2 people, double room
  {
    id: "br1",
    bookingId: "b1",
    roomId: "r4",
    people: 2
  },
  // b2, 3 people, single room + double room
  {
    id: "br2",
    bookingId: "b2",
    roomId: "r1",
    people: 1
  },
  {
    id: "br3",
    bookingId: "b2",
    roomId: "r5",
    people: 2
  },
  // b3, 1 person, single room
  {
    id: "br4",
    bookingId: "b3",
    roomId: "r2",
    people: 1
  },
  // b4, 4 people, 2 double rooms
  {
    id: "br5",
    bookingId: "b4",
    roomId: "r6",
    people: 2
  },
  {
    id: "br6",
    bookingId: "b4",
    roomId: "r7",
    people: 2
  },
  // b5, 2 people, 1 double room
  {
    id: "br7",
    bookingId: "b5",
    roomId: "r4",
    people: 2
  },
  // b6, 3 people, 1 single room, 1 double room
  {
    id: "br8",
    bookingId: "b6",
    roomId: "r1",
    people: 1
  },
  {
    id: "br9",
    bookingId: "b6",
    roomId: "r5",
    people: 2
  },
  // b7, 1 person, 1 double room
  {
    id: "br10",
    bookingId: "b7",
    roomId: "r6",
    people: 1
  },
  // b8, 3 people, apartment
  {
    id: "br11",
    bookingId: "b8",
    roomId: "r10",
    people: 3
  },
  // b9, 1 person, 1 single room
  {
    id: "br11",
    bookingId: "b9",
    roomId: "r3",
    people: 1
  },
  // b10, 2 people, 1 double room
  {
    id: "br11",
    bookingId: "b10",
    roomId: "r7",
    people: 2
  }
]

// 3 single rooms, 6 double rooms, 1 apartment
export const MOCK_ROOMS: Room[] = [
  {
    id: "r1",
    type: "single",
    capacity: 1
  },
  {
    id: "r2",
    type: "single",
    capacity: 1
  },
  {
    id: "r3",
    type: "single",
    capacity: 1
  },
  {
    id: "r4",
    type: "double",
    capacity: 2
  },
  {
    id: "r5",
    type: "double",
    capacity: 2
  },
  {
    id: "r6",
    type: "double",
    capacity: 2
  },
  {
    id: "r7",
    type: "double",
    capacity: 2
  },
  {
    id: "r8",
    type: "double",
    capacity: 2
  },
  {
    id: "r9",
    type: "double",
    capacity: 2
  },
  {
    id: "r10",
    type: "apartment",
    capacity: 3
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

export const MOCK_FULL_AVAILABLE_ROOM_MAP: AvailableRoomMap = {
  single: {
    capacity: 1,
    available: 3,
    price: 40,
    extraPrices: {
      breakfast: { amount: 5, currency: "EUR", per: "nightAndPerson" },
      extraBed: { amount: 10, currency: "EUR", per: "night" },
      bikeParking: undefined,
      motorbike: undefined,
      pet: undefined
    },
    amenities: [...AMENITY_KEYS.filter(amenity => amenity !== 'kitchen' && amenity !== 'additionalBed')]
  },
  double: {
    capacity: 2,
    available: 6,
    price: 55,
    extraPrices: {
      breakfast: { amount: 5, currency: "EUR", per: "nightAndPerson" },
      extraBed: { amount: 10, currency: "EUR", per: "night" },
      bikeParking: undefined,
      motorbike: undefined,
      pet: undefined
    },
    amenities: [...AMENITY_KEYS.filter(amenity => amenity !== 'kitchen')]
  },
  apartment: {
    capacity: 4,
    available: 1,
    price: 60,
    extraPrices: {
      breakfast: { amount: 15, currency: "EUR", per: "person" },
      extraBed: { amount: 30, currency: "EUR", per: "night" },
      bikeParking: undefined,
      motorbike: undefined,
      pet: undefined
    },
    amenities: [...AMENITY_KEYS],
  }
};