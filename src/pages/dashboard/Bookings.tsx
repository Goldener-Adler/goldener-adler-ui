import {type FunctionComponent} from "react";
import {Page} from "@/components/layouts/Page.tsx";
import {getBookingsQueryKey, useGetBookings} from "@/hooks/useGetBookings.ts";
import {DataTable} from "@/components/ui/data-table.tsx";
import {bookingColumns} from "@/components/dashboard/bookings/columns.tsx";
import {ButtonGroup} from "@/components/ui/button-group.tsx";
import {Button} from "@/components/ui/button.tsx";
import {RefreshCw, SearchIcon, X} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {useSearchWithQueryParams} from "@/hooks/useSearchWithQueryParams.ts";
import {DateRangePicker} from "@/components/ui/date-range-picker.tsx";
import {type DateRange} from "react-day-picker";
import {useStateWithQueryParams} from "@/hooks/useStateWithQueryParams.ts";
import {isDateRangeState} from "@/helpers/guards/isDateRangeState.ts";
import {useQueryClient} from "@tanstack/react-query";

export const Bookings: FunctionComponent = () => {
  const [date, setDate] = useStateWithQueryParams<DateRange | undefined>(undefined, 'dateRange', isDateRangeState);
  const { searchParameter, searchInputValue, setSearchInputValue } = useSearchWithQueryParams();

  const getBookingsResult = useGetBookings(searchParameter, date);
  const queryClient = useQueryClient();

  return (
    <Page>
      <div className="flex flex-1 flex-col gap-2 p-4 pt-0">
        <h1>Buchungen</h1>
        <div className="flex gap-2 justify-between">
          <ButtonGroup>
            <ButtonGroup className="hidden sm:flex">
              <Button variant="outline" size="icon" aria-label="Refresh" onClick={() => queryClient.invalidateQueries({
                queryKey: getBookingsQueryKey(searchParameter, date)
              })}>
                <RefreshCw/>
              </Button>
            </ButtonGroup>
            <ButtonGroup>
              <DateRangePicker value={date} onChange={setDate} placeholder={`Check-In - Check-Out`} />
              <Button variant="outline" size="icon" disabled={date === undefined} aria-label="Remove Date" onClick={() => setDate(undefined)}>
                <X/>
              </Button>
            </ButtonGroup>
          </ButtonGroup>
          <ButtonGroup>
            <Input
              value={searchInputValue}
              onChange={(event) => setSearchInputValue(event.target.value)}
              placeholder="Suche..."
            />
            <Button variant="outline" aria-label="Search">
              <SearchIcon />
            </Button>
          </ButtonGroup>
        </div>
        <DataTable columns={bookingColumns} data={getBookingsResult.isSuccess ? getBookingsResult.data : []} />
        {getBookingsResult.isPending && <div>loading</div>}
      </div>
    </Page>
  )
}