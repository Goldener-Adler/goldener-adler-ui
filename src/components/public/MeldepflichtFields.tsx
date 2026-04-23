import {type FunctionComponent, useEffect} from "react";
import {getNationalities} from "@/utils/getNationalities";
import {Controller, type UseFormReturn, useWatch} from "react-hook-form";
import {Field, FieldError, FieldLabel} from "@/components/ui/field";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {DatePickerBirthdate} from "@/components/ui/date-picker-birthdate";
import { Input } from "@/components/ui/input";
import {Checkbox} from "@/components/ui/checkbox";
import type {BookingForm} from "@/assets/guestTypes";

interface MeldepflichtFieldsProps {
  prefix:  "meldepflicht.mainGuest" | `meldepflicht.additionalGuests.${number}`,
  form: UseFormReturn<BookingForm>
  showFamilyCheckbox?: boolean
}

/**
 * Fields to be used in a BookingForm
 *
 * Depending on the form state within the component and the prefix it renders differently:
 * Case 1: Main Guest & Not a Foreigner
 *  -> Shows Citizenship Select and if there are additional guests, shows allAreFamily Checkbox
 * Case 2: Main Guest & Foreigner
 *  -> Shows Citizenship Select, Birthdate Picker and Address Fields
 * Case 3: Additional Guest & Not a Foreigner
 *  -> Shows only Citizenship Select
 * Case 4: Additional Guest & Foreigner
 *  -> Shows Citizenship Select, Birthdate Picker, Name and Address Fields
 * Case 5: Additional Guest, Foreigner & Family Member
 *  -> Shows Citizenship Select and Birthdate Picker
 *
 * @param prefix - The schema prefix, either for the main guest or for any additional guest
 * @param form - The forwarded form object created with react-hook-form based on the BookingForm zod schema
 * @param showFamilyCheckbox - Decides whether to render the familyMemberCheckbox for additional guests
 *
 */
