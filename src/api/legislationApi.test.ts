import { describe, it, expect, vi } from "vitest";
import axios from "axios";
import { fetchBills } from "./legislationApi";

vi.mock("axios");
const mockedAxios = axios as unknown as { get: ReturnType<typeof vi.fn> };

describe("fetchBills mapping logic", () => {
  it("maps bills and calculates totalResults correctly", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        head: {
          counts: {
            billCount: 10,
            resultCount: 99,
          },
        },
        results: [
          {
            bill: {
              billNo: "1",
              billType: "Public",
              uri: "uri-1",
              sponsors: [],
            },
          },
          {
            bill: {
              billNo: "2",
              billType: "Private",
              uri: "uri-2",
              sponsors: [],
            },
          },
        ],
      },
    });

    const result = await fetchBills(0, 2);

    expect(result.bills).toEqual([
      { billNo: "1", billType: "Public", uri: "uri-1", sponsors: [] },
      { billNo: "2", billType: "Private", uri: "uri-2", sponsors: [] },
    ]);

    expect(result.totalResults).toBe(10); // prefers billCount over resultCount
  });
  it("falls back to resultCount when billCount is missing", async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        head: {
          counts: {
            // billCount is missing
            resultCount: 42,
          },
        },
        results: [
          {
            bill: {
              billNo: "3",
              billType: "Public",
              uri: "uri-3",
              sponsors: [],
            },
          },
        ],
      },
    });

    const result = await fetchBills(1, 10);

    expect(result.totalResults).toBe(42); // ✅ Covers fallback case
    expect(result.bills).toEqual([
      { billNo: "3", billType: "Public", uri: "uri-3", sponsors: [] },
    ]);
  });
});
