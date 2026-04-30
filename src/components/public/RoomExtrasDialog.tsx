import {type FunctionComponent, useEffect} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {FieldGroup, FieldSet} from "@/components/ui/field";
import {Button} from "@/components/ui/button";
import type {ExtrasFormValues} from "@/assets/bookingTypes";
import {useTranslation} from "react-i18next";
import type {RoomCategory} from "@/assets/types";
import {Separator} from "@/components/ui/separator";
import {useLocalizedValue} from "@/hooks/useLocalizedValue";
import {useExtrasForm} from "@/hooks/useExtrasForm";
import {ExtraToggle} from "@/components/public/ExtraToggle";
import {ExtraSelect} from "@/components/public/ExtraSelect";

interface RoomExtrasDialogProps {
  isOpen: boolean;
  roomCategory: RoomCategory;
  existing?: ExtrasFormValues;
  isSelected: boolean;
  onClose: () => void;
  onSubmit: (data: ExtrasFormValues) => void;
}

export const RoomExtrasDialog: FunctionComponent<RoomExtrasDialogProps> = ({
  isOpen,
  roomCategory,
  existing,
  isSelected,
  onClose,
  onSubmit,
 }) => {
  const { t } = useTranslation();
  const localize = useLocalizedValue();

  const { handleSubmit, control, reset } = useExtrasForm(roomCategory.extras);

  useEffect(() => {
    if (isOpen) {
      reset(existing);
    }
  }, [isOpen, existing]);

  return (
    <Dialog open={isOpen}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>{localize(roomCategory.title)}</DialogTitle>
          <DialogDescription>
            {t('public.Booking.Options.Description')}
          </DialogDescription>
        </DialogHeader>
        <Separator/>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup className="gap-3">
              {roomCategory.extras.map((extra, index) => extra.options === undefined
                  ? <ExtraToggle key={index} extra={extra} control={control} />
                  : <ExtraSelect key={index} extra={extra} control={control} />
              )}
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