import {NEW_BOOKING_SESSION_STORAGE_KEY} from "@/assets/consts";
import {isBookingSession} from "@/utils/guards/isBookingSession";
import type {BookingSession} from "@/assets/bookingTypes";
import {getConsent} from "@/utils/getCookieConsent";

export function isSessionStorageAllowed(): boolean {
  const consent = getConsent();
  return consent === "all" || consent === "essential";
}

const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;

function dateReviver(_key: string, value: unknown): unknown {
  if (typeof value === "string" && ISO_DATE_REGEX.test(value)) {
    const date = new Date(value);
    if (!isNaN(date.getTime())) return date;
  }
  return value;
}

export function saveBookingSession(updates: Partial<BookingSession>): void {
  if (!isSessionStorageAllowed()) return;

  const existing = loadBookingSession();
  const merged = { ...existing, ...updates };

  const sessionStorageValue: string = JSON.stringify(merged);

  if (isBookingSession(JSON.parse(sessionStorageValue, dateReviver))) {
    sessionStorage.setItem(NEW_BOOKING_SESSION_STORAGE_KEY, sessionStorageValue);
  } else {
    console.error("Could not store session in session storage", sessionStorageValue);
  }
}

export function loadBookingSession(): BookingSession | null {
  if (!isSessionStorageAllowed()) return null;

  const sessionStorageValue = sessionStorage.getItem(NEW_BOOKING_SESSION_STORAGE_KEY);

  if (!sessionStorageValue) return null;

  try {
    const bookingSession = JSON.parse(sessionStorageValue, dateReviver);
    if (isBookingSession(bookingSession)) {
      return bookingSession;
    }
    return null;
  } catch {
    return null;
  }
}

export function clearBookingSession(): void {
  sessionStorage.removeItem(NEW_BOOKING_SESSION_STORAGE_KEY);
}