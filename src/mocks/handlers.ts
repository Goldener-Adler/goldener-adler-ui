import {http, HttpResponse} from "msw";

export const handlers = [
  http.post(import.meta.env.VITE_BOOKING_ENDPOINT, () => {
    return HttpResponse.json({
      success: true,
      status: 200
    });
  }),
]