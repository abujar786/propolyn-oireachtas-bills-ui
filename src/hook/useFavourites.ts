import { useContext } from "react";
import { FavouriteContext } from "../context/FavouriteContext";

export const useFavourites = () => {
  const context = useContext(FavouriteContext);
  if (!context) {
    throw new Error("useFavourites must be used within a FavouriteProvider");
  }
  return context;
};
