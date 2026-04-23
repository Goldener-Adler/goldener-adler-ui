import {type FunctionComponent, useEffect} from "react";
import {Page} from "@/layouts/Page";
import {Controller, useFieldArray, useForm, useWatch} from "react-hook-form";
import {type BookingForm, bookingSchema} from "@/assets/guestTypes";
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
import {Button} from "@/components/ui/button";
import {useNewBooking} from "@/contexts/NewBookingContext";
import {MeldepflichtFields} from "@/components/public/MeldepflichtFields";
import {ContactFields} from "@/components/public/ContactFields";
import {ExternalLink} from "lucide-react";
import {Link} from "react-router";
import {Separator} from "@/components/ui/separator";

export const GuestInformation: FunctionComponent = () => {
  const { state } = useNewBooking();

  const totalGuests = state.requestedRooms.reduce((sum, room) => sum + room.people, 0);
  const additionalGuestCount = Math.max(0, totalGuests - 1); // Exclude main guest

  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      contact: {},
      differentGuest: false,
      fillAtCheckIn: false,
      meldepflicht: {
        mainGuest: {},
        allGuestsAreFamily: false,
        additionalGuests: Array(additionalGuestCount).fill(null).map(() => ({
          firstName: '',
          lastName: '',
          citizenship: '',
          familyMember: false,
        }))
      }
    },
  });

  const { control, watch } = form;

  const { fields } = useFieldArray({
    control,
    name: "meldepflicht.additionalGuests",
  })

  const differentGuest = watch("differentGuest");

  const skipMeldepflicht = useWatch({control, name: 'fillAtCheckIn'});

  const mainGuestCitizenship = useWatch({control, name: 'meldepflicht.mainGuest.citizenship'})

  useEffect(() => {
    if(skipMeldepflicht) {
      form.setValue('meldepflicht', null);
    }
  }, [skipMeldepflicht, differentGuest]);

  useEffect(() => {
    if (!differentGuest) {
      form.setValue('mainGuestContact', undefined);
    }
  }, [differentGuest]);

  const onSubmit = (data: BookingForm) => {
    console.log("submitted", data);
  }

  return (
    <Page>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8 px-5 my-2 mx-auto max-w-3xl">
        <FieldSet>
          <FieldLegend>
            <FieldTitle className="text-2xl">Kontaktdaten</FieldTitle>
            <FieldDescription>Die folgenden Daten erhalten die Buchungsbestätigung und werden ggf. zur Kontaktaufnahme verwendet.</FieldDescription>
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
                Für eine andere Person buchen
              </FieldLabel>
            </Field>
            <ContactFields prefix="contact" form={form}/>
            {differentGuest && (
              <>
                <h3 className="col-span-1 sm:col-span-2">Hauptgast</h3>
                <ContactFields prefix="mainGuestContact" form={form} />
              </>
            )}
          </FieldGroup>
        </FieldSet>
        <Separator />
        <FieldSet>
          <FieldLegend>
            <FieldTitle className="text-2xl">Meldepflicht</FieldTitle>
            <FieldDescription>Gemäß <Link className="inline-flex flex-nowrap w-fit gap-1 items-center" to="https://www.gesetze-im-internet.de/bmg/__29.html" target="_blank">§ 29 und § 30 BMG <ExternalLink size="16px" /></Link> benötigen wir von Gästen mit nicht-deutscher Staatsbürgerschaft weitere Informationen. Alternativ können Sie diese Informationen auch bei der Ankunft ausfüllen.</FieldDescription>
          </FieldLegend>
          <FieldGroup className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                Meldepflichtige Daten bei Ankunft ausfüllen
              </FieldLabel>
            </Field>
            {!skipMeldepflicht &&
              <>
                <MeldepflichtFields prefix="meldepflicht.mainGuest" form={form}/>
              </>
            }
          </FieldGroup>
        </FieldSet>
        {!skipMeldepflicht && fields.map((field, index) => (
          <div key={field.id}>
            <Separator />
            <FieldSet className="mt-8">
              <FieldLegend>
                <FieldTitle className="text-2xl">Gast {index + 2}</FieldTitle>
              </FieldLegend>
            <FieldGroup className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <MeldepflichtFields
                prefix={`meldepflicht.additionalGuests.${index}`}
                form={form}
                showFamilyCheckbox={mainGuestCitizenship !== 'de'}
              />
            </FieldGroup>
            </FieldSet>
          </div>
        ))}
        <div className="my-4 flex justify-end">
          <Button type="submit">
            Überprüfen
          </Button>
        </div>
      </form>
    </Page>
  )
}