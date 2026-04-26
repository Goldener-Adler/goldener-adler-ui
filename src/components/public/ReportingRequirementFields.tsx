import {type FunctionComponent, useEffect} from "react";
import {getNationalities} from "@/utils/getNationalities";
import {Controller, type UseFormReturn, useWatch} from "react-hook-form";
import {Field, FieldError, FieldLabel} from "@/components/ui/field";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {DatePickerBirthdate} from "@/components/ui/date-picker-birthdate";
import { Input } from "@/components/ui/input";
import {Checkbox} from "@/components/ui/checkbox";
import type {BookingForm} from "@/assets/guestTypes";
import {useTranslation} from "react-i18next";
import {getErrorMessage} from "@/utils/guards/translateError";

interface ReportingRequirementFieldsProps {
  prefix:  "reportingRequirement.mainGuest" | `reportingRequirement.additionalGuests.${number}`,
  form: UseFormReturn<BookingForm>
  showFamilyCheckbox?: boolean
  showAllAreFamilyCheckbox?: boolean
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
 * @param showAllAreFamilyCheckbox - Decides whether to render the allArefamilyCheckbox for the main guest
 */
export const ReportingRequirementFields: FunctionComponent<ReportingRequirementFieldsProps> = ({ prefix, form, showFamilyCheckbox = true, showAllAreFamilyCheckbox = false }: ReportingRequirementFieldsProps) => {
  const { t, i18n } = useTranslation();

  const {control, register, formState: {errors}} = form;

  const nationalities = getNationalities(i18n.language);

  const citizenship = useWatch({
    control,
    name: `${prefix}.citizenship`,
  });

  const allGuestsAreFamily = useWatch({
    control,
    name: `reportingRequirement.allGuestsAreFamily`,
  })


  const isMainGuest = prefix === "reportingRequirement.mainGuest";

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
      <FieldLabel>{t('public.Forms.Labels.BirthDate')}*</FieldLabel>
      <Controller
        control={control}
        name={`${prefix}.birthDate`}
        render={({ field }) => (
          <DatePickerBirthdate
            id={`${prefix}.birthDate`}
            value={field.value}
            placeholder={'public.Forms.Placeholders.Select'}
            onChange={field.onChange}
          />
        )}
      />
      <FieldError>{getErrorMessage(`${prefix}.birthDate`, errors)}</FieldError>
    </Field>
  );

  // Render first name and last name fields (for additional guests)
  const nameFields = () => !isMainGuest ? (
    <>
      <Field>
        <FieldLabel htmlFor={`${prefix}.firstName`}>{t('public.Forms.Labels.FirstName')}*</FieldLabel>
        <Input id={`${prefix}.firstName`} {...register(`${prefix}.firstName`)} />
        <FieldError>{getErrorMessage(`${prefix}.firstName`, errors)}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${prefix}.lastName`}>{t('public.Forms.Labels.LastName')}*</FieldLabel>
        <Input id={`${prefix}.lastName`} {...register(`${prefix}.lastName`)} />
        <FieldError>{getErrorMessage(`${prefix}.lastName`, errors)}</FieldError>
      </Field>
    </>
  ) : null;

  // Render address fields
  const addressFields = () => (
    <>
      <Field className="col-span-1 sm:col-span-2">
        <FieldLabel htmlFor={`${prefix}.address.street`}>{t('public.Forms.Labels.Address')}*</FieldLabel>
        <Input id={`${prefix}.address.street`} {...register(`${prefix}.address.street`)} />
        <FieldError>{getErrorMessage(`${prefix}.address.street`, errors)}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${prefix}.address.postalCode`}>{t('public.Forms.Labels.PostalCode')}*</FieldLabel>
        <Input id={`${prefix}.address.postalCode`} {...register(`${prefix}.address.postalCode`)} />
        <FieldError>{getErrorMessage(`${prefix}.address.postalCode`, errors)}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${prefix}.address.city`}>{t('public.Forms.Labels.City')}*</FieldLabel>
        <Input id={`${prefix}.address.city`} {...register(`${prefix}.address.city`)} />
        <FieldError>{getErrorMessage(`${prefix}.address.city`, errors)}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${prefix}.address.country`}>{t('public.Forms.Labels.Country')}*</FieldLabel>
        <Input id={`${prefix}.address.country`} {...register(`${prefix}.address.country`)} />
        <FieldError>{getErrorMessage(`${prefix}.address.country`, errors)}</FieldError>
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
        {t('public.Forms.Labels.IsFamilyMember')}
      </FieldLabel>
      <FieldError>{getErrorMessage(`${prefix}.familyMember`, errors)}</FieldError>
    </Field>
  ) : <span id="no-family-member-checkbox"></span>;

  // Render all are family checkbox (for main guest)
  const allAreFamilyCheckbox = () => showAllAreFamilyCheckbox ? (
    <Field orientation="horizontal" className="col-span-1 sm:col-span-2">
      <Controller
        control={control}
        name="reportingRequirement.allGuestsAreFamily"
        render={({ field }) => (
          <Checkbox
            id="reportingRequirement.allGuestsAreFamily"
            checked={field.value}
            onCheckedChange={(checked) => field.onChange(!!checked)}
          />
        )}
      />
      <FieldLabel htmlFor="reportingRequirement.allGuestsAreFamily">
        {t('public.Forms.Labels.AllAreFamilyMembers')}
      </FieldLabel>
      <FieldError>{getErrorMessage("reportingRequirement.allGuestsAreFamily", errors)}</FieldError>
    </Field>
  ) : null;

  return (
    <>
      <Field>
        <FieldLabel>{t('public.Forms.Labels.Citizenship')}</FieldLabel>
        <Controller
          control={control}
          name={`${prefix}.citizenship`}
          render={({ field }) => (
            <Select value={field.value || ""} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder={t('public.Forms.Placeholders.Select')} />
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
        <FieldError>{getErrorMessage(`${prefix}.citizenship`, errors)}</FieldError>
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