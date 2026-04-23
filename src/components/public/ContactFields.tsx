import {Field, FieldError, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import type {UseFormReturn} from "react-hook-form";
import type {BookingForm} from "@/assets/guestTypes";
import type {FunctionComponent} from "react";

interface ContactFieldsProps {
  prefix: "contact" | "mainGuestContact",
  form: UseFormReturn<BookingForm>
}

export const ContactFields: FunctionComponent<ContactFieldsProps> = ({ prefix, form }: ContactFieldsProps) => {
  const {register, formState: { errors }} = form;

  const getErrorMessage = (fieldPath: string): string | undefined => {
    const pathParts = fieldPath.split('.');
    let current: any = errors;

    for (const part of pathParts) {
      current = current?.[part];
    }

    return current?.message;
  };


  return (
    <>
      <Field>
        <FieldLabel htmlFor={`${prefix}.firstName`}>
          Vorname
        </FieldLabel>
        <Input
          {...register(`${prefix}.firstName`)}
          id={`${prefix}.firstName`}
          placeholder="First Name"
        />
        <FieldError>{getErrorMessage(`${prefix}.firstName`)}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${prefix}.lastName`}>
          Nachname
        </FieldLabel>
        <Input
          {...register(`${prefix}.lastName`)}
          id={`${prefix}.lastName`}
          placeholder="Last Name"
        />
        <FieldError>{getErrorMessage(`${prefix}.lastName`)}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${prefix}.email`}>
          Email
        </FieldLabel>
        <Input
          {...register(`${prefix}.email`)}
          id={`${prefix}.email`}
          placeholder="Email"
        />
        <FieldError>{getErrorMessage(`${prefix}.email`)}</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor={`${prefix}.phone`}>
          Phone
        </FieldLabel>
        <Input
          {...register(`${prefix}.phone`)}
          id={`${prefix}.phone`}
          placeholder="Phone"
        />
      </Field>
    </>
  )
}