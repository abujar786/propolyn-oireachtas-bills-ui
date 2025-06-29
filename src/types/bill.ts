export interface BillResponse {
  head: {
    counts: {
      billCount: number;
      resultCount: number;
    };
  };
  results: {
    bill: Bill;
  }[];
}

export interface Bill {
  billNo: string;
  billType: string;
  billYear: string;
  billTypeURI: string;
  shortTitleEn: string;
  shortTitleGa: string;
  longTitleEn: string;
  longTitleGa: string;
  sponsors?: {
    sponsor: {
      as: {
        showAs: string;
        uri: string | null;
      };
      by: {
        showAs: string;
        uri: string | null;
      };
      isPrimary: boolean;
    };
  }[];
  status: string;
  uri: string;
}
