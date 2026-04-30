import type {MultiCurrencyAmount} from "@/assets/types";
import {useTranslation} from "react-i18next";

export function useFormatPrice () {
  const { i18n } = useTranslation();
  const currency = 'eur'; // TODO: Use User Selected Currency (Global Context and/or System Language Based)

  return (value: MultiCurrencyAmount, fallback = 'eur'): string => {
    const amountInCents = value[currency]      // exact match first
      ?? value[fallback]    // then configured fallback
      ?? value['eur']        // then base currency
      ?? Object.values(value)[0]  // last resort: first available
      ?? 0;

    const formatter = new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency,
    });

    const decimalPlaces = formatter.resolvedOptions().maximumFractionDigits ?? 2;
    const divisor = Math.pow(10, decimalPlaces);

    return formatter.format(amountInCents / divisor);
  };
}