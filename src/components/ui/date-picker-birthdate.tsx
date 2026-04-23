import * as React from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Props {
  id: string,
  value?: Date
  onChange: (date?: Date) => void
}

export function DatePickerBirthdate({ id, value, onChange }: Props) {
  const [open, setOpen] = React.useState(false)

  return (
  <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
      <Button
        variant="outline"
        id={id}
        data-testid="date-picker-birthday"
        className="justify-start font-normal"
      >
        {value ? value.toLocaleDateString() : "Select date"}
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
