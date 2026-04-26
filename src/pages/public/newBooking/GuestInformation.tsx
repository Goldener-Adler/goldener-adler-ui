import {type FunctionComponent, useEffect, useRef} from "react";
import {Page} from "@/layouts/Page";
import {Controller, useFieldArray, useForm, useWatch} from "react-hook-form";
import {type BookingForm, bookingSchema, getInitialBookingFormValues} from "@/assets/guestTypes";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle
} from "@/components/ui/field";
import {Checkbox} from "@/components/ui/checkbox";
import {useNewBooking} from "@/contexts/NewBookingContext";
import {ReportingRequirementFields} from "@/components/public/ReportingRequirementFields";
import {ContactFields} from "@/components/public/ContactFields";
import {ExternalLink} from "lucide-react";
import {Link, useNavigate} from "react-router";
import {Separator} from "@/components/ui/separator";
import {Trans, useTranslation} from "react-i18next";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {DEFAULT_INPUT_DEBOUNCE_MS} from "@/assets/consts";
import {Button} from "@/components/ui/button";

export const GuestInformation: FunctionComponent = () => {
  const { t } = useTranslation();
  const { state, dispatch } = useNewBooking();
  const navigate = useNavigate();

  const totalGuests = state.requestedRooms.reduce((sum, room) => sum + room.people, 0);
  const additionalGuestCount = Math.max(0, totalGuests - 1); // Exclude main guest

  if (state.status === "uninitialized") return;

  const getFormDefaults = () => {
    const defaults = state.guestFormValues;

    if (!defaults.reportingRequirement && additionalGuestCount > 0) {
      defaults.reportingRequirement = getInitialBookingFormValues(additionalGuestCount).reportingRequirement;
    }

    return defaults;
  };

  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: getFormDefaults(),
  });

  const { control, watch } = form;

  const { fields } = useFieldArray({
    control,
    name: "reportingRequirement.additionalGuests",
  });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const subscription = watch((values) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        dispatch({
          type: "UPDATE_BOOKING_FORM_VALUES",
          guestFormValues: values as BookingForm,
          isValid: form.formState.isValid
        });
      }, DEFAULT_INPUT_DEBOUNCE_MS);
    });

    return () => {
      subscription.unsubscribe();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [watch, form.formState.isValid]);

  const differentGuest = watch("differentGuest");

  const skipReportingRequirement = useWatch({control, name: 'fillAtCheckIn'});

  const mainGuestCitizenship = useWatch({control, name: 'reportingRequirement.mainGuest.citizenship'})

  useEffect(() => {
    if(skipReportingRequirement) {
      form.setValue('reportingRequirement', undefined);
    }
  }, [skipReportingRequirement, differentGuest]);

  useEffect(() => {
    if (!differentGuest) {
      form.setValue('mainGuestContact', undefined);
    }
  }, [differentGuest]);

  const onSubmit = (data: BookingForm) => {
    dispatch({
      type: "UPDATE_BOOKING_FORM_VALUES",
      guestFormValues: data,
      isValid: form.formState.isValid
    });
    navigate('/new-booking/check-out');
  }

  return (
    <Page>
      <form id="guest-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8 px-5 mt-2 mb-24 mx-auto max-w-3xl">
        <FieldSet>
          <FieldLegend>
            <FieldTitle className="text-2xl">{t('public.GuestInfo.Contact')}</FieldTitle>
            <FieldDescription>{t('public.GuestInfo.ContactDescription')}</FieldDescription>
          </FieldLegend>
          <FieldGroup className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field orientation="horizontal" className="col-span-1 sm:col-span-2">
              <Controller
                control={control}
                name="differentGuest"
                render={({ field }) => (
                  <Checkbox
                    id="differentGuest"
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(!!checked)}
                  />
                )}
              />
              <FieldLabel htmlFor="differentGuest">
                {t('public.Forms.Labels.DifferentPerson')}
              </FieldLabel>
            </Field>
            <ContactFields prefix="contact" form={form}/>
            {differentGuest && (
              <>
                <FieldTitle className="mt-4 text-lg col-span-1 sm:col-span-2">{t('public.GuestInfo.MainGuest')}</FieldTitle>
                <ContactFields prefix="mainGuestContact" form={form} />
              </>
            )}
          </FieldGroup>
        </FieldSet>
        <Separator />
        <FieldSet>
          <FieldLegend className="w-full">
            <FieldTitle className="text-2xl">{t('public.GuestInfo.ReportingRequirement')}</FieldTitle>
            <Accordion type="single" collapsible>
              <AccordionItem className="w-full" value="item-1">
                <AccordionTrigger>{t('public.GuestInfo.WhyReportingRequirement')}</AccordionTrigger>
                <AccordionContent>
                  <Trans
                    i18nKey="public.GuestInfo.ReportingRequirementDescription"
                    components={{
                      1: <Link className="inline-flex flex-nowrap w-fit gap-1 items-center"
                        to="https://www.gesetze-im-internet.de/bmg/__29.html"
                        target="_blank"
                      ></Link>,
                      2: <ExternalLink size="16px" />
                    }}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </FieldLegend>
          <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field orientation="horizontal" className="col-span-1 sm:col-span-2">
              <Controller
                control={control}
                name="fillAtCheckIn"
                render={({ field }) => (
                  <Checkbox
                    id="fillAtCheckIn"
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(!!checked)}
                  />
                )}
              />
              <FieldLabel htmlFor="fillAtCheckIn">
                {t('public.Forms.Labels.FillAtCheckIn')}
              </FieldLabel>
            </Field>
            {!skipReportingRequirement &&
              <>
                <ReportingRequirementFields prefix="reportingRequirement.mainGuest" form={form} showAllAreFamilyCheckbox={additionalGuestCount > 0}/>
              </>
            }
          </FieldGroup>
        </FieldSet>
        {!skipReportingRequirement && fields.map((field, index) => (
          <div key={field.id}>
            <Separator />
            <FieldSet className="mt-8">
              <FieldLegend>
                <FieldTitle className="text-lg">{t('public.GuestInfo.Guest_one')} {index + 2}</FieldTitle>
              </FieldLegend>
            <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ReportingRequirementFields
                prefix={`reportingRequirement.additionalGuests.${index}`}
                form={form}
                showFamilyCheckbox={mainGuestCitizenship !== 'de'}
              />
            </FieldGroup>
            </FieldSet>
          </div>
        ))}
        <Separator />
        <div className="flex justify-end">
          <Button type="submit">
            {t('public.Buttons.ToCheckOut')}
          </Button>
        </div>
      </form>
    </Page>
  )
}