import type {FunctionComponent} from "react";
import type {SelectExtra} from "@/assets/types";
import {type Control, Controller} from "react-hook-form";
import type {ExtrasFormValues} from "@/assets/bookingTypes";
import {Field, FieldLabel} from "@/components/ui/field";
import {useLocalizedValue} from "@/hooks/useLocalizedValue";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {useTranslation} from "react-i18next";
import {useFormatPrice} from "@/hooks/useFormatPrice";
import {pricePerTranslationMap} from "@/assets/i18n/i18nConsts";

interface ExtraSelectProps {
  extra: SelectExtra;
  control: Control<ExtrasFormValues, any, ExtrasFormValues>;
}

export const ExtraSelect: FunctionComponent<ExtraSelectProps> = ({extra, control}) => {
  const { t } = useTranslation();
  const formatPrice = useFormatPrice();
  const localize = useLocalizedValue();

  // TODO: Make prices respect selected currency

  return (
    <Field>
      <FieldLabel htmlFor={extra.id}>
        {localize(extra.label)}
        {extra.price && ` (${formatPrice(extra.price.amount)} ${t(pricePerTranslationMap[extra.price.per])})`}
      </FieldLabel>
      <Controller
        name={extra.id}
        control={control}
        render={({ field }) => (
          <Select
            value={String(field.value)}
            onValueChange={(val) => {
              // coerce back to the original value type
              const original = extra.options.find(o => String(o.value) === val);
              field.onChange(original?.value ?? val);
            }}
          >
            <SelectTrigger id={extra.id}>
              <SelectValue placeholder={t('public.Buttons.Select')} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{localize(extra.label)}</SelectLabel>
                {extra.options.map((option) => (
                  <SelectItem
                    key={option.id}
                    value={String(option.value)}
                  >
                    <span>
                      <span>{option.label ? localize(option.label) : String(option.value)}</span>
                      {option.price && <span className="text-muted-foreground">{` - ${formatPrice(option.price.amount)} ${t(pricePerTranslationMap[option.price.per])}`}</span>}
                    </span>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      />
    </Field>
  )
}