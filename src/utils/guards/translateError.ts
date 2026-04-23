import type {TranslationKey} from "@/assets/i18n/i18n";
import type {FieldErrors} from "react-hook-form";
import type {BookingForm} from "@/assets/guestTypes";
import {t} from "i18next";

const getErrorKey = (fieldPath: string, errors: FieldErrors<BookingForm>): TranslationKey | undefined => {
  const pathParts = fieldPath.split('.');
  let current: any = errors;

  for (const part of pathParts) {
    current = current?.[part];
  }

  return current?.message;
};

export const getErrorMessage = (fieldPath: string, errors: FieldErrors<BookingForm>): string | undefined => {
  const key = getErrorKey(fieldPath, errors);
  return key ? t(key) : undefined;
};