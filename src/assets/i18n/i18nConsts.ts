import type {TranslationKey} from "@/assets/i18n/i18n";
import type {DIAGNOSTIC_CODE, PricePer} from "@/assets/types";

export const pricePerTranslationMap: Record<PricePer, TranslationKey> = {
  night: "public.Rooms.Extras.Per.Night",
  stay: "public.Rooms.Extras.Per.Stay",
  person: "public.Rooms.Extras.Per.Guest",
  nightAndPerson: "public.Rooms.Extras.Per.NightAndGuest"
} as const;

export const getDiagnosticCodeMessage: Record<DIAGNOSTIC_CODE, TranslationKey> = {
  REHYDRATION_FAILED: "public.Toast.NoRoomsAvailable",
  DELETE_ROOM_HOLD_FAILED: "public.Toast.DeleteRoomHoldFailed",
  SAVE_ROOM_HOLD_FAILED: "public.Toast.SaveRoomHoldFailed",
}