import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {useTranslation} from "react-i18next";
import type {TranslationKey} from "@/assets/i18n/i18n";

interface Props {
  id: string,
  value?: Date
  onChange: (date?: Date) => void
  placeholder?: TranslationKey
}

export function DatePickerBirthdate({ id, value, onChange, placeholder }: Props) {
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();

  return (
  <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        id={id}
        data-testid="date-picker-birthday"
        className="justify-start font-normal"
      >
        {value ? value.toLocaleDateString() : (placeholder ? t(placeholder) : "")}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
      <Calendar
        mode="single"
        selected={value}
        defaultMonth={value}
        captionLayout="dropdown"
        onSelect={(date) => {
          onChange(date)
          setOpen(false)
        }}
      />
    </PopoverContent>
  </Popover>
)}
