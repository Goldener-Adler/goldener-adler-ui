import type {Extra} from "@/assets/types";
import {useMemo} from "react";
import {buildExtrasSchema, type ExtrasFormValues} from "@/assets/bookingTypes";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

export function useExtrasForm(extras: Extra[]) {
  const schema = useMemo(() => buildExtrasSchema(extras), [extras]);

  return useForm<ExtrasFormValues>({
    resolver: zodResolver(schema),
    defaultValues: Object.fromEntries(
      extras.map(extra => [
        extra.label.en,
        extra.options === undefined
          ? false                              // yes/no defaults to false
          : extra.options[0]?.value ?? ''     // multi-value defaults to first option
      ])
    ),
  });
}