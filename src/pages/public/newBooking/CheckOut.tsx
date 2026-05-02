import {Fragment, type FunctionComponent, useEffect, useMemo} from "react";
import {Page} from "@/layouts/Page";
import {useNewBooking} from "@/contexts/NewBookingContext";
import {useTranslation} from "react-i18next";
import {Item, ItemContent, ItemDescription, ItemMedia, ItemTitle} from "@/components/ui/item";
import {getNights, toDateOnly} from "@/utils/formatDate";
import {Separator} from "@/components/ui/separator";
import {EMPTY_STRING} from "@/assets/consts";
import {Check, Dot, InfoIcon} from "lucide-react";
import {Accordion} from "@/components/ui/accordion";
import type {RoomHolding} from "@/assets/bookingTypes";
import {Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Button} from "@/components/ui/button";
import {ReportingRequirementsMainGuestItems} from "@/components/public/ReportingRequirementsMainGuestItems";
import {ReportingRequirementsAdditionalGuestItems} from "@/components/public/ReportingRequirementsAdditionalGuestItems";
import {useLocalizedValue} from "@/hooks/useLocalizedValue";
import {bookingFormSessionSchema, getInitialBookingFormValues} from "@/assets/guestTypes";
import {useNavigate} from "react-router";
import {useFormatPrice} from "@/hooks/useFormatPrice";
import {getExtraPriceCents, getRoomCents, getTotalPrice} from "@/utils/getPrices";
import {Alert, AlertAction, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {useCheckoutPricing} from "@/hooks/useCheckoutPricing";
import {useCheckoutSubmission} from "@/hooks/useCheckoutSubmission";
import {isExtraSelected} from "@/utils/guards/isExtraSelected";
import getAdditionalGuestCount from "@/utils/getAdditionalGuestCount";

export const CheckOut: FunctionComponent = () => {
  const { t } = useTranslation();
  const localize = useLocalizedValue();
  const navigate = useNavigate();
  const format = useFormatPrice();
  const { state, dispatch } = useNewBooking();

  if (state.status === "uninitialized") {
    navigate('/');
    return null;
  }

  const parseResult = useMemo(
    () => bookingFormSessionSchema.safeParse(
      state.guestFormValues
    ),
    [state]
  );

  useEffect(() => {
    if (!parseResult.success) {
      console.error("Could not restore guest form successfully");
    }
  }, [parseResult.success, navigate]);

  const {
    validRoomHoldings,
    hasPriceChanged,
    isRevalidationPending
  } = useCheckoutPricing(
    state.sessionId,
    state.roomHoldings,
  );

  const onSuccess = () => {
    dispatch({
      type: "RESET_BOOKING"
    })
  }

  const { isValidGuestData, isDisabled, submit, isSubmitting } = useCheckoutSubmission({ state, onSuccess })

  const formValues =
    parseResult.data ??
    getInitialBookingFormValues(
      getAdditionalGuestCount(state.requestedRooms)
    );

  const {
    contact,
    differentGuest,
    mainGuestContact,
    fillAtCheckIn,
    reportingRequirement
  } = formValues;

  const nights = getNights(state.checkIn, state.checkOut);

  const isCheckOutDisabled = isDisabled || isSubmitting || isRevalidationPending || !parseResult.success;

  function RoomRow({ room, people }: { room: RoomHolding; people: number }) {
    return (
      <TableRow>
        <TableCell className="font-medium">
          {localize(room.title)}
        </TableCell>
        <TableCell className="text-center">{people}</TableCell>
        <TableCell className="text-right">
          {format(getRoomCents(room, nights))}
        </TableCell>
      </TableRow>
    );
  }

  function ExtraRows({ room, people }: { room: RoomHolding, people: number }) {
    return room.extrasSnapshot.map((extra) => {

      const displayPrice = getExtraPriceCents(extra, nights, people);
      return isExtraSelected(extra) ? (
        <TableRow key={`${room.holdingId}-${extra.extraLabel.en}`}>
          <TableCell className="flex items-center gap-2">
            <Dot size="16px"/>
            <span>{localize(extra.extraLabel)}: {extra.optionLabel && localize(extra.optionLabel)}</span>
          </TableCell>
          <TableCell></TableCell>
          <TableCell className="text-right">
            {displayPrice !== 0
              ? format(displayPrice)
              : "-"
            }
          </TableCell>
        </TableRow>
      ) : null;
    });
  }

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

        {!isValidGuestData && (
          <Alert variant="destructive">
            <InfoIcon />
            <AlertTitle>{t('public.Alerts.GuestDataIncomplete.Title')}</AlertTitle>
            <AlertDescription>
              {t('public.Alerts.GuestDataIncomplete.Content')}
            </AlertDescription>
            <AlertAction>
              <Button size="xs" variant="default" onClick={() => navigate('/new-booking/guests')}>
                {t('public.Alerts.GuestDataIncomplete.Action')}
              </Button>
            </AlertAction>
          </Alert>
        )}

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

        {hasPriceChanged && (
          <Alert className="border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-50">
            <InfoIcon />
            <AlertTitle>{t('public.Alerts.PricesChanged.Title')}</AlertTitle>
            <AlertDescription>
              {t('public.Alerts.PricesChanged.Content')}
            </AlertDescription>
          </Alert>
        )}

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
            {state.requestedRooms.map((requestedRoom, index) => {
              const room = validRoomHoldings[requestedRoom.id];
              const people = requestedRoom.people;
              return (
                <Fragment key={room ? `${index}-${room.id}` : `${index}-no-room`}>
                  {room
                    ? <>
                      <RoomRow room={room} people={people} />
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
                {format(getTotalPrice(validRoomHoldings, state.requestedRooms, nights))}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
        <div className="flex justify-end items-end mt-4">
          <Button disabled={isCheckOutDisabled} onClick={() => submit()}>
            {t('public.Buttons.Book')}
          </Button>
        </div>
      </section>
    </Page>
  )
}