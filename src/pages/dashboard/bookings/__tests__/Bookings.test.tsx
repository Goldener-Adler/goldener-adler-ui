import { Bookings } from "@/pages/dashboard/bookings/Bookings"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router"
import {render} from "vitest-browser-react";
import { test, expect } from "vitest";
import { page } from 'vitest/browser'

function renderBookings() {
  const queryClient = new QueryClient()

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Bookings />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

test("renders bookings table", async () => {
  await renderBookings()

  // waits for async data
  await expect(page.getByText('Buchungen')).toBeVisible();
})