import { render, screen, fireEvent } from "@testing-library/react";
import BillTable from "./BillTable";
import type { Bill } from "../../types/bill";
import { describe, it, expect, vi } from "vitest";

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

describe("BillTable", () => {
  it("renders the table with headers", () => {
    render(
      <BillTable
        bills={mockBills}
        filter=""
        onSelectBill={vi.fn()}
        favourites={{}}
        onToggleFavourite={vi.fn()}
      />
    );

    expect(screen.getByText("Bill No")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Sponsor")).toBeInTheDocument();
    expect(screen.getByText("Favourite")).toBeInTheDocument();
  });

  it("displays correct bill data", () => {
    render(
      <BillTable
        bills={mockBills}
        filter=""
        onSelectBill={vi.fn()}
        favourites={{}}
        onToggleFavourite={vi.fn()}
      />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Public")).toBeInTheDocument();
    expect(screen.getByText("Enacted")).toBeInTheDocument();
    expect(screen.getByText("Minister for Health")).toBeInTheDocument();
  });

  it("calls onSelectBill when row is clicked", () => {
    const onSelect = vi.fn();

    render(
      <BillTable
        bills={mockBills}
        filter=""
        onSelectBill={onSelect}
        favourites={{}}
        onToggleFavourite={vi.fn()}
      />
    );

    const row = screen.getByTestId("bill-row-1");
    fireEvent.click(row);

    expect(onSelect).toHaveBeenCalledWith(mockBills[0]);
  });

  it("calls onToggleFavourite when favourite icon is clicked", () => {
    const toggleFav = vi.fn();

    render(
      <BillTable
        bills={mockBills}
        filter=""
        onSelectBill={vi.fn()}
        favourites={{}}
        onToggleFavourite={toggleFav}
      />
    );

    const favButton = screen.getByTestId("favourite-button-1");
    fireEvent.click(favButton);

    expect(toggleFav).toHaveBeenCalledWith(mockBills[0]);
  });
  it("filters bills based on the billType", () => {
    const filteredBill: Bill = {
      ...mockBills[0],
      billType: "Public",
    };

    render(
      <BillTable
        bills={[filteredBill]}
        filter="public" // matching filter
        onSelectBill={vi.fn()}
        favourites={{}}
        onToggleFavourite={vi.fn()}
      />
    );

    // Bill should be visible
    expect(screen.getByText("1")).toBeInTheDocument();
  });
  it("shows filled star icon when bill is favourited", () => {
    render(
      <BillTable
        bills={mockBills}
        filter=""
        onSelectBill={vi.fn()}
        favourites={{
          [mockBills[0].uri]: mockBills[0], // mark as favourite
        }}
        onToggleFavourite={vi.fn()}
      />
    );

    // Filled StarIcon should be in the document
    const favButton = screen.getByTestId("favourite-button-1");
    expect(favButton.querySelector("svg")).toBeInTheDocument();
  });
});
