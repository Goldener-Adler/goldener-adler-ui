import { Content } from "@/layouts/Content.tsx";
import {type FunctionComponent, useRef} from "react";
import {Calendar} from "@/components/ui/calendar.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Button} from "@/components/ui/button.tsx";
import {getCurrentLocale} from "@/utils/i18n-locale.ts";
import {Trans, useTranslation} from "react-i18next";
import {Page} from "@/layouts/Page.tsx";
import {BOOKING_OPTIONS, EMPTY_STRING} from "@/assets/consts.ts";
import {useBooking} from "@/contexts/BookingContext.tsx";
import {bookingformSchema, type BookingFormValues, initialBookingFormValues} from "@/assets/types.ts";
import {useNavigate} from "react-router";

export const Booking: FunctionComponent = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { bookingFormValues, updateBookingFormValues, resetBookingFormValues } = useBooking();
  
  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingformSchema),
    defaultValues: initialBookingFormValues,
    values: bookingFormValues
  });
  
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});
  
  const onReset = () => {
    const resetValues = {
      ...initialBookingFormValues,
      extras: { ...initialBookingFormValues.extras },
      dateRange: initialBookingFormValues.dateRange ? { ...initialBookingFormValues.dateRange } : undefined,
    };
    
    form.reset(resetValues, { keepDefaultValues: false });
    resetBookingFormValues();
  };
  
  const onError = (errors: typeof form.formState.errors) => {
    const firstErrorKey = Object.keys(errors)[0];
    const firstErrorField = fieldRefs.current[firstErrorKey];
    if (firstErrorField) {
      firstErrorField.scrollIntoView({behavior: "smooth", block: "center"});
      firstErrorField.focus({preventScroll: true});
    }
  }
  
  const onSubmit = (values: BookingFormValues) => {
    updateBookingFormValues(values);
    navigate('/booking/review');
  }
  
  return (
    <Page title={t('public.Booking.Title')}>
      <Content maxWidth="max-w-[33rem]" className="mt-24">
        <h1 className="text-center text-4xl font-semibold">{t('public.Booking.Title')}</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="grid items-start grid-cols-2 gap-x-4 my-6">
            <FormField
              control={form.control}
              name="dateRange"
              render={({ field }) => (
                <FormItem className="col-span-2 justify-self-center">
                  <FormControl>
                    <div ref={(element) => {
                      field.ref(element);
                      fieldRefs.current["dateRange"] = element;
                    }}>
                    <Calendar
                      locale={getCurrentLocale()}
                      mode="range"
                      showOutsideDays={false}
                      numberOfMonths={2}
                      selected={field.value ?? undefined}
                      onSelect={(value) => field.onChange(value ? { ...value } : undefined)}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                    </div>
                  </FormControl>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />
            <h3 className="text-xl font-semibold my-4 col-span-2">{t('public.Booking.Headings.RoomSelection')}</h3>
            {form.formState.errors.rooms?.message && (
              <p className="text-sm text-red-500 mb-4 col-span-2"><Trans i18nKey={form.formState.errors.rooms.message as never}/></p>
            )}
            <FormField
              control={form.control}
              name="rooms.singleBedRooms"
              render={({ field }) => (
                <FormItem className="col-span-2 w-full mb-5">
                  <FormLabel>{t('public.Rooms.General.SingleBedroom', {count: 2})}</FormLabel>
                  <Select onValueChange={(e) => {
                    if (e === EMPTY_STRING) return;
                    field.onChange(e);
                    form.trigger(["rooms"]);
                  }} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full" ref={(element) => {
                        field.ref(element);
                        fieldRefs.current["rooms"] = element;
                      }}>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">{t('public.Booking.Options.NoSelection')}</SelectItem>
                      <SelectItem value="1">1 {t('public.Booking.Options.Rooms', {count: 1})}</SelectItem>
                      <SelectItem value="2">2 {t('public.Booking.Options.Rooms', {count: 2})}</SelectItem>
                      <SelectItem value="3">3 {t('public.Booking.Options.Rooms', {count: 3})}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rooms.doubleBedRooms"
              render={({ field }) => (
                <FormItem className="col-span-2 w-full mb-5">
                  <FormLabel>{t('public.Rooms.General.DoubleBedroom', {count: 2})}</FormLabel>
                  <Select onValueChange={(e) => {
                    if (e === EMPTY_STRING) return;
                    field.onChange(e);
                    form.trigger(["rooms"]);
                  }} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">{t('public.Booking.Options.NoSelection')}</SelectItem>
                      <SelectItem value="1">{`1 ${t('public.Booking.Options.Rooms', {count: 1})} (2 ${t('public.Booking.Options.People', {count: 2})})`}</SelectItem>
                      <SelectItem value="2">{`1 ${t('public.Booking.Options.Rooms', {count: 1})} + ${t('public.Booking.Options.AdditionalBed')}`}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rooms.apartmentGuests"
              render={({ field }) => (
                <FormItem className="col-span-2 w-full mb-5">
                  <FormLabel>{t('public.General.Apartment')}</FormLabel>
                  <Select onValueChange={(e) => {
                    if (e === EMPTY_STRING) return;
                    field.onChange(e);
                    form.trigger(["rooms"]);
                  }} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="0">{t('public.Booking.Options.NoSelection')}</SelectItem>
                      <SelectItem value="1">1 {t('public.Booking.Options.People', {count: 1})}</SelectItem>
                      <SelectItem value="2">2 {t('public.Booking.Options.People', {count: 2})}</SelectItem>
                      <SelectItem value="3">3 {t('public.Booking.Options.People', {count: 3})}</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <h3 className="text-xl font-semibold mb-4">{t('public.Booking.Headings.AdditionalDetails')}</h3>
            <FormField
              control={form.control}
              name="extras"
              render={({ field }) => (
                <>
                  {BOOKING_OPTIONS.map((option) => (
                    <FormItem key={option.id} className="col-span-2 flex items-center gap-3 my-1">
                      <FormControl>
                        <Checkbox
                          checked={field.value[option.id] ?? false}
                          onCheckedChange={(checked) =>
                            field.onChange({ ...field.value, [option.id]: checked }) // new object
                          }
                        />
                      
                      </FormControl>
                      <FormLabel className="text-sm font-normal">{t(option.label)}</FormLabel>
                    </FormItem>
                  ))}
                </>
              )}
            />
            <h3 className="col-span-2 text-xl font-semibold mt-8 mb-4">{t('public.Booking.Headings.GuestDetails')}</h3>
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem className="col-span-2 sm:col-span-1 mb-5">
                  <FormLabel>{t('public.Forms.Labels.FirstName')}*</FormLabel>
                  <FormControl>
                    <Input placeholder={t('public.Forms.Placeholders.FirstName')} {...field} ref={(element) => {
                      field.ref(element);
                      fieldRefs.current["firstName"] = element;
                    }} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem className="col-span-2 sm:col-span-1 mb-5">
                  <FormLabel>{t('public.Forms.Labels.LastName')}*</FormLabel>
                  <FormControl>
                    <Input placeholder={t('public.Forms.Placeholders.LastName')} {...field} ref={(element) => {
                      field.ref(element);
                      fieldRefs.current["lastName"] = element;
                    }}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="col-span-2 mb-5">
                  <FormLabel>{t('public.Forms.Labels.Email')}*</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder={t('public.Forms.Placeholders.Email')} {...field} ref={(element) => {
                      field.ref(element);
                      fieldRefs.current["email"] = element;
                    }}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="col-span-2 mb-5">
                  <FormLabel>{`${t('public.Forms.Labels.Phone')} (${t('public.Forms.Labels.Optional')})`}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('public.Forms.Placeholders.Phone')} {...field} ref={(element) => {
                      field.ref(element);
                      fieldRefs.current["phone"] = element;
                    }}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="col-span-2 mb-5">
                  <FormLabel>{`${t('public.Forms.Labels.Message')} (${t('public.Forms.Labels.Optional')})`}</FormLabel>
                  <FormControl>
                    <Textarea className="h-32" placeholder={t('public.Forms.Placeholders.Message')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2 col-span-2 justify-end">
              <Button type="reset" onClick={onReset} variant="outline">{t('public.Buttons.Clear')}</Button>
              <Button type="submit">{t('public.Buttons.Review')}</Button>
            </div>
          </form>
        </Form>
      </Content>
    </Page>
  )
}
