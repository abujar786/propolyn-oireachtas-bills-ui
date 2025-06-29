import { renderHook } from "@testing-library/react";
import { useFavourites } from "./useFavourites";
import { describe, it, expect, vi } from "vitest";

describe("useFavourites", () => {
  it("throws error if used outside FavouriteProvider", () => {
    // Suppress expected console error output
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    expect(() => renderHook(() => useFavourites())).toThrowError(
      "useFavourites must be used within a FavouriteProvider"
    );

    consoleError.mockRestore();
  });
});
