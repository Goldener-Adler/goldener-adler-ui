import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {cleanup, render} from "vitest-browser-react";
import {MemoryRouter} from "react-router";
import {GuestInformation} from "@/pages/public/newBooking/GuestInformation";
import {NewBookingProvider} from "@/contexts/NewBookingContext";
import {afterEach, describe, expect, it, vi} from "vitest";
import {userEvent} from "vitest/browser";

vi.useFakeTimers();

function renderPage(initialEntries = ['/new-booking/guests']) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <NewBookingProvider>
        <QueryClientProvider client={queryClient}>
          <GuestInformation />
        </QueryClientProvider>
      </NewBookingProvider>
    </MemoryRouter>
  )
}

describe('GuestInformation', () => {
  afterEach(() => {
    // Clean up the DOM after each test
    cleanup();
  });

  it('shows initial contact fields', async () => {
    const { getByLabelText, getByRole, container } = await renderPage();

    const differentGuestCheckbox = getByRole('checkbox', { name: /Für eine andere Person buchen/i });
    expect(differentGuestCheckbox).toBeInTheDocument();

    await expect.element(getByLabelText("Vorname")).toBeInTheDocument();
    await expect.element(getByLabelText("Nachname")).toBeInTheDocument();
    await expect.element(getByLabelText("Email")).toBeInTheDocument();
    await expect.element(getByLabelText("Phone")).toBeInTheDocument();

    const fillAtCheckInCheckbox = getByRole('checkbox', { name: /Meldepflichtige Daten bei Ankunft ausfüllen/i });
    expect(fillAtCheckInCheckbox).toBeInTheDocument();

    const label = container.querySelector('label:has(+ [role="combobox"])');
    expect(label).toHaveTextContent('Staatsbürgerschaft');

    if (!label) {
      throw Error;
    }
    const comboboxCitizenship = label.nextElementSibling;
    expect(comboboxCitizenship).toBeInTheDocument();
  })

  it('toggles main guest fields visibility when booking for another person', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole } = await renderPage();

    const differentGuestCheckbox = getByRole('checkbox', { name: /Für eine andere Person buchen/i });
    const firstNameInputs = getByLabelText("Vorname");
    const lastNameInputs = getByLabelText("Nachname");
    const emailInputs = getByLabelText("Email");
    const phoneInputs = getByLabelText("Phone");

    expect(differentGuestCheckbox).not.toBeChecked();
    expect(firstNameInputs).toHaveLength(1);
    expect(lastNameInputs).toHaveLength(1);
    expect(emailInputs).toHaveLength(1);
    expect(phoneInputs).toHaveLength(1);

    await user.click(differentGuestCheckbox);

    expect(differentGuestCheckbox).toBeChecked();
    expect(firstNameInputs).toHaveLength(2);
    expect(lastNameInputs).toHaveLength(2);
    expect(emailInputs).toHaveLength(2);
    expect(phoneInputs).toHaveLength(2);

    await user.click(differentGuestCheckbox);

    expect(differentGuestCheckbox).not.toBeChecked();
    expect(firstNameInputs).toHaveLength(1);
    expect(lastNameInputs).toHaveLength(1);
    expect(emailInputs).toHaveLength(1);
    expect(phoneInputs).toHaveLength(1);
  });

  it('toggles citizenship select visibility when checking "fill at check in"', async () => {
    const user = userEvent.setup();
    const { getByRole, container } = await renderPage();

    const fillAtCheckInCheckbox = getByRole('checkbox', { name: /Meldepflichtige Daten bei Ankunft ausfüllen/i });

    const label = container.querySelector('label:has(+ [role="combobox"])');
    expect(label).toHaveTextContent('Staatsbürgerschaft');
    if (!label) {
      throw Error;
    }
    const comboboxCitizenship = label.nextElementSibling;
    expect(comboboxCitizenship).toBeInTheDocument();
    expect(fillAtCheckInCheckbox).not.toBeChecked();

    await user.click(fillAtCheckInCheckbox);
    vi.advanceTimersByTime(200);

    expect(fillAtCheckInCheckbox).toBeChecked();
    expect(comboboxCitizenship).not.toBeInTheDocument();
  })

  it('does not show reporting fields when selecting the German citizenship', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByRole, container } = await renderPage();

    const label = container.querySelector('label:has(+ [role="combobox"])');
    expect(label).toHaveTextContent('Staatsbürgerschaft');

    if (!label) {
      throw Error;
    }
    const comboboxCitizenship = label.nextElementSibling;
    expect(comboboxCitizenship).toBeInTheDocument();

    if (!comboboxCitizenship) {
      throw Error;
    }
    await user.click(comboboxCitizenship);

    const dropdownOption = getByRole('option', { name: /Deutschland/i });
    await user.click(dropdownOption);

    expect(comboboxCitizenship).toHaveTextContent(/Deutschland/i);

    await expect.element(getByLabelText(/Straße/i)).not.toBeInTheDocument();
    await expect.element(getByLabelText(/PLZ/i)).not.toBeInTheDocument();
    await expect.element(getByLabelText(/Stadt/i)).not.toBeInTheDocument();
    await expect.element(getByLabelText(/Land/i)).not.toBeInTheDocument();
  })

  it.each(['Kanada', 'Vereinigtes Königreich', 'Polen', 'Türkei'])('shows reporting fields when selecting citizenship %s', async (citizenship) => {
    const user = userEvent.setup();
    const  { getByRole, getByLabelText, container } = await renderPage();

    const label = container.querySelector('label:has(+ [role="combobox"])');
    expect(label).toHaveTextContent('Staatsbürgerschaft');

    if (!label) {
      throw Error;
    }
    const comboboxCitizenship = label.nextElementSibling;
    expect(comboboxCitizenship).toBeInTheDocument();

    if (!comboboxCitizenship) {
      throw Error;
    }
    await user.click(comboboxCitizenship);

    const dropdownOption = getByRole('option', { name: citizenship });
    await user.click(dropdownOption);

    expect(comboboxCitizenship).toHaveTextContent(citizenship);

    expect(getByLabelText(/Straße/i)).toBeInTheDocument();
    expect(getByLabelText(/PLZ/i)).toBeInTheDocument();
    expect(getByLabelText(/Stadt/i)).toBeInTheDocument();
    expect(getByLabelText(/Land/i)).toBeInTheDocument();
  });
})