import {
  type Dispatch,
  type FunctionComponent,
  type SetStateAction,
  useEffect,
} from "react";
import {
  Dialog,
  DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {ScrollArea} from "@/components/ui/scroll-area";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import {Calendar} from "@/components/ui/calendar";
import {Item, ItemActions, ItemContent, ItemMedia, ItemTitle} from "@/components/ui/item";
import {Bed, Minus, Plus, Users} from "lucide-react";
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import {useNewBooking} from "@/contexts/NewBookingContext";
import {initialBookingRequestValues, type NewBookingRequest, newBookingRequestSchema} from "@/assets/bookingTypes";
import {zodResolver} from "@hookform/resolvers/zod";
import {useIsMobile} from "@/hooks/use-mobile";
import {useLocation, useNavigate} from "react-router";
import {useCreateBookingRequest} from "@/hooks/useCreateBookingRequest";
import {useTranslation} from "react-i18next";
import {VisuallyHidden} from "radix-ui";

interface BookingRequestDialogProps {
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>,
}

export const BookingRequestDialog: FunctionComponent<BookingRequestDialogProps> = ({ open, setOpen }) => {
  const { t } = useTranslation();
  const {state} = useNewBooking();
  const createBookingRequest = useCreateBookingRequest();
  const navigate = useNavigate();
  const location = useLocation();

  const form = useForm<NewBookingRequest>({
    resolver: zodResolver(newBookingRequestSchema),
    defaultValues: initialBookingRequestValues,
  })

  useEffect(() => {
    form.reset({
      dateRange: state.checkIn && state.checkOut
        ? { from: state.checkIn, to: state.checkOut }
        : undefined,
      requestedRooms: state.requestedRooms.length > 0
        ? state.requestedRooms
        : [{ people: 1 }],
    });
  }, []);

  const { control, register } = form;

  const {
    fields: roomFields,
    append: appendRoomField,
    remove: removeRoomField
  } = useFieldArray({
    control,
    name: "requestedRooms"
  })

  const isMobile = useIsMobile();

  const onSubmit = async (data: NewBookingRequest) => {
    const dateRange = data.dateRange;

    if (!dateRange || dateRange.to === undefined) return;

    try {
      await createBookingRequest(
        dateRange.from,
        dateRange.to,
        data.requestedRooms,
      );
      setOpen(false);
      if (location.pathname !== "/new-booking/rooms") {
        navigate("/new-booking/rooms");
      }
    } catch (error) {
      // TODO: On Error don't close and don't navigate away
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogContent className="px-0 py-4 md:min-w-xl">
        <DialogHeader>
          <VisuallyHidden.Root asChild>
            <DialogTitle>{t('public.Booking.Request.Title')}</DialogTitle>
          </VisuallyHidden.Root>
          <VisuallyHidden.Root>
            <DialogDescription>{t('public.Booking.Request.Description')}</DialogDescription>
          </VisuallyHidden.Root>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
          <ScrollArea className={`w-full px-4 max-h-115`}>
            <div className="flex flex-col gap-2 items-center mb-4">
              <Controller
                control={control}
                name="dateRange"
                render={({ field }) => (
                  <Calendar
                    mode="range"
                    weekStartsOn={1}
                    numberOfMonths={isMobile ? 1 : 2}
                    selected={field.value}
                    onSelect={field.onChange}
                  />
                )}
              />
              {roomFields.map((roomField, index) => (
                <Item key={roomField.id} variant="outline" size="sm" className="w-full">
                  <ItemMedia>
                    <Bed />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{t('public.Booking.Options.Rooms_one')} {index + 1}</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <InputGroup className="border-0 shadow-none w-24">
                      <InputGroupInput
                        max={4}
                        min={1}
                        type="number"
                        {...register(`requestedRooms.${index}.people`, {
                          valueAsNumber: true,
                        })}
                        onBlur={(e) => {
                          let value = Number(e.target.value);

                          if (isNaN(value)) value = 1;
                          if (value < 1) value = 1;
                          if (value > 4) value = 4;

                          form.setValue(`requestedRooms.${index}.people`, value);
                        }}
                      />
                      <InputGroupAddon className="text-foreground">
                        <Users />
                      </InputGroupAddon>
                    </InputGroup>
                    <Button onClick={() => removeRoomField(index)} disabled={index === 0} type="button" variant="ghost" size="icon" className="rounded-full">
                      <Minus/>
                    </Button>
                  </ItemActions>
                </Item>
              ))}
              <Item variant="outline" size="sm" asChild className="w-full hover:cursor-pointer">
                <button type="button" className="hover:bg-accent transition-all" onClick={() => appendRoomField({ people: 1 })}>
                  <ItemMedia>
                    <Plus />
                  </ItemMedia>
                  <ItemTitle>
                    {t('public.Buttons.AddRoom')}
                  </ItemTitle>
                </button>
              </Item>
            </div>
          </ScrollArea>
          <Separator />
          <DialogFooter className="px-4 pt-4">
            <Button type="submit">{t('public.Buttons.CheckAvailability')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}