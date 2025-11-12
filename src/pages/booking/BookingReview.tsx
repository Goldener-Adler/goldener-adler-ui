import {type FunctionComponent, useEffect} from "react";
import {Page} from "@/components/layouts/Page.tsx";
import {useTranslation} from "react-i18next";
import {Content} from "@/components/Content.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ChevronLeft} from "lucide-react";
import {useNavigate} from "react-router";
import {useBooking} from "@/pages/booking/BookingContext.tsx";
import {FormValueItem} from "@/components/FormValueItem.tsx";
import type {TranslationKeys} from "@/i18n.ts";
import {Separator} from "@/components/ui/separator.tsx";
import { LuBedSingle, LuBedDouble, LuCookingPot } from 'react-icons/lu';
import {isValidBookingForm} from "@/helpers/isValidBookingForm.ts";
import Altcha from "@/components/Altcha.tsx";
import {useSendBookingRequest} from "@/hooks/useSendBookingRequest.ts";

export const BookingReview: FunctionComponent = () => {
  const {t} = useTranslation();
  const {bookingFormValues, cancelBooking} = useBooking();
  const {sendBookingRequest, loading, setLoading} = useSendBookingRequest();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isValidBookingForm(bookingFormValues)) {
      navigate("/booking", {replace: true});
    }
  }, []);
  
  const getSelectedOption = (roomType: "singleBedrooms" | "doubleBedrooms" | "apartmentGuests", value: string): TranslationKeys => {
    switch (roomType) {
      case "singleBedrooms": {
        switch (value) {
          case "1": return `public.Booking.Options.SingleBedroom.1`;
          case "2": return `public.Booking.Options.SingleBedroom.2`;
          case "3": return `public.Booking.Options.SingleBedroom.3`;
          default: return `public.Booking.Options.NoSelection`;
        }
      }
      case "doubleBedrooms": {
        switch (value) {
          case "1": return `public.Booking.Options.DoubleBedroom.1`;
          case "2": return `public.Booking.Options.DoubleBedroom.2`;
          default: return `public.Booking.Options.NoSelection`;
        }
      }
      case "apartmentGuests": {
        switch (value) {
          case "1": return `public.Booking.Options.ApartmentGuests.1`;
          case "2": return `public.Booking.Options.ApartmentGuests.2`;
          case "3": return `public.Booking.Options.ApartmentGuests.3`;
          default: return `public.Booking.Options.NoSelection`;
        }
      }
      // Will never happen;
      default: return `public.Booking.Options.NoSelection`;
    }
  }
  
  if(!isValidBookingForm(bookingFormValues)) {
    return;
  }
  
  return (
    <Page title={t('public.Review.Title')}>
      <Content maxWidth="max-w-3xl" className="mt-24 mb-6">
        <Button onClick={() => navigate('/booking', {replace: true})} className="mb-3" variant="ghost"><ChevronLeft/>{t('public.Buttons.Edit')}</Button>
        <h1 className="text-4xl font-semibold">{t('public.Review.Title')}</h1>
        <div className="grid grid-cols-2 gap-5 my-5">
          <div className="col-span-2">
            <div className="flex flex-wrap gap-5">
              {bookingFormValues.rooms.singleBedRooms !== "0" && (
                <FormValueItem
                  label={t('public.Rooms.General.SingleBedroom', {count: 2})}
                  value={t(getSelectedOption("singleBedrooms", bookingFormValues.rooms.singleBedRooms))}
                  icon={LuBedSingle}
                  slot="start"
                  className="p-4 rounded-md shadow"
                />
              )}
              {bookingFormValues.rooms.doubleBedRooms !== "0" && (
                <FormValueItem
                  label={t('public.Rooms.General.DoubleBedroom', {count: 2})}
                  value={t(getSelectedOption("doubleBedrooms", bookingFormValues.rooms.doubleBedRooms))}
                  icon={LuBedDouble}
                  slot="start"
                  className="p-4 rounded-md shadow"
                />
              )}
              {bookingFormValues.rooms.apartmentGuests !== "0" && (
                <FormValueItem
                  label={t('public.General.Apartment', {count: 2})}
                  value={t(getSelectedOption("apartmentGuests", bookingFormValues.rooms.apartmentGuests))}
                  icon={LuCookingPot}
                  slot="start"
                  className="p-4 rounded-md shadow"
                />
              )}
            </div>
          </div>
          {bookingFormValues.dateRange && (
            <>
              <FormValueItem
                label={t('public.Forms.Labels.CheckIn')}
                value={bookingFormValues.dateRange.from.toLocaleDateString()}
                className="col-span-1"
              />
              <FormValueItem
                label={t('public.Forms.Labels.CheckOut')}
                value={bookingFormValues.dateRange.to?.toLocaleDateString()}
                className="col-span-1"
              />
            </>
          )}
          <FormValueItem
            label={t('public.Forms.Labels.FirstName')}
            value={bookingFormValues.firstName}
            className="col-span-1"
          />
          <FormValueItem
            label={t('public.Forms.Labels.LastName')}
            value={bookingFormValues.lastName}
            className="col-span-1"
          />
          <FormValueItem
            label={t('public.Forms.Labels.Email')}
            value={bookingFormValues.email}
            className="col-span-1"
          />
          {bookingFormValues.phone && (
            <FormValueItem
              label={t('public.Forms.Labels.Phone')}
              value={bookingFormValues.phone}
              className="col-span-1"
           />
          )}
          {bookingFormValues.message && (
            <FormValueItem
              label={t('public.Forms.Labels.Message')}
              value={bookingFormValues.message}
              className="col-span-2"
            />
          )}
        </div>
        <Separator />
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <div className="flex justify-end gap-2 py-5">
            <Button disabled={loading} onClick={cancelBooking} variant="destructive-outline">{t('public.Buttons.Cancel')}</Button>
            <Button type="submit" id="submit-button" disabled={loading}>{t('public.Buttons.Book')}</Button>
          </div>
          <Altcha
            onVerifying={() => setLoading(true)}
            onVerified={(payload) => sendBookingRequest(bookingFormValues, payload)}
            onError={() => setLoading(false)}
          />
        </form>
      </Content>
    </Page>
  )
}
