import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {render} from "vitest-browser-react";
import {MemoryRouter} from "react-router";
import {describe, it, expect, vi} from "vitest";
import {AppRoutes} from "@/AppRoutes";
import {MOCK_BOOKINGS} from "@/mocks/mockData";
import {userEvent} from "vitest/browser";
import {isBrowser} from "@/test/setup";

const testBooking = MOCK_BOOKINGS[0];

vi.mock('@/hooks/useGetBookingDetails.tsx', () => ({
  useGetBookingDetails: vi.fn(() => ({
    data: testBooking,
    isPending: false,
    isSuccess: true,
    isError: false,
  })),
}));

function renderBookingDetails(initialEntries = [`/dashboard/bookings/${testBooking.id}`]) {
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
        <AppRoutes />
      </QueryClientProvider>
    </MemoryRouter>,
  )
}

describe('BookingDetails', () => {
  it('should show data for selected booking', async () => {
    const {getByText, getByTestId} = await renderBookingDetails();

    await expect.element(getByText(`Buchung ${testBooking.id}`)).toBeInTheDocument();

    await expect.element(getByText(`ID: ${testBooking.id}`)).toBeInTheDocument();

    // Check readonly inputs
    await expect.element(getByTestId('firstName-readonly')).toHaveValue(testBooking.firstName);
    await expect.element(getByTestId('lastName-readonly')).toHaveValue(testBooking.lastName);
    await expect.element(getByTestId('email-readonly')).toHaveValue(testBooking.email);
    await expect.element(getByTestId('tel-readonly')).toHaveValue(testBooking.phone ?? '');

    await expect.element(getByTestId('message-readonly')).toHaveValue(testBooking.message);
    await expect.element(getByTestId('checkIn-readonly')).toHaveValue(testBooking.from.toLocaleDateString());
    await expect.element(getByTestId('checkOut-readonly')).toHaveValue(testBooking.to.toLocaleDateString());

    await expect.element(getByText('Bearbeiten')).toBeInTheDocument();
  });

  it('should toggle edit mode', async () => {
    const user = userEvent.setup();
    const { getByTestId } = await renderBookingDetails();

    const toggleEditButton = getByTestId('toggle-edit-mode');
    await user.click(toggleEditButton);

    await expect.element(toggleEditButton).toHaveTextContent("Speichern");
  })

  it('should show accessible inputs in edit mode', async () => {
    const user = userEvent.setup();
    const { getByTestId } = await renderBookingDetails();

    const toggleEditButton = getByTestId('toggle-edit-mode');
    await user.click(toggleEditButton);

    await expect.element(getByTestId('firstName-readonly')).not.toBeInTheDocument();
    await expect.element(getByTestId('lastName-readonly')).not.toBeInTheDocument();
    await expect.element(getByTestId('email-readonly')).not.toBeInTheDocument();
    await expect.element(getByTestId('tel-readonly')).not.toBeInTheDocument();
    await expect.element(getByTestId('checkIn-readonly')).not.toBeInTheDocument();
    await expect.element(getByTestId('checkOut-readonly')).not.toBeInTheDocument();

    const firstNameInput = getByTestId('firstName');
    await expect.element(firstNameInput).toHaveValue(testBooking.firstName);
    await expect.element(firstNameInput).not.toBeDisabled();

    const lastNameInput = getByTestId('lastName');
    await expect.element(lastNameInput).toHaveValue(testBooking.lastName);
    await expect.element(lastNameInput).not.toBeDisabled();

    const emailInput = getByTestId('email');
    await expect.element(emailInput).toHaveValue(testBooking.email);
    await expect.element(emailInput).not.toBeDisabled();

    const phoneInput = getByTestId('tel');
    await expect.element(phoneInput).toHaveValue(testBooking.phone);
    await expect.element(phoneInput).not.toBeDisabled();

    // TODO: Forward props to DatePicker & add data-testid
    // await expect.element(getByTestId('checkIn')).toHaveValue(testBooking.from.toLocaleDateString());
    // await expect.element(getByTestId('checkOut')).toHaveValue(testBooking.to.toLocaleDateString());
  })

  it('should save changes', async () => {
    const updatedBooking = MOCK_BOOKINGS[2];
    const user = userEvent.setup();
    const { getByTestId } = await renderBookingDetails();

    await expect.element(getByTestId('firstName-readonly')).toHaveValue(testBooking.firstName);

    const toggleEditButton = getByTestId('toggle-edit-mode');
    await user.click(toggleEditButton);

    const firstNameInput = getByTestId('firstName');
    await expect.element(firstNameInput).toHaveValue(testBooking.firstName);
    await user.fill(firstNameInput, updatedBooking.firstName);

    const lastNameInput = getByTestId('lastName');
    await expect.element(lastNameInput).toHaveValue(testBooking.lastName);
    await user.fill(lastNameInput, updatedBooking.lastName);

    const emailInput = getByTestId('email');
    await expect.element(emailInput).toHaveValue(testBooking.email);
    await user.fill(emailInput, updatedBooking.email);

    const phoneInput = getByTestId('tel');
    await expect.element(phoneInput).toHaveValue(testBooking.phone);
    await user.fill(phoneInput, updatedBooking.phone ?? "");

    await user.click(toggleEditButton);
    await expect.element(toggleEditButton).toHaveTextContent("Bearbeiten");

    await expect.element(getByTestId('firstName-readonly')).toHaveValue(testBooking.firstName);
    await expect.element(getByTestId('lastName-readonly')).toHaveValue(testBooking.lastName);
    await expect.element(getByTestId('email-readonly')).toHaveValue(testBooking.email);
    await expect.element(getByTestId('tel-readonly')).toHaveValue(testBooking.phone ?? '');
  })

  it('should only show delete button when in edit mode', async () => {
    const user = userEvent.setup();
    const { getByText, getByTestId } = await renderBookingDetails();

    await expect.element(getByText("Löschen")).not.toBeInTheDocument();

    const toggleEditButton = getByTestId('toggle-edit-mode');
    await user.click(toggleEditButton);

    await expect.element(getByText("Löschen")).toBeInTheDocument();
  })

  it.skipIf(isBrowser)('should open alert on delete button click', async () => {
    const user = userEvent.setup();
    const { getByText, getByTestId, getByRole } = await renderBookingDetails();

    const toggleEditButton = getByTestId('toggle-edit-mode');
    await user.click(toggleEditButton);

    const deleteButton = getByText('Löschen');
    await user.click(deleteButton);

    const deleteAlert = getByRole('alertdialog');
    await expect.element(deleteAlert).toBeInTheDocument();

    const confirmDeleteButton = getByTestId('booking-confirm-delete');
    await user.click(confirmDeleteButton);

    await expect.element(deleteAlert).not.toBeInTheDocument();
    await expect.element(getByText("Buchungen")).toBeInTheDocument();
  })
});