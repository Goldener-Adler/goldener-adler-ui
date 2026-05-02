import {useTranslation} from "react-i18next";

export function useFormatPrice () {
  const { i18n } = useTranslation();
  const currency = 'eur'; // TODO: Use User Selected Currency (Global Context and/or System Language Based)

  return (value: number): string => {
    const formatter = new Intl.NumberFormat(i18n.language, {
      style: 'currency',
      currency,
    });

    const decimalPlaces = formatter.resolvedOptions().maximumFractionDigits ?? 2;
    const divisor = Math.pow(10, decimalPlaces);

    return formatter.format(value / divisor);
  };
}