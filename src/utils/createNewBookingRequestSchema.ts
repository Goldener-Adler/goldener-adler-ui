import { z } from "zod";

export const createNewBookingSchema = () => {
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

  // TODO: Discuss if a Request should have a Max Room Number
  const requestedRoomsSchema = z.array(
    z.object({
      people: z.number().min(1).max(4),
    })
  ).min(1);

  return z.object({
    dateRange: dateRangeSchema,
    requestedRooms: requestedRoomsSchema
  });
};
