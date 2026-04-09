import {type DateRange, isDateRange} from "react-day-picker";

export const isDateRangeState = (
  dateRange: unknown
): dateRange is DateRange => {
  return (
    isDateRange(dateRange) || dateRange === undefined
  )
}