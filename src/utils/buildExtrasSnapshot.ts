import type {ExtrasFormValues} from "@/assets/bookingTypes";
import type {Extra, SelectedExtraSnapshot} from "@/assets/types";

export function formValuesToSnapshot(
  formValues: ExtrasFormValues,
  extras: Extra[]
): SelectedExtraSnapshot[] {
  return extras.map(extra => {
    const value = formValues[extra.id];

    if (extra.options === undefined) {
      return {
        extraId: extra.id,
        extraLabel: extra.label,
        price: extra.price,
        value: value as boolean,
      };
    }

    const selectedOption = extra.options.find(o => o.value === value);
    return {
      extraId: extra.id,
      extraLabel: extra.label,
      price: extra.price,
      value: value as string | number,
      optionId: selectedOption?.id,
      optionLabel: selectedOption?.label,
      optionPrice: selectedOption?.price,
    };
  });
}

export function snapshotToFormValues(
  extrasSnapshot: SelectedExtraSnapshot[] | undefined,
  extras: Extra[]
): ExtrasFormValues {
  const snapshotMap = new Map(
    extrasSnapshot?.map(e => [e.extraId, e.value]) ?? []
  );

  return Object.fromEntries(
    extras.map(extra => {
      const value = snapshotMap.get(extra.id);

      if (value !== undefined) {
        return [extra.id, value];
      }

      if (extra.options === undefined) {
        return [extra.id, false];
      }

      return [extra.id, "default"];
    })
  );
}