export const MeldepflichtFields: FunctionComponent<MeldepflichtFieldsProps> = ({ prefix, form, showFamilyCheckbox = true }: MeldepflichtFieldsProps) => {
  const {control, register, formState: {errors}} = form;

  const getErrorMessage = (fieldPath: string): string | undefined => {
    const pathParts = fieldPath.split('.');
    let current: any = errors;

    for (const part of pathParts) {
      current = current?.[part];
    }

    return current?.message;
  };

  const nationalities = getNationalities("de");

  const citizenship = useWatch({
    control,
    name: `${prefix}.citizenship`,
  });

  const allGuestsAreFamily = useWatch({
    control,
    name: `meldepflicht.allGuestsAreFamily`,
  })


  const isMainGuest = prefix === "meldepflicht.mainGuest";

  const isForeign = citizenship ? citizenship !== "de" : false;

  let familyMember: boolean | undefined = false;
  if (!isMainGuest) {
    familyMember = useWatch({
      control,
      name: `${prefix}.familyMember`,
    }) as boolean | undefined
  }

  const isFamilyMember = showFamilyCheckbox && !isMainGuest && (familyMember === true || allGuestsAreFamily === true);

  // sync checkboxes with main total family checkbox
  useEffect(() => {
    if(!isMainGuest) {
      form.setValue(`${prefix}.familyMember`, allGuestsAreFamily);
    }
  }, [allGuestsAreFamily]);

  // keep values unset when guest is a family member
  useEffect(() => {
    if(isFamilyMember && !isMainGuest) {
      form.setValue(`${prefix}.firstName`, "");
      form.setValue(`${prefix}.lastName`, "");
      form.setValue(`${prefix}.address`, undefined);
    }
  }, [isFamilyMember, citizenship]);

  // unset values for non foreigners
  useEffect(() => {
    if(!isForeign) {
      form.setValue(`${prefix}.birthDate`, undefined);
      form.setValue(`${prefix}.address`, undefined);
      if(!isMainGuest) {
        form.setValue(`${prefix}.firstName`, undefined);
        form.setValue(`${prefix}.lastName`, undefined);
      }
    }
  }, [isForeign]);

  // Render birthdate field
  const birthdate = () => (
    <Field>
      <FieldLabel>Geburtsdatum</FieldLabel>
      <Controller
        control={control}
        name={`${prefix}.birthDate`}
        render={({ field }) => (
          <DatePickerBirthdate
            id={`${prefix}.birthDate`}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      <FieldError>{getErrorMessage(`${prefix}.birthDate`)}</FieldError>
    </Field>
  );

  // Render first name and last name fields (for additional guests)
  const nameFields = () => !isMainGuest ? (
    <>
      <Field>
        <FieldLabel htmlFor={`${prefix}.firstName`}>Vorname</FieldLabel>
        <Input id={`${prefix}.firstName`} {...register(`${prefix}.firstName`)} />
        <FieldError>{getErrorMessage(`${prefix}.firstName`)}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${prefix}.lastName`}>Nachname</FieldLabel>
        <Input id={`${prefix}.lastName`} {...register(`${prefix}.lastName`)} />
        <FieldError>{getErrorMessage(`${prefix}.lastName`)}</FieldError>
      </Field>
    </>
  ) : null;

  // Render address fields
  const addressFields = () => (
    <>
      <Field className="col-span-1 sm:col-span-2">
        <FieldLabel htmlFor={`${prefix}.address.street`}>Addresse</FieldLabel>
        <Input id={`${prefix}.address.street`} {...register(`${prefix}.address.street`)} />
        <FieldError>{getErrorMessage(`${prefix}.address.street`)}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${prefix}.address.postalCode`}>PLZ</FieldLabel>
        <Input id={`${prefix}.address.postalCode`} {...register(`${prefix}.address.postalCode`)} />
        <FieldError>{getErrorMessage(`${prefix}.address.postalCode`)}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${prefix}.address.city`}>Stadt</FieldLabel>
        <Input id={`${prefix}.address.city`} {...register(`${prefix}.address.city`)} />
        <FieldError>{getErrorMessage(`${prefix}.address.city`)}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${prefix}.address.country`}>Land</FieldLabel>
        <Input id={`${prefix}.address.country`} {...register(`${prefix}.address.country`)} />
        <FieldError>{getErrorMessage(`${prefix}.address.country`)}</FieldError>
      </Field>
    </>
  );

  // Render family member checkbox (for additional guests)
  const familyMemberCheckbox = () => !isMainGuest && showFamilyCheckbox ? (
    <Field orientation="horizontal" className="self-end">
      <Controller
        control={control}
        name={`${prefix}.familyMember`}
        render={({ field }) => (
          <Checkbox
            id={`${prefix}.familyMember`}
            checked={field.value}
            onCheckedChange={(checked) => field.onChange(!!checked)}
            disabled={allGuestsAreFamily}
          />
        )}
      />
      <FieldLabel htmlFor={`${prefix}.familyMember`}>
        Mitreisende Person ist ein*e Ehegatt*in, Lebenspartner*in oder ein minderjähriges Kind
      </FieldLabel>
      <FieldError>{getErrorMessage(`${prefix}.familyMember`)}</FieldError>
    </Field>
  ) : <span id="no-family-member-checkbox"></span>;

  // Render all are family checkbox (for main guest)
  const allAreFamilyCheckbox = () => (
    <Field orientation="horizontal" className="col-span-1 sm:col-span-2">
      <Controller
        control={control}
        name="meldepflicht.allGuestsAreFamily"
        render={({ field }) => (
          <Checkbox
            id="meldepflicht.allGuestsAreFamily"
            checked={field.value}
            onCheckedChange={(checked) => field.onChange(!!checked)}
          />
        )}
      />
      <FieldLabel htmlFor="meldepflicht.allGuestsAreFamily">
        Mitreisenden sind ausschließlich Ehegatt*in, Lebenspartner*in oder minderjährige Kinder
      </FieldLabel>
      <FieldError>{getErrorMessage("meldepflicht.allGuestsAreFamily")}</FieldError>
    </Field>
  );

  return (
    <>
      <Field>
        <FieldLabel>Staatsbürgerschaft</FieldLabel>
        <Controller
          control={control}
          name={`${prefix}.citizenship`}
          render={({ field }) => (
            <Select value={field.value || ""} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Auswählen" />
              </SelectTrigger>
              <SelectContent>
                {nationalities.map((n) => (
                  <SelectItem key={n.value} value={n.value}>
                    {n.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError>{getErrorMessage(`${prefix}.citizenship`)}</FieldError>
      </Field>

      {isForeign && (
        <>
          {familyMemberCheckbox()}
          {!isFamilyMember && (
            <>
              {nameFields()}
              {addressFields()}
            </>
          )}
          {birthdate()}
          {isMainGuest && allAreFamilyCheckbox()}
        </>
      )}
    </>
  )
}