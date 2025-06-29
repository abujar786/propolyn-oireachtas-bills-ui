import { createContext } from "react";
import type { Bill } from "../types/bill";

export type FavouriteContextType = {
  favourites: Record<string, Bill>;
  toggleFavourite: (bill: Bill) => void;
};

export const FavouriteContext = createContext<FavouriteContextType | undefined>(
  undefined
);
