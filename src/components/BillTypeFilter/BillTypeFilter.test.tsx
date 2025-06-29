// src/components/BillTypeFilter.test.tsx
import { render, screen } from "@testing-library/react";
import BillTypeFilter from "./BillTypeFilter";
import { describe, it, expect } from "vitest";

describe("BillTypeFilter", () => {
  const options = ["Government", "Private Member", "public"];

  it("renders with all options", () => {
    render(<BillTypeFilter value="" onChange={() => {}} options={options} />);

    expect(screen.getByLabelText(/Filter by Bill Type/i)).toBeInTheDocument();
  });
});
