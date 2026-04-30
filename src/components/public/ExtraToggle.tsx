import type {FunctionComponent} from "react";
import type {ToggleExtra} from "@/assets/types";
import {type Control, Controller} from "react-hook-form";
import type {ExtrasFormValues} from "@/assets/bookingTypes";
import {Field, FieldDescription, FieldLabel} from "@/components/ui/field";
import {Checkbox} from "@/components/ui/checkbox";
import {useLocalizedValue} from "@/hooks/useLocalizedValue";
import {useFormatPrice} from "@/hooks/useFormatPrice";
import {pricePerTranslationMap} from "@/assets/i18n/i18nConsts";
import {useTranslation} from "react-i18next";

interface ExtraToggleProps {
  extra: ToggleExtra;
  control: Control<ExtrasFormValues, any, ExtrasFormValues>;
}

export const ExtraToggle: FunctionComponent<ExtraToggleProps> = ({extra, control}) => {
  const { t } = useTranslation();
  const localize = useLocalizedValue();
  const formatPrice = useFormatPrice();

  return (
    <Controller
      name={extra.label.en}
      control={control}
      render={({ field }) => (
        <Field orientation="horizontal">
          <Checkbox
            id={`${extra.label.en}-checkbox`}
            checked={field.value as boolean}
            onCheckedChange={(checked) => {
              field.onChange(checked === true);
            }}
          />
          <FieldLabel
            htmlFor={`${extra.label.en}-checkbox`}
            className="font-normal"
          >
            {localize(extra.label)}
          </FieldLabel>
          {extra.price && <FieldDescription>
            {`${formatPrice(extra.price.amount)} ${t(pricePerTranslationMap[extra.price.per])}`}
          </FieldDescription>}
        </Field>
      )}
    />
  )
}