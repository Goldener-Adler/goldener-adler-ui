import { z } from "zod";
import {BOOKING_OPTIONS} from "@/assets/consts.ts";

export const createBookingSchema = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  
  const dateRangeSchema = z.object({
    from: z.date({ message: 'public.Forms.Errors.Date.CheckInRequired'})
      .min(today, { message: 'public.Forms.Errors.Date.CheckInPast'}),
    to: z.date({ message: 'public.Forms.Errors.Date.CheckOutRequired'})
      .min(tomorrow, { message: 'public.Forms.Errors.Date.CheckOutPast'}).optional(),
  }, { message: 'public.Forms.Errors.Date.Missing'}).optional().superRefine((data, ctx) => {
    if (!data || !data.from) {
      ctx.addIssue({
        code: "custom",
        message: 'public.Forms.Errors.Date.CheckInRequired',
        path: []
      });
    } else if (!data.to) {
      ctx.addIssue({
        code: "custom",
        message: 'public.Forms.Errors.Date.CheckOutRequired',
        path: []
      });
    } else if (data.from > data.to) {
      ctx.addIssue({
        code: "custom",
        message: 'public.Forms.Errors.Date.Order',
        path: []
      });
    } else if (data.from === data.to) {
      ctx.addIssue({
        code: "custom",
        message: 'public.Forms.Errors.Date.SameDay',
        path: []
      });
    }
  });
  
  const roomsSchema = z
    .object({
      singleBedRooms: z.string(),
      doubleBedRooms: z.string(),
      apartmentGuests: z.string(),
    })
    .superRefine((data, ctx) => {
      const valid =
        (data.singleBedRooms && Number(data.singleBedRooms) > 0) ||
        (data.doubleBedRooms && Number(data.doubleBedRooms) > 0) ||
        (data.apartmentGuests && Number(data.apartmentGuests) > 0);
      
      if (!valid) {
        ctx.addIssue({
          code: "custom",
          message: "public.Forms.Errors.Required.Rooms",
          path: [],
        });
      }
    });
  
  const extrasShape = Object.fromEntries(
    BOOKING_OPTIONS.map(opt => [opt.id, z.boolean()])
  );
  
  const extrasSchema = z.object(extrasShape);
  
  return z.object({
    dateRange: dateRangeSchema,
    firstName: z.string()
      .min(1, { message: 'public.Forms.Errors.Required.FirstName' }),
    lastName: z.string()
      .min(1, { message: 'public.Forms.Errors.Required.LastName' }),
    rooms: roomsSchema,
    extras: extrasSchema,
    email: z.email({ error: 'public.Forms.Errors.Required.Email'}),
    phone: z.string()
      .regex(/\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/, 'public.Forms.Errors.Required.Phone')
      .or(z.string(""))
      .optional(),
    message: z.string().optional(),
  });
};
