import {Fragment, type FunctionComponent} from "react";
import {Page} from "@/layouts/Page";
import {useNewBooking} from "@/contexts/NewBookingContext";
import {useTranslation} from "react-i18next";
import {Item, ItemContent, ItemDescription, ItemMedia, ItemTitle} from "@/components/ui/item";
import {getNights, toDateOnly} from "@/utils/formatDate";
import {Separator} from "@/components/ui/separator";
import {EMPTY_STRING, SESSION_STORAGE_KEY} from "@/assets/consts";
import {Check, Dot} from "lucide-react";
import {Accordion} from "@/components/ui/accordion";
import {extrasTranslationMap, titleKeyMap} from "@/assets/i18n/i18nConsts";
import {getTypedEntries} from "@/utils/getTypedEntries";
import type {RoomExtrasForm, SelectedRoom} from "@/assets/bookingTypes";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {getExtraPrice, getTotalPrice} from "@/utils/getPrices";
import {Button} from "@/components/ui/button";
import {ReportingRequirementsMainGuestItems} from "@/components/public/ReportingRequirementsMainGuestItems";
import {ReportingRequirementsAdditionalGuestItems} from "@/components/public/ReportingRequirementsAdditionalGuestItems";
import {confirmBooking} from "@/api/bookingAPI";
import {useMutation} from "@tanstack/react-query";
import { toast } from "sonner";

