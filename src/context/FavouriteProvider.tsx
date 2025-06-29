import { useState, useEffect } from "react";
import { FavouriteContext } from "./FavouriteContext";
import type { Bill } from "../types/bill";
export const FavouriteProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [favourites, setFavourites] = useState<Record<string, Bill>>({});

  useEffect(() => {
    const stored = localStorage.getItem("favouriteBills");
    if (stored) {
      setFavourites(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favouriteBills", JSON.stringify(favourites));
  }, [favourites]);

  const toggleFavourite = (bill: Bill) => {
    setFavourites((prev) => {
      const updated = { ...prev };
      if (updated[bill.uri]) {
        delete updated[bill.uri];
        console.log(`Unfavourited ${bill.uri}`);
      } else {
        updated[bill.uri] = bill;
        console.log(`Favourited ${bill.uri}`);
      }
      return updated;
    });
  };

  return (
    <FavouriteContext.Provider value={{ favourites, toggleFavourite }}>
      {children}
    </FavouriteContext.Provider>
  );
};
