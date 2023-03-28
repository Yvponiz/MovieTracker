import { createContext } from "react";
import { Media } from "../models/media";

type SearchContextType = {
  searchResult: Media[];
  setSearchResult: (result: Media[]) => void;
};

export const SearchContext = createContext<SearchContextType>({
  searchResult: [],
  setSearchResult: () => {},
});