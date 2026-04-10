import { Bookings } from "@/pages/dashboard/bookings/Bookings"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import {render} from "vitest-browser-react";
import {expect, describe, it, vi} from "vitest";
import {MemoryRouter} from "react-router";
import {MOCK_BOOKINGS} from "@/mocks/mockData";
import { userEvent } from 'vitest/browser'
import {DEFAULT_SEARCH_INPUT_DEBOUNCE_MS} from "@/hooks/useSearchWithQueryParams";

vi.useFakeTimers();

function renderBookings(initialEntries = ['/dashboard/bookings']) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <QueryClientProvider client={queryClient}>
        <Bookings />
      </QueryClientProvider>
    </MemoryRouter>
  )
}

describe('Bookings', () => {
  it('should show bookings table', async () => {
    const { getByText, getByTestId } = await renderBookings();

    await expect.element(getByTestId('bookings-table')).toBeInTheDocument();
    for(const booking of MOCK_BOOKINGS) {
      await expect.element(getByText(`${booking.lastName}, ${booking.firstName}`)).toBeInTheDocument();
      await expect.element(getByText(`${booking.email}`)).toBeInTheDocument();
    }
  });

  it('should search for booking', async () => {
    const SEARCH_TERM = MOCK_BOOKINGS[0].firstName;
    const user = userEvent.setup();
    const { getByText, getByTestId } = await renderBookings();

    const searchInput = getByTestId("bookings-search");
    await user.fill(searchInput, SEARCH_TERM);

    vi.advanceTimersByTime(DEFAULT_SEARCH_INPUT_DEBOUNCE_MS);

    for(const booking of MOCK_BOOKINGS) {
      booking.firstName.includes(SEARCH_TERM)
        ? await expect.element(getByText(`${booking.lastName}, ${booking.firstName}`)).toBeInTheDocument()
        : await expect.element(getByText(`${booking.lastName}, ${booking.firstName}`)).not.toBeInTheDocument();
    }
  })

  it('should filter by date range', async () => {
    const startDate = new Date(2026, 4, 10); // May 10, 2026
    const endDate = new Date(2026, 4, 20);   // May 20, 2026

    const dateRangeParams = new URLSearchParams({
      dateRange: JSON.stringify({
        from: startDate.toISOString(),
        to: endDate.toISOString()
      })
    });

    const { getByText } = await renderBookings([
      `/dashboard/bookings?${dateRangeParams.toString()}`
    ]);

    for(const booking of MOCK_BOOKINGS) {
      const bookingFrom = new Date(booking.from);
      const bookingTo = new Date(booking.to);

      const isInRange = bookingFrom <= endDate && bookingTo >= startDate;

      if (isInRange) {
        await expect.element(getByText(`${booking.lastName}, ${booking.firstName}`)).toBeInTheDocument();
      } else {
        await expect.element(getByText(`${booking.lastName}, ${booking.firstName}`)).not.toBeInTheDocument();
      }
    }
  })

  it('should clear date range filter', async () => {
    const user = userEvent.setup();
    const startDate = new Date(2026, 4, 10); // May 10, 2026
    const endDate = new Date(2026, 4, 20);   // May 20, 2026

    const dateRangeParams = new URLSearchParams({
      dateRange: JSON.stringify({
        from: startDate.toISOString(),
        to: endDate.toISOString()
      })
    });

    const { getByText, getByTestId } = await renderBookings([
      `/dashboard/bookings?${dateRangeParams.toString()}`
    ]);

    for(const booking of MOCK_BOOKINGS) {
      const bookingFrom = new Date(booking.from);
      const bookingTo = new Date(booking.to);

      const isInRange = bookingFrom <= endDate && bookingTo >= startDate;

      if (isInRange) {
        await expect.element(getByText(`${booking.lastName}, ${booking.firstName}`)).toBeInTheDocument();
      } else {
        await expect.element(getByText(`${booking.lastName}, ${booking.firstName}`)).not.toBeInTheDocument();
      }
    }

    const clearDateRangeButton = getByTestId('bookings-clear-date-range');
    await user.click(clearDateRangeButton);

    for(const booking of MOCK_BOOKINGS) {
      await expect.element(getByText(`${booking.lastName}, ${booking.firstName}`)).toBeInTheDocument();
    }
  })
})