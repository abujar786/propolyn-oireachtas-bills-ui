import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FavouriteProvider } from "./FavouriteProvider";
import { useFavourites } from "../hook/useFavourites";
import userEvent from "@testing-library/user-event";
import type { Bill } from "../types/bill";

const mockBill: Bill = {
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
} as Bill;

const TestComponent = () => {
  const { favourites, toggleFavourite } = useFavourites();

  return (
    <div>
      <button onClick={() => toggleFavourite(mockBill)}>Toggle</button>
      <div data-testid="favourites-count">{Object.keys(favourites).length}</div>
    </div>
  );
};

describe("FavouriteProvider", () => {
  it("adds and removes a bill from favourites using toggleFavourite", async () => {
    render(
      <FavouriteProvider>
        <TestComponent />
      </FavouriteProvider>
    );

    const button = screen.getByRole("button", { name: "Toggle" });
    const count = screen.getByTestId("favourites-count");

    // Initially 0 favourites
    expect(count.textContent).toBe("0");

    // Add the bill
    await userEvent.click(button);
    expect(count.textContent).toBe("1");

    // Remove the bill
    await userEvent.click(button);
    expect(count.textContent).toBe("0");
  });
});
