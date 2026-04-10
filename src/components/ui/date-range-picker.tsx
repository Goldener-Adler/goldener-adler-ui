import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { type DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type DateRangePickerProps = {
  value?: DateRange,
  onChange: (value: DateRange | undefined) => void,
  placeholder?: string
}

export function DateRangePicker({value, onChange, placeholder, ...props}: DateRangePickerProps) {
  const date = value;

  const handleChange = (newDate: DateRange | undefined) => {
    onChange(newDate);
  }

  return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date-picker-range"
            className="justify-start px-2.5 font-normal"
            {...props}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd LLL y")} -{" "}
                  {format(date.to, "dd LLL y")}
                </>
              ) : (
                format(date.from, "dd LLL y")
              )
            ) : (
              <span>{placeholder ?? "Enter Date"}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
  )
}
