import {http, HttpResponse} from "msw";
import {API_ENDPOINT, EMPTY_STRING} from "@/assets/consts.ts";
import {MOCK_BOOKINGS, MOCK_ROOMS} from "@/mocks/mockData.ts";
import {toDateOnly} from "@/helpers/formatDate.ts";
import type {DateRange} from "react-day-picker";
import type {Booking} from "@/assets/types.ts";

export const handlers = [
  http.post(import.meta.env.VITE_BOOKING_ENDPOINT, () => {
    return HttpResponse.json(
      { success: true },
      { status: 200 });
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
    console.log(updatedData);

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
  // Rooms
  http.get(API_ENDPOINT + "/rooms", () => {
    return HttpResponse.json(MOCK_ROOMS, {
      status: 200
    })
  }),
  http.get<{ id: string }>(API_ENDPOINT + "/rooms/:id", ({ params }) => {
    const { id } = params;
    const room = MOCK_ROOMS.find(room => room.id === id);
    if (!room) {
      return HttpResponse.json(null, {
        status: 404
      })
    }
    return HttpResponse.json(room, {
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