export const CheckOut: FunctionComponent = () => {
  const { state, dispatch } = useNewBooking();
  const { t } = useTranslation();

  if (state.status === "uninitialized") return;

  function translateExtra(key: keyof RoomExtrasForm, value: string | boolean) {
    const map = extrasTranslationMap[key];
    const valueKey = typeof value === "string" ? map.values?.[value] : undefined;
    return valueKey ? `${t(map.label)}: ${t(valueKey)}` : t(map.label);
  }

  const nights = getNights(state.checkIn, state.checkOut);

  function RoomRow({ room, people, nights }: { room: SelectedRoom; people: number; nights: number }) {
    const { t } = useTranslation();
    return (
      <TableRow>
        <TableCell className="font-medium">
          {t(titleKeyMap[room.type])}
        </TableCell>
        <TableCell className="text-center">{people}</TableCell>
        <TableCell className="text-right">
          {room.pricePerNight * nights} €
        </TableCell>
      </TableRow>
    );
  }

  function ExtraRows({ room, people }: { room: SelectedRoom; people: number }) {
    const activeExtras = getTypedEntries(room.extras)
      .filter(([_, value]) => value !== false && value !== "none");

    return activeExtras.map(([key, value]) => (
      <TableRow key={key}>
        <TableCell className="flex items-center gap-2"><Dot size="16px"/>{translateExtra(key, value)}</TableCell>
        <TableCell></TableCell>
        <TableCell className="text-right">
          {room.extraPrices[key] ? `${getExtraPrice(room.extraPrices[key], people, nights)} €` : "-"}
        </TableCell>
      </TableRow>
    ));
  }

  const {mutate, isPending} = useMutation({
    mutationFn: () => {
      if (!state.sessionId) {
        throw new Error("Booking state not ready");
      }
      return confirmBooking(
        state.sessionId,
        state.checkIn,
        state.checkOut,
        state.requestedRooms,
        state.guestFormValues
      );
    },
    onSuccess: () => {
      toast.success(t('public.Toast.BookingSuccess'));
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      dispatch({
        type: "RESET_BOOKING"
      })
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const isCheckOutDisabled = (state.guestFormIsValid && !!state.checkIn && !!state.checkOut) || isPending;

  const { contact, differentGuest, mainGuestContact, fillAtCheckIn, reportingRequirement } = state.guestFormValues;

  return (
    <Page>
      <section className="flex flex-col gap-4 px-5 mt-2 mb-24 mx-auto max-w-3xl">
        <h1 className="text-2xl font-medium">{t('public.CheckOut.Title')}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Item className="p-0">
            <ItemContent>
              <ItemTitle>{t('public.Forms.Labels.CheckIn')}</ItemTitle>
              <ItemDescription>
                {toDateOnly(state.checkIn).toLocaleDateString()}
              </ItemDescription>
            </ItemContent>
          </Item>
          <Item className="p-0">
            <ItemContent>
              <ItemTitle>{t('public.Forms.Labels.CheckOut')}</ItemTitle>
              <ItemDescription>
                {toDateOnly(state.checkOut).toLocaleDateString()}
              </ItemDescription>
            </ItemContent>
          </Item>
        </div>

        <Separator />
        <h2 className="font-medium">{t('public.GuestInfo.Contact')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Item className="p-0">
            <ItemContent>
              <ItemTitle>{t('public.Forms.Labels.FirstName')}</ItemTitle>
              <ItemDescription>
                {contact.firstName}
              </ItemDescription>
            </ItemContent>
          </Item>
          <Item className="p-0">
            <ItemContent>
              <ItemTitle>{t('public.Forms.Labels.LastName')}</ItemTitle>
              <ItemDescription>
                {contact.lastName}
              </ItemDescription>
            </ItemContent>
          </Item>
          <Item className="p-0">
            <ItemContent>
              <ItemTitle>{t('public.Forms.Labels.Email')}</ItemTitle>
              <ItemDescription>
                {contact.email}
              </ItemDescription>
            </ItemContent>
          </Item>
          <Item className="p-0">
            <ItemContent>
              <ItemTitle>{t('public.Forms.Labels.Phone')}</ItemTitle>
              <ItemDescription>
                {contact.phone !== EMPTY_STRING
                  ? contact.phone
                  : "-"
                }
              </ItemDescription>
            </ItemContent>
          </Item>
        </div>

        {differentGuest && mainGuestContact && (
          <>
            <Separator />
            <h2 className="font-medium">{t('public.GuestInfo.Contact')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Item className="p-0">
                <ItemContent>
                  <ItemTitle>{t('public.Forms.Labels.FirstName')}</ItemTitle>
                  <ItemDescription>
                    {mainGuestContact.firstName}
                  </ItemDescription>
                </ItemContent>
              </Item>
              <Item className="p-0">
                <ItemContent>
                  <ItemTitle>{t('public.Forms.Labels.LastName')}</ItemTitle>
                  <ItemDescription>
                    {mainGuestContact.lastName}
                  </ItemDescription>
                </ItemContent>
              </Item>
              <Item className="p-0">
                <ItemContent>
                  <ItemTitle>{t('public.Forms.Labels.Email')}</ItemTitle>
                  <ItemDescription>
                    {mainGuestContact.email}
                  </ItemDescription>
                </ItemContent>
              </Item>
              <Item className="p-0">
                <ItemContent>
                  <ItemTitle>{t('public.Forms.Labels.Phone')}</ItemTitle>
                  <ItemDescription>
                    {mainGuestContact.phone !== EMPTY_STRING
                      ? mainGuestContact.phone
                      : "-"
                    }
                  </ItemDescription>
                </ItemContent>
              </Item>
            </div>
          </>
        )}

        <Separator />
        <h2 className="font-medium">{t('public.GuestInfo.ReportingRequirement')}</h2>
        {fillAtCheckIn && (
          <Item className="p-0">
            <ItemMedia>
              <Check/>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{t('public.Forms.Labels.FillAtCheckIn')}</ItemTitle>
            </ItemContent>
          </Item>
        )}
        {reportingRequirement?.allGuestsAreFamily && (
          <Item className="p-0">
            <ItemMedia>
              <Check/>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{t('public.Forms.Labels.AllAreFamilyMembers')}</ItemTitle>
            </ItemContent>
          </Item>
        )}
        <div>
          {!fillAtCheckIn && reportingRequirement && (
            <Accordion type="multiple" defaultValue={["mainGuest"]}>
              <ReportingRequirementsMainGuestItems values={reportingRequirement.mainGuest} />
              {reportingRequirement.additionalGuests?.map((guest, index) => (
                <ReportingRequirementsAdditionalGuestItems key={`${index}-${guest.lastName}`} values={guest} index={index} allIsFamily={reportingRequirement.allGuestsAreFamily ?? false} />
              ))}
            </Accordion>
          )}
          <Separator />
        </div>


        <h2 className="font-medium">{t('public.General.Rooms')}</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('public.CheckOut.Selection')}</TableHead>
              <TableHead className="text-center">
                {t('public.GuestInfo.Guest_other')}
              </TableHead>
              <TableHead className="text-right">{t('public.CheckOut.PriceForNights', {nights})}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(state.selectedRooms).map(([index, room]) => {
              const people = state.requestedRooms[Number(index)].people;
              return (
                <Fragment key={room ? `${index}-${room.id}` : `${index}-no-room`}>
                  {room
                    ? <>
                      <RoomRow room={room} people={people} nights={nights} />
                      <ExtraRows room={room} people={people} />
                    </>
                    : <TableRow><TableCell>None</TableCell></TableRow>
                  }
                </Fragment>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell>{t('public.CheckOut.Total')}</TableCell>
              <TableCell colSpan={2} className="text-right">
                {getTotalPrice(state.selectedRooms, state.requestedRooms, nights)} €
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <div className="flex justify-end items-end mt-4">
          <Button disabled={isCheckOutDisabled} onClick={() => mutate()}>
            {t('public.Buttons.Book')}
          </Button>
        </div>
      </section>
    </Page>
  )
}