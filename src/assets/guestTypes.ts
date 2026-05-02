import {z} from "zod";
import type {TranslationKey} from "@/assets/i18n/i18n";

function validateAddress(address: any, ctx: z.RefinementCtx) {
  const result = addressSchema.safeParse(address);

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      ctx.addIssue({
        ...issue,
        path: ["address", ...issue.path],
      });
    });
  }
}

function validateMainGuest(data: any, ctx: z.RefinementCtx) {
  const isForeign = data.citizenship !== "de"

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

  validateAddress(data.address, ctx);
}

function validateAdditionalGuest(data: any, ctx: z.RefinementCtx) {
  const isForeign = data.citizenship !== "de"
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

  validateAddress(data.address, ctx);
}

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

const addressSchema = z
  .object({
    street: z.string().min(1, { message: 'public.Forms.Errors.Required.Street' satisfies TranslationKey }),
    postalCode: z.string().min(1, { message: 'public.Forms.Errors.Required.PostalCode' satisfies TranslationKey}),
    city: z.string().min(1, { message: 'public.Forms.Errors.Required.City' satisfies TranslationKey}),
    country: z.string().min(1, { message: 'public.Forms.Errors.Required.Country' satisfies TranslationKey}),
  });

const reportingRequirementBaseSchema = z.object({
  citizenship: z.string().optional(),
  birthDate: z.date().optional(),
  address: addressSchema.optional(),
});

const reportingRequirementMainGuestSchema = reportingRequirementBaseSchema.superRefine((data, ctx) => {
  if (!data.citizenship || data.citizenship.trim().length === 0) {
    ctx.addIssue({
      code: "custom",
      path: ["citizenship"],
      message: 'public.Forms.Errors.Required.Citizenship',
    });
    return;
  }

  validateMainGuest(data, ctx);
});

const reportingRequirementAdditionalGuestSchema = reportingRequirementBaseSchema.extend({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  familyMember: z.boolean().optional(),
}).superRefine((data, ctx) => {
  if (!data.citizenship || data.citizenship.trim().length === 0) {
    ctx.addIssue({
      code: "custom",
      path: ["citizenship"],
      message: 'public.Forms.Errors.Required.Citizenship',
    });
    return;
  }

  validateAdditionalGuest(data, ctx);
})

const reportingRequirementObjectSchema = z.object({
  mainGuest: reportingRequirementMainGuestSchema,
  allGuestsAreFamily: z.boolean().optional(),
  allGuestsSameCitizenship: z.boolean().optional(),
  additionalGuests: z.array(reportingRequirementAdditionalGuestSchema).optional()
})

export const bookingSchema = z.object({
  contact: contactInfoSchema,
  differentGuest: z.boolean(),
  mainGuestContact: contactInfoSchema.optional(),
  fillAtCheckIn: z.boolean(),
  reportingRequirement: reportingRequirementObjectSchema.nullable().optional(),
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

  if (!data.reportingRequirement) {
    ctx.addIssue({
      code: "custom",
      path: ["reportingRequirement"],
      message: 'public.Forms.Errors.Required.ReportingRequirement' satisfies TranslationKey,
    })
    return
  }

  if(data.reportingRequirement.allGuestsAreFamily && data.reportingRequirement.mainGuest.citizenship === "de") {
    // should never happen
    ctx.addIssue({
      code: "custom",
      path: ["reportingRequirement"],
      message: 'german citizens do not require reporting required data',
    })
    return
  }

  const result = z.object({
    mainGuest: reportingRequirementMainGuestSchema,
    allGuestsAreFamily: z.boolean().optional(),
    allGuestsSameCitizenship: z.boolean().optional(),
    additionalGuestSchema: z.array(reportingRequirementAdditionalGuestSchema).optional()
  }).safeParse(data.reportingRequirement)

  if (!result.success) {
    result.error.issues.forEach((issue) => {
      ctx.addIssue({
        ...issue,
        path: ["reportingRequirement", ...issue.path],
      })
    })
  }
})

export type BookingForm = z.infer<typeof bookingSchema>;
export type ReportingRequirement = NonNullable<BookingForm['reportingRequirement']>;

export const getInitialBookingFormValues = (additionalGuestCount: number): BookingForm => {
  return {
    contact: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      message: "",
    },
    differentGuest: false,
    fillAtCheckIn: false,
    reportingRequirement: {
      mainGuest: {
        citizenship: "",
      },
      allGuestsAreFamily: false,
      additionalGuests: Array(additionalGuestCount).fill(null).map(() => ({
        firstName: '',
        lastName: '',
        citizenship: '',
        familyMember: false,
      }))
    }
  }
}

/*
 * Less strict schemas for validating form values parsed from session storage
 */

const addressSessionSchema = z.object({
  street: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

const reportingRequirementBaseSessionSchema = z.object({
  citizenship: z.string().optional(),
  birthDate: z.date().optional(),
  address: addressSessionSchema.optional(),
});

export const reportingRequirementSessionSchema = z.object({
  mainGuest: reportingRequirementBaseSessionSchema,
  allGuestsAreFamily: z.boolean().optional(),
  allGuestsSameCitizenship: z.boolean().optional(),
  additionalGuests: z.array(reportingRequirementBaseSessionSchema.extend({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    familyMember: z.boolean().optional(),
  })).optional()
});

export type UnsafeReportingRequirementForm = z.infer<typeof reportingRequirementSessionSchema>;

export const bookingFormSessionSchema = z.object({
  contact: contactInfoSchema,
  differentGuest: z.boolean(),
  fillAtCheckIn: z.boolean(),
  reportingRequirement: reportingRequirementSessionSchema.nullable().optional(),
  mainGuestContact: contactInfoSchema.optional(),
});
