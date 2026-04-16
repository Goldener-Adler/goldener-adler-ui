import {http, HttpResponse} from "msw";
import {API_ENDPOINT, EMPTY_STRING} from "@/assets/consts.ts";
import {MOCK_BOOKING_ROOMS, MOCK_BOOKINGS, MOCK_FULL_AVAILABLE_ROOM_MAP, MOCK_ROOMS} from "@/mocks/mockData.ts";
import {toDateOnly} from "@/utils/formatDate.ts";
import type {DateRange} from "react-day-picker";
import type {AvailableRoomMap, Booking, RoomTypeKey} from "@/assets/types.ts";
import type {RequestedRoom} from "@/assets/bookingTypes";
import {createSessionId} from "@/utils/createSessionId";

export const handlers = [
  http.post(import.meta.env.VITE_BOOKING_ENDPOINT, () => {
    return HttpResponse.json(
      { success: true },
      { status: 200 });
  }),
  // New Booking
  http.post(API_ENDPOINT + "/available-rooms", async ({ request }) => {
    const body = await request.json() as {checkIn: Date, checkOut: Date, requestedRooms: RequestedRoom[]};

    const availableRooms: AvailableRoomMap = { ...MOCK_FULL_AVAILABLE_ROOM_MAP };

    MOCK_BOOKINGS.filter((booking: Booking) => {
      const isNotOverlapping =
        booking.to <= new Date(body.checkIn) ||
        booking.from >= new Date(body.checkOut);

      if (isNotOverlapping) {
        return booking;
      } else {
        // decrease availability by one
        const roomIds = MOCK_BOOKING_ROOMS
          .filter(bookingRoom => bookingRoom.bookingId === booking.id)
          .map(bookingRoom => bookingRoom.roomId);

        roomIds.forEach((roomId) => {
          const room = MOCK_ROOMS.find(room => room.id === roomId);
          if (room) {
            const availableRoomDetails = availableRooms[room.type];
            availableRooms[room.type] = {
              ...availableRoomDetails,
              available: availableRoomDetails.available - 1
            }
          }
        })
      }
    })

    return HttpResponse.json(
      availableRooms,
      {
        status: 200,
      }
    );
  }),
  http.post(API_ENDPOINT + "/room-holdings", async ({ request }) => {
    const body = await request.json() as {
      sessionId: string,
      roomType: RoomTypeKey,
      requestedRoomIndex: number,
      from: Date,
      to: Date,
      holdingId: string | undefined,
    }

    const holdingId = body.holdingId ? body.holdingId : createSessionId();
    return HttpResponse.json(holdingId, { status: 200 });
  }),
  http.delete(API_ENDPOINT + "/room-holdings/:id", async () => {
    return HttpResponse.json({status: 200});
  }),
  // Bookings
  http.post(API_ENDPOINT + "/bookings", async ({ request }) => {
    const body = await request.json() as {search?: string, dateRange?: DateRange};

    const search = body.search ?? EMPTY_STRING;
    const dateRange = body.dateRange ?? undefined;

    const filtered = MOCK_BOOKINGS.filter((booking) => {
      const fullName = `${booking.firstName} ${booking.lastName}`.toLowerCase();
      return fullName.includes(search.toLowerCase());
    }).filter((booking) => {
      if (dateRange && dateRange.from && dateRange.to) {
        const from = toDateOnly(new Date(dateRange.from));
        const to = toDateOnly(new Date(dateRange.to));
        return toDateOnly(booking.from) <= to && toDateOnly(booking.to) >= from;
      }
      return booking;
    });

    return HttpResponse.json(filtered, {
      status: 200
    })
  }),
  http.get<{ id: string }>(API_ENDPOINT + '/bookings/:id', ({ params }) => {
    const { id } = params;
    const booking = MOCK_BOOKINGS.find(booking => booking.id === id);
    if (!booking) {
      return HttpResponse.json(null, {
        status: 404
      })
    }
    return HttpResponse.json(booking, {
      status: 200,
    })
  }),
  http.put<{ id: string }>(API_ENDPOINT + '/bookings/:id', async ({ params, request }) => {
    const { id } = params;
    const updatedData = await request.json() as Booking;

    const index = MOCK_BOOKINGS.findIndex(b => b.id === id)

    if (index === -1) {
      return HttpResponse.json(null, { status: 404 })
    }

    MOCK_BOOKINGS[index] = {
      ...MOCK_BOOKINGS[index],
      ...updatedData,
    }

    return HttpResponse.json(MOCK_BOOKINGS[index], {
      status: 200,
    })
  }),
  http.delete(API_ENDPOINT + '/bookings/:id', ({ params }) => {
    const { id } = params;
    const index = MOCK_BOOKINGS.findIndex(b => b.id === id)

    if (index === -1) {
      return HttpResponse.json(null, { status: 404 })
    }

    return HttpResponse.json(id, {
      status: 200,
    })
  }),
  // Dashboard
  http.get(API_ENDPOINT + "/occupancy", () => {
    // const url = new URL(request.url);
    // const dateString = url.searchParams.get("date");
    //const date = toDateOnly(dateString ? new Date(dateString) : new Date());

    const random = Math.random() * 100;

    return HttpResponse.json(
      {
        occupied: random,
        free: 100 - random,
      }, {
      status: 200,
    })
  }),
  http.get(API_ENDPOINT + "/week", ({ request }) => {
    const url = new URL(request.url);
    const fromString = url.searchParams.get("from");
    const toString = url.searchParams.get("to");
    if (!fromString || fromString === "") {
      return HttpResponse.json(null, {
        status: 404
      })
    }
    const from = toDateOnly(new Date(fromString));
    const to = toDateOnly(
      toString && toString !== EMPTY_STRING
        ? new Date(toString)
        : (() => {
          const d = new Date(from);
          d.setDate(d.getDate() + 6);
          return d;
        })());

    const bookingsToday = MOCK_BOOKINGS.filter(booking => {
      const fromBooking = toDateOnly(booking.from);
      const toBooking = toDateOnly(booking.to);

      return fromBooking > to && toBooking < from;
    });

    return HttpResponse.json(bookingsToday, {
      status: 200
    })
  })
]