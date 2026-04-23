import {z} from "zod";

export const contactInfoSchema = z.object({
  firstName: z.string() .min(1, { message: 'public.Forms.Errors.Required.FirstName' }),
  lastName: z.string() .min(1, { message: 'public.Forms.Errors.Required.LastName' }),
  email: z.email({ error: 'public.Forms.Errors.Required.Email'}),
  phone: z.string()
    .regex(/\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/, 'public.Forms.Errors.Required.Phone')
    .or(z.string("")).optional(), message: z.string().optional()
});

const meldepflichtMainGuestSchema = z.object({
  citizenship: z.string().min(1),
  birthDate: z.date().optional(),
  address: z
    .object({
      street: z.string().min(1),
      postalCode: z.string().min(1),
      city: z.string().min(1),
      country: z.string().min(1),
    })
    .optional(),
}).superRefine((data, ctx) => {
  const isForeign = data.citizenship && data.citizenship !== "de"

  if (!isForeign) return

  if (!data.birthDate) {
    ctx.addIssue({
      code: "custom",
      path: ["birthDate"],
      message: "Geburtsdatum erforderlich",
    })
  }

  if (!data.address) {
    ctx.addIssue({
      code: "custom",
      path: ["address"],
      message: "Adresse erforderlich",
    })
    return
  }

  // 🔴 Validate address fields (important!)
  const result = z.object({
    street: z.string().min(1),
    postalCode: z.string().min(1),
    city: z.string().min(1),
    country: z.string().min(1),
  }).safeParse(data.address)

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      ctx.addIssue({
        ...issue,
        path: ["address", ...issue.path],
      })
    })
  }
})

const additionalGuestSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  citizenship: z.string().min(1),
  birthDate: z.date().optional(),
  familyMember: z.boolean().optional(),
  address: z
    .object({
      street: z.string().min(1),
      postalCode: z.string().min(1),
      city: z.string().min(1),
      country: z.string().min(1),
    })
    .optional(),
}).superRefine((data, ctx) => {
  const isForeign = data.citizenship && data.citizenship !== "de"
  const isFamilyMember = data.familyMember === true

  if (!isForeign) return

  if (isFamilyMember) {
    if (!data.birthDate) {
      ctx.addIssue({
        code: "custom",
        path: ["birthDate"],
        message: "Geburtsdatum erforderlich",
      })
    }
    return
  } else {
    if (!data.firstName || data.firstName.trim().length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["firstName"],
        message: "Vorname erforderlich",
      })
    }

    if (!data.lastName || data.lastName.trim().length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["lastName"],
        message: "Nachname erforderlich",
      })
    }

    if (!data.birthDate) {
      ctx.addIssue({
        code: "custom",
        path: ["birthDate"],
        message: "Geburtsdatum erforderlich",
      })
    }

    if (!data.address) {
      ctx.addIssue({
        code: "custom",
        path: ["address"],
        message: "Adresse erforderlich",
      })
      return
    }
  }

  // 🔴 Validate address fields (important!)
  const result = z.object({
    street: z.string().min(1),
    postalCode: z.string().min(1),
    city: z.string().min(1),
    country: z.string().min(1),
  }).safeParse(data.address)

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      ctx.addIssue({
        ...issue,
        path: ["address", ...issue.path],
      })
    })
  }
})

const meldepflichtObjectSchema = z.object({
  mainGuest: meldepflichtMainGuestSchema,
  allGuestsAreFamily: z.boolean().optional(),
  allGuestsSameCitizenship: z.boolean().optional(),
  additionalGuests: z.array(additionalGuestSchema).optional()
})

export const bookingSchema = z.object({
  contact: contactInfoSchema,
  differentGuest: z.boolean(),
  mainGuestContact: contactInfoSchema.optional(),
  fillAtCheckIn: z.boolean(),
  meldepflicht: meldepflichtObjectSchema.nullable().optional(),
}).superRefine((data, ctx) => {
  if (data.differentGuest) {
    if (!data.mainGuestContact) {
      ctx.addIssue({
        code: "custom",
        path: ["mainGuestContact"],
        message: "Main guest contact required",
      })
      return
    }

    const result = contactInfoSchema.safeParse(data.mainGuestContact)

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        ctx.addIssue({
          ...issue,
          path: ["mainGuestContact", ...issue.path],
        })
      })
    }
  }
}).superRefine((data, ctx) => {
  if (data.fillAtCheckIn) return

  if (!data.meldepflicht) {
    ctx.addIssue({
      code: "custom",
      path: ["meldepflicht"],
      message: "Meldepflicht required",
    })
    return
  }

  if(data.meldepflicht.allGuestsAreFamily && data.meldepflicht.mainGuest.citizenship === "de") {
    ctx.addIssue({
      code: "custom",
      path: ["meldepflicht"],
      message: "For German Citizens family data is never required",
    })
    return
  }

  const result = z.object({
    mainGuest: meldepflichtMainGuestSchema,
    allGuestsAreFamily: z.boolean().optional(),
    allGuestsSameCitizenship: z.boolean().optional(),
    additionalGuestSchema: z.array(additionalGuestSchema).optional()
  }).safeParse(data.meldepflicht)

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      ctx.addIssue({
        ...issue,
        path: ["meldepflicht", ...issue.path],
      })
    })
  }
})

export type BookingForm = z.infer<typeof bookingSchema>;