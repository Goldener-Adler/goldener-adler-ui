import {type FunctionComponent, useEffect} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {Field, FieldGroup, FieldLabel, FieldSet} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {Controller, useForm} from "react-hook-form";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {type ExtraPrices, type RoomExtrasForm, roomExtrasSchema} from "@/assets/bookingTypes";
import {zodResolver} from "@hookform/resolvers/zod";
import {useTranslation} from "react-i18next";
import {pricePerTranslationMap, titleKeyMap} from "@/assets/i18n/i18nConsts";
import type {RoomTypeKey} from "@/assets/types";
import {Separator} from "@/components/ui/separator";

interface RoomExtrasDialogProps {
  isOpen: boolean;
  type: RoomTypeKey;
  existing?: RoomExtrasForm;
  prices: ExtraPrices;
  isSelected: boolean;
  onClose: () => void;
  onSubmit: (data: RoomExtrasForm) => void;
}

export const RoomExtrasDialog: FunctionComponent<RoomExtrasDialogProps> = ({
  isOpen,
  type, // use later for displaying text
  existing,
  prices, // to use for displaying price info
  isSelected,
  onClose,
  onSubmit,
 }) => {
  const { t } = useTranslation();

  const form = useForm<RoomExtrasForm>({
    resolver: zodResolver(roomExtrasSchema),
    defaultValues: {
      breakfast: "none",
      bikeParking: false,
      motorbike: false,
      pet: false,
      extraBed: false,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        breakfast: existing?.breakfast ?? "none",
        bikeParking: existing?.bikeParking ?? false,
        motorbike: existing?.motorbike ?? false,
        pet: existing?.pet ?? false,
        extraBed: existing?.extraBed ?? false,
      });
    }
  }, [isOpen, existing]);

  return (
    <Dialog open={isOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{t(titleKeyMap[type])}</DialogTitle>
          <DialogDescription>
            {t('public.Booking.Options.Description')}
          </DialogDescription>
        </DialogHeader>
        <Separator/>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="breakfast">
                  {`${t("public.Rooms.Extras.Breakfast.Label")} (${prices.breakfast?.amount.toFixed(2)} € ${prices.breakfast?.per && t(pricePerTranslationMap[prices.breakfast.per])})`}
                </FieldLabel>
                <Controller
                  name="breakfast"
                  control={form.control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>{t("public.Rooms.Extras.Breakfast.Label")}</SelectLabel>
                          <SelectItem value="none">
                            {t("public.Rooms.Extras.Breakfast.Values.None")}
                          </SelectItem>
                          <SelectItem value="default">
                            {t("public.Rooms.Extras.Breakfast.Values.Default")}
                          </SelectItem>
                          <SelectItem value="vegetarian">
                            {t("public.Rooms.Extras.Breakfast.Values.Vegetarian")}
                          </SelectItem>
                          <SelectItem value="vegan">
                            {t("public.Rooms.Extras.Breakfast.Values.Vegan")}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            </FieldGroup>
            <FieldGroup className="gap-3">
              <Controller
                name="extraBed"
                control={form.control}
                render={({ field }) => (
                  <Field orientation="horizontal">
                    <Checkbox
                      id="extraBed-checkbox"
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked === true);
                      }}
                    />
                    <FieldLabel
                      htmlFor="extraBed-checkbox"
                      className="font-normal"
                    >
                      {t('public.Rooms.Extras.ExtraBed.Label')} ({prices.extraBed?.amount.toFixed(2)} € {prices.extraBed?.per && t(pricePerTranslationMap[prices.extraBed.per])})
                    </FieldLabel>
                  </Field>
                )}
              />
              <Controller
                name="bikeParking"
                control={form.control}
                render={({ field }) => (
                  <Field orientation="horizontal">
                    <Checkbox
                      id="bikeparking-checkbox"
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked === true);
                      }}
                    />
                    <FieldLabel
                      htmlFor="bikeparking-checkbox"
                      className="font-normal"
                    >
                      {t("public.Rooms.Extras.BikeParking.Label")}
                    </FieldLabel>
                  </Field>
                )}
              />
              <Controller
                name="motorbike"
                control={form.control}
                render={({ field }) => (
                  <Field orientation="horizontal">
                    <Checkbox
                      id="motorbike-checkbox"
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked === true);
                      }}
                    />
                    <FieldLabel
                      htmlFor="motorbike-checkbox"
                      className="font-normal"
                    >
                      {t("public.Rooms.Extras.Motorbike.Label")}
                    </FieldLabel>
                  </Field>
                )}
              />
              <Controller
                name="pet"
                control={form.control}
                render={({ field }) => (
                  <Field orientation="horizontal">
                    <Checkbox
                      id="pet-checkbox"
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked === true);
                      }}
                    />
                    <FieldLabel
                      htmlFor="pet-checkbox"
                      className="font-normal"
                    >
                      {t("public.Rooms.Extras.Pets.Label")}
                    </FieldLabel>
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={onClose}>{t('public.Buttons.Cancel')}</Button>
            <Button type="submit">{isSelected ? t('public.Buttons.Save') : t('public.Buttons.Add')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}