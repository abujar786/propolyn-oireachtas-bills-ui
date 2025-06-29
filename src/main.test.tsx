import { describe, it, vi, expect, beforeEach } from "vitest";
import * as ReactDOM from "react-dom/client";

// Mock render function
const renderMock = vi.fn();

vi.mock("react-dom/client", () => ({
  createRoot: vi.fn(() => ({
    render: renderMock,
  })),
}));

describe("main.tsx", () => {
  beforeEach(() => {
    // Set up the #root element for rendering
    const root = document.createElement("div");
    root.id = "root";
    document.body.appendChild(root);
  });

  it("should call createRoot and render App", async () => {
    await import("./main.tsx");

    const rootElement = document.getElementById("root");
    expect(ReactDOM.createRoot).toHaveBeenCalledWith(rootElement);
    expect(renderMock).toHaveBeenCalled();
  }, 10000); // 10 seconds
});
