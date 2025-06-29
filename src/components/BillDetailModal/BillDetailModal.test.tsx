import { render, screen, fireEvent } from "@testing-library/react";
import BillDetailModal from "./BillDetailModal";
import type { Bill } from "../../types/bill";
import { describe, it, expect, vi } from "vitest";

const mockBill: Bill = {
  billNo: "123",
  billType: "Public",
  billTypeURI: "",
  billYear: "2024",
  shortTitleEn: "Short English Title",
  shortTitleGa: "Short Irish Title",
  longTitleEn: "<p>This is the English version</p>",
  longTitleGa: "<p>Seo an leagan Gaeilge</p>",
  uri: "bill-123",
  sponsors: [],
  status: "Current",
};

describe("BillDetailModal", () => {
  it("should not render anything when bill is null", () => {
    const { container } = render(
      <BillDetailModal open={true} bill={null} onClose={() => {}} />
    );
    expect(container.firstChild).toBeNull();
  });

  it("should render the English tab content by default", () => {
    render(<BillDetailModal open={true} bill={mockBill} onClose={() => {}} />);
    expect(screen.getByText(/Bill #123/)).toBeInTheDocument();
    expect(screen.getByText(/This is the English version/)).toBeInTheDocument();
  });

  it("should switch to Gaeilge tab and show Irish content", () => {
    render(<BillDetailModal open={true} bill={mockBill} onClose={() => {}} />);
    fireEvent.click(screen.getByText("Gaeilge"));
    expect(screen.getByText(/Seo an leagan Gaeilge/)).toBeInTheDocument();
  });

  it("should call onClose when close button is clicked", () => {
    const onCloseMock = vi.fn();
    render(
      <BillDetailModal open={true} bill={mockBill} onClose={onCloseMock} />
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onCloseMock).toHaveBeenCalled();
  });
});
