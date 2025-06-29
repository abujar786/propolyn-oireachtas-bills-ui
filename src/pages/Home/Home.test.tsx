// src/pages/__tests__/Home.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  within,
} from "@testing-library/react";
import Home from "./Home";
import { useFavourites } from "../../hook/useFavourites";
import * as api from "../../api/legislationApi";
import { FavouriteProvider } from "../../context/FavouriteProvider";
import type { Bill } from "../../types/bill";
import userEvent from "@testing-library/user-event";

// Mock implementation for `useFavourites` hook
vi.mock("../../hook/useFavourites", () => ({
  useFavourites: vi.fn(),
}));

// Mock API
vi.mock("../../api/legislationApi", () => ({
  fetchBills: vi.fn(),
}));

const mockBills: Bill[] = [
  {
    billNo: "1",
    billType: "Public",
    status: "Enacted",
    uri: "uri-1",
    sponsors: [
      {
        sponsor: {
          as: { showAs: "Minister for Health", uri: "uri" },
          by: { showAs: "John Doe", uri: "uri" },
          isPrimary: true,
        },
      },
    ],
    // Add other required fields with dummy values
  } as Bill,
];
function createDeferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}
describe("Home Page", () => {
  const mockedUseFavourites = vi.mocked(useFavourites);
  const mockedFetchBills = vi.mocked(api.fetchBills);
  beforeEach(() => {
    // Mock hook response
    mockedUseFavourites.mockReturnValue({
      favourites: {},
      toggleFavourite: vi.fn(),
    });

    // Mock API response
    mockedFetchBills.mockResolvedValue({
      bills: mockBills,
      totalResults: 1,
    });
  });

  it("renders heading and tabs", async () => {
    render(
      <FavouriteProvider>
        <Home />
      </FavouriteProvider>
    );

    expect(screen.getByText(/Bills Information/i)).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /All Bills/i })).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: /Favourites/i })
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Sponsor/i)).toBeInTheDocument();
    });
  });

  it("shows loading indicator while fetching bills", async () => {
    const deferred = createDeferred<{ bills: Bill[]; totalResults: number }>();

    deferred.resolve({ bills: mockBills, totalResults: 1 });

    mockedFetchBills.mockReturnValueOnce(deferred.promise);

    render(
      <FavouriteProvider>
        <Home />
      </FavouriteProvider>
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    deferred.resolve({ bills: mockBills, totalResults: 1 });

    // Optionally wait for progressbar to disappear or next UI to show
    await waitFor(() => {
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
  });

  it("switches to Favourites tab", async () => {
    render(
      <FavouriteProvider>
        <Home />
      </FavouriteProvider>
    );

    const favouritesTab = screen.getByRole("tab", { name: /Favourites/i });
    fireEvent.click(favouritesTab);

    expect(favouritesTab).toHaveAttribute("aria-selected", "true");
  });
  it("resets to page 0 and updates rows per page on pagination change", async () => {
    render(
      <FavouriteProvider>
        <Home />
      </FavouriteProvider>
    );

    // Wait for initial bills to load
    await waitFor(() => {
      expect(screen.getByText(/Sponsor/i)).toBeInTheDocument();
    });

    // Change rows per page
    const rowsPerPageSelect = screen.getByLabelText(/Rows per page/i);

    // Open the dropdown
    await userEvent.click(rowsPerPageSelect);

    // Click on option 25 (you may need to wait if options are rendered lazily)
    const option = await screen.findByRole("option", { name: "25" });
    await userEvent.click(option);

    // After changing rows per page, the page should be reset (check API is called with page=0, limit=25)
    await waitFor(() => {
      expect(api.fetchBills).toHaveBeenLastCalledWith(0, 25);
    });
  });
  it("filters bills by billType", async () => {
    render(
      <FavouriteProvider>
        <Home />
      </FavouriteProvider>
    );

    // Wait for initial bill data to load
    await screen.findByText("Minister for Health");

    // Open the bill type filter dropdown
    const select = screen.getByLabelText(/filter by bill type/i);
    await userEvent.click(select);

    // Wait for the dropdown option to appear and select it
    const publicOption = await screen.findByRole("option", { name: "Public" });
    await userEvent.click(publicOption);

    // Make sure the table is showing filtered result with "Public" bill
    const table = screen.getByRole("table");
    const { getByText } = within(table);
    expect(getByText("Public")).toBeInTheDocument();
  });
  it("opens and closes BillDetailModal when bill is selected", async () => {
    render(
      <FavouriteProvider>
        <Home />
      </FavouriteProvider>
    );

    // Wait for bills to render
    await waitFor(() => {
      expect(screen.getByText(/Sponsor/i)).toBeInTheDocument();
    });

    // Select the bill row (simulate selecting a bill)
    const billRow = screen.getByText("Minister for Health");
    fireEvent.click(billRow);

    // Modal should appear
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    // Close the modal (simulate onClose)
    const dialog = screen.getByRole("dialog");
    fireEvent.keyDown(dialog, { key: "Escape", code: "Escape" }); // assuming escape closes the modal

    // Confirm modal disappears
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
  it("shows correct pagination count for favourites tab with and without filter", async () => {
    const mockFavouriteBills: Record<string, Bill> = {
      "uri-1": { ...mockBills[0], billType: "Public" },
      "uri-2": { ...mockBills[0], billType: "Private", uri: "uri-2" },
    };

    mockedUseFavourites.mockReturnValue({
      favourites: mockFavouriteBills,
      toggleFavourite: vi.fn(),
    });

    render(
      <FavouriteProvider>
        <Home />
      </FavouriteProvider>
    );

    // Switch to Favourites tab
    const favouritesTab = screen.getByRole("tab", { name: /Favourites/i });
    fireEvent.click(favouritesTab);

    await waitFor(() => {
      // Expect pagination count to equal number of favourites (2)
      const pagination = screen.getByText(/1–2 of 2/i);
      expect(pagination).toBeInTheDocument();
    });

    // Filter favourites by "Public"
    const select = screen.getByLabelText(/filter by bill type/i);
    await userEvent.click(select);
    const publicOption = await screen.findByRole("option", { name: "Public" });
    await userEvent.click(publicOption);

    await waitFor(() => {
      // Now only 1 bill matches filter "Public"
      const pagination = screen.getByText(/1–1 of 1/i);
      expect(pagination).toBeInTheDocument();
    });
  });
});
