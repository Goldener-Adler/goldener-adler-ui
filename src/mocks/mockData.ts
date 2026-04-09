import type {Booking, Room} from "@/assets/types.ts";

export const MOCK_ROOMS: Room[] = [
  {
    id: "1",
    type: "single",
  },
  {
    id: "2",
    type: "single",
  },
  {
    id: "3",
    type: "single",
  },
  {
    id: "4",
    type: "double",
  },
  {
    id: "5",
    type: "double",
  },
  {
    id: "6",
    type: "double",
  },
  {
    id: "7",
    type: "double",
  },
  {
    id: "8",
    type: "double",
  },
  {
    id: "9",
    type: "double",
  },
  {
    id: "10",
    type: "double",
  },
  {
    id: "11",
    type: "apartment",
  },
]

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: "b1",
    from: new Date("2026-05-01"),
    to: new Date("2026-05-05"),
    rooms: ["4"],
    people: 2,
    firstName: "Alice",
    lastName: "Müller",
    email: "alice.mueller@example.com",
    phone: "+491234567890",
    message: "Late arrival expected.",
    extras: { breakfast: true, parking: false }
  },
  {
    id: "b2",
    from: new Date("2026-05-10"),
    to: new Date("2026-05-15"),
    rooms: ["5"],
    people: 3,
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    phone: null,
    message: "",
    extras: { breakfast: true, parking: true }
  },
  {
    id: "b3",
    from: new Date("2026-05-01"),
    to: new Date("2026-05-03"),
    rooms: ["3"],
    people: 1,
    firstName: "Emma",
    lastName: "Schneider",
    email: "emma.schneider@example.com",
    phone: "+491111111111",
    message: "Quiet room preferred.",
    extras: { breakfast: false, parking: false }
  },
  {
    id: "b4",
    from: new Date("2026-05-12"),
    to: new Date("2026-05-20"),
    rooms: [
      "2",
      "6"
    ],
    people: 4,
    firstName: "Liam",
    lastName: "Brown",
    email: "liam.brown@example.com",
    phone: "+441234567890",
    message: "Family vacation.",
    extras: { breakfast: true, parking: true }
  },
  {
    id: "b5",
    from: new Date("2026-05-28"),
    to: new Date("2026-06-01"),
    rooms: ["7"],
    people: 2,
    firstName: "Sophia",
    lastName: "Wagner",
    email: "sophia.wagner@example.com",
    phone: null,
    message: "",
    extras: { breakfast: false, parking: true }
  },
  {
    id: "b6",
    from: new Date("2026-06-01"),
    to: new Date("2026-06-10"),
    rooms: ["8"],
    people: 3,
    firstName: "Noah",
    lastName: "Fischer",
    email: "noah.fischer@example.com",
    phone: "+491222222222",
    message: "Business trip.",
    extras: { breakfast: true, parking: false }
  },
  {
    id: "b7",
    from: new Date("2026-06-15"),
    to: new Date("2026-06-18"),
    rooms: ["1"],
    people: 1,
    firstName: "Mia",
    lastName: "Weber",
    email: "mia.weber@example.com",
    phone: null,
    message: "Early check-in if possible.",
    extras: { breakfast: true, parking: false }
  },
  {
    id: "b8",
    from: new Date("2026-06-20"),
    to: new Date("2026-06-27"),
    rooms: ["9"],
    people: 3,
    firstName: "Lucas",
    lastName: "Hoffmann",
    email: "lucas.hoffmann@example.com",
    phone: "+491333333333",
    message: "Holiday stay.",
    extras: { breakfast: true, parking: true }
  },
  {
    id: "b9",
    from: new Date("2026-06-29"),
    to: new Date("2026-07-06"),
    rooms: ["3"],
    people: 1,
    firstName: "Olivia",
    lastName: "Klein",
    email: "olivia.klein@example.com",
    phone: "+491444444444",
    message: "",
    extras: { breakfast: false, parking: false }
  },
  {
    id: "b10",
    from: new Date("2026-06-14"),
    to: new Date("2026-06-16"),
    rooms: ["11"],
    people: 2,
    firstName: "Ethan",
    lastName: "Wolf",
    email: "ethan.wolf@example.com",
    phone: "+491555555555",
    message: "Anniversary stay.",
    extras: { breakfast: true, parking: true }
  }
];