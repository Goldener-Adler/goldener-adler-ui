import {type FunctionComponent, useEffect} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {Field, FieldDescription, FieldGroup, FieldLabel, FieldSet} from "@/components/ui/field";
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
import {type RoomExtrasForm, roomExtrasSchema} from "@/assets/bookingTypes";
import {zodResolver} from "@hookform/resolvers/zod";
import {useTranslation} from "react-i18next";
import {titleKeyMap} from "@/assets/i18n/i18nConsts";
import type {RoomTypeKey} from "@/assets/types";

interface RoomExtrasDialogProps {
  isOpen: boolean;
  type: RoomTypeKey;
  existing?: RoomExtrasForm;
  isSelected: boolean;
  onClose: () => void;
  onSubmit: (data: RoomExtrasForm) => void;
}

export const RoomExtrasDialog: FunctionComponent<RoomExtrasDialogProps> = ({
  isOpen,
  type, // use late for displaying text
  existing,
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
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        breakfast: existing?.breakfast ?? "none",
        bikeParking: existing?.bikeParking ?? false,
        motorbike: existing?.motorbike ?? false,
        pet: existing?.pet ?? false,
      });
    }
  }, [isOpen, existing]);

  return (
    <Dialog open={isOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{t(titleKeyMap[type])}</DialogTitle>
          <DialogDescription>
            Beschreibung
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldDescription>
              Verbessern Sie ihren Aufenthalt und fügen Sie zusätzliche Angaben für Ihr gewähltes Zimmer hinzu
            </FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="breakfast">Frühstück</FieldLabel>
              <Controller
                name="breakfast"
                control={form.control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full max-w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Frühstücksoptionen</SelectLabel>
                        <SelectItem value="none">Kein Frühstück</SelectItem>
                        <SelectItem value="default">Frühstück</SelectItem>
                        <SelectItem value="vegetarian">Frühstück (Vegetarisch)</SelectItem>
                        <SelectItem value="vegan">Frühstück (Vegan)</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
                />
              </Field>
            </FieldGroup>
            <FieldGroup className="gap-3">
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
                      Fahrradstellplätze
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
                      Motorrad
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
                      Haustiere
                    </FieldLabel>
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Abbrechen</Button>
            <Button type="submit">{isSelected ? 'Speichern' : 'Hinzufügen'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}