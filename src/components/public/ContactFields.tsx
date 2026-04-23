import {Field, FieldError, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import type {UseFormReturn} from "react-hook-form";
import type {BookingForm} from "@/assets/guestTypes";
import type {FunctionComponent} from "react";
import {useTranslation} from "react-i18next";
import {getErrorMessage} from "@/utils/guards/translateError";
import {Textarea} from "@/components/ui/textarea";

interface ContactFieldsProps {
  prefix: "contact" | "mainGuestContact",
  form: UseFormReturn<BookingForm>
}

export const ContactFields: FunctionComponent<ContactFieldsProps> = ({ prefix, form }: ContactFieldsProps) => {
  const { t } = useTranslation();

  const {register, formState: { errors }} = form;

  const isContact = prefix === "contact";

  return (
    <>
      <Field>
        <FieldLabel htmlFor={`${prefix}.firstName`}>
          {t('public.Forms.Labels.FirstName')}*
        </FieldLabel>
        <Input
          {...register(`${prefix}.firstName`)}
          id={`${prefix}.firstName`}
        />
        <FieldError>{getErrorMessage(`${prefix}.firstName`, errors)}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${prefix}.lastName`}>
          {t('public.Forms.Labels.LastName')}*
        </FieldLabel>
        <Input
          {...register(`${prefix}.lastName`)}
          id={`${prefix}.lastName`}
        />
        <FieldError>{getErrorMessage(`${prefix}.lastName`, errors)}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${prefix}.email`}>
          {t('public.Forms.Labels.Email')}*
        </FieldLabel>
        <Input
          {...register(`${prefix}.email`)}
          id={`${prefix}.email`}
        />
        <FieldError>{getErrorMessage(`${prefix}.email`, errors)}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${prefix}.phone`}>
          {t('public.Forms.Labels.Phone')}
        </FieldLabel>
        <Input
          {...register(`${prefix}.phone`)}
          id={`${prefix}.phone`}
        />
        <FieldError>{getErrorMessage(`${prefix}.phone`, errors)}</FieldError>
      </Field>
      {isContact && (
        <Field className="col-span-1 sm:col-span-2">
          <FieldLabel htmlFor={`${prefix}.message`}>
            {t('public.Forms.Labels.Message')}
          </FieldLabel>
          <Textarea
            className="min-h-24"
            {...register(`${prefix}.message`)}
            id={`${prefix}.message`}
          />
          <FieldError>{getErrorMessage(`${prefix}.message`, errors)}</FieldError>
        </Field>
      )}
    </>
  )
}