// src/api/billsApi.ts
import axios from "axios";
import type { Bill, BillResponse } from "../types/bill";

const API_URL = "https://api.oireachtas.ie/v1/legislation";

export const fetchBills = async (
  page: number,
  rowsPerPage: number
): Promise<{ bills: Bill[]; totalResults: number }> => {
  const response = await axios.get<BillResponse>(API_URL, {
    params: {
      skip: page * rowsPerPage,
      limit: rowsPerPage,
      lang: "en",
      bill_status: "Current,Withdrawn,Enacted,Rejected,Defeated,Lapsed",
      bill_source: "Government,Private Member",
    },
  });

  const bills = response.data.results.map((item) => item.bill);
  const totalResults =
    response.data.head.counts.billCount ||
    response.data.head.counts.resultCount;

  return { bills, totalResults };
};
