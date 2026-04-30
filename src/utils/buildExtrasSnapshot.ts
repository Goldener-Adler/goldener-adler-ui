import type {ExtrasFormValues} from "@/assets/bookingTypes";
import type {Extra, SelectedExtraSnapshot} from "@/assets/types";

export function buildExtrasSnapshots(
  formValues: ExtrasFormValues,
  extras: Extra[]
): SelectedExtraSnapshot[] {
  return extras.map(extra => {
    const value = formValues[extra.label.en];

    if (extra.options === undefined) {
      return {
        extraLabel: extra.label,
        value: value as boolean,
      };
    }

    const selectedOption = extra.options.find(o => o.value === value);
    return {
      extraLabel: extra.label,
      value: value as string | number,
      optionLabel: selectedOption?.label,
    };
  });
}