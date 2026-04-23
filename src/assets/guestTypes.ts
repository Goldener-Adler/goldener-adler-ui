import {z} from "zod";
import type {TranslationKey} from "@/assets/i18n/i18n";

const phoneSchema = z.string().regex(
  /\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/,
  'public.Forms.Errors.Required.Phone' satisfies TranslationKey
);
export const contactInfoSchema = z.object({
  firstName: z.string().min(1, { message: 'public.Forms.Errors.Required.FirstName' satisfies TranslationKey }),
  lastName: z.string().min(1, { message: 'public.Forms.Errors.Required.LastName' satisfies TranslationKey }),
  email: z.email({ error: 'public.Forms.Errors.Required.Email' satisfies TranslationKey}),
  phone: z.union([phoneSchema, z.literal("")]).optional(),
  message: z.string().optional()
});

const meldepflichtMainGuestSchema = z.object({
  citizenship: z
    .string()
    .optional()
    .refine((val) => val && val.length > 0, {
      message: 'public.Forms.Errors.Required.Citizenship' satisfies TranslationKey,
    }),
  birthDate: z.date().optional(),
  address: z
    .object({
      street: z.string().min(1, { message: 'public.Forms.Errors.Required.Street' satisfies TranslationKey }),
      postalCode: z.string().min(1, { message: 'public.Forms.Errors.Required.PostalCode' satisfies TranslationKey}),
      city: z.string().min(1, { message: 'public.Forms.Errors.Required.City' satisfies TranslationKey}),
      country: z.string().min(1, { message: 'public.Forms.Errors.Required.Country' satisfies TranslationKey}),
    })
    .optional(),
}).superRefine((data, ctx) => {
  const isForeign = data.citizenship && data.citizenship !== "de"

  if (!isForeign) return

  if (!data.birthDate) {
    ctx.addIssue({
      code: "custom",
      path: ["birthDate"],
      message: 'public.Forms.Errors.Required.BirthDate' satisfies TranslationKey,
    })
  }

  if (!data.address) {
    ctx.addIssue({
      code: "custom",
      path: ["address"],
      message: 'public.Forms.Errors.Required.Address' satisfies TranslationKey,
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
  citizenship: z
    .string()
    .optional()
    .refine((val) => val && val.length > 0, {
      message: 'public.Forms.Errors.Required.Citizenship' satisfies TranslationKey,
    }),
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
        message: 'public.Forms.Errors.Required.BirthDate' satisfies TranslationKey,
      })
    }
    return
  } else {
    if (!data.firstName || data.firstName.trim().length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["firstName"],
        message: 'public.Forms.Errors.Required.FirstName' satisfies TranslationKey,
      })
    }

    if (!data.lastName || data.lastName.trim().length === 0) {
      ctx.addIssue({
        code: "custom",
        path: ["lastName"],
        message: 'public.Forms.Errors.Required.LastName' satisfies TranslationKey,
      })
    }

    if (!data.birthDate) {
      ctx.addIssue({
        code: "custom",
        path: ["birthDate"],
        message: 'public.Forms.Errors.Required.BirthDate' satisfies TranslationKey,
      })
    }

    if (!data.address) {
      ctx.addIssue({
        code: "custom",
        path: ["address"],
        message: 'public.Forms.Errors.Required.Address' satisfies TranslationKey,
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
        message: 'public.Forms.Errors.Required.MainGuestContact' satisfies TranslationKey,
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
      message: 'public.Forms.Errors.Required.ReportingRequirement' satisfies TranslationKey,
    })
    return
  }

  if(data.meldepflicht.allGuestsAreFamily && data.meldepflicht.mainGuest.citizenship === "de") {
    // should never happen
    ctx.addIssue({
      code: "custom",
      path: ["meldepflicht"],
      message: 'german citizens do not require reporting required data',
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