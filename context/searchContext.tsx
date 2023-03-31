import React, { createContext, FunctionComponent, useContext, useState } from "react";

type SearchContextType = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

interface SearchProviderProps  {
  children: React.ReactNode;
};

export const SearchProvider: FunctionComponent<SearchProviderProps> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, isLoading, setIsLoading }}>
      {children}
    </SearchContext.Provider>
  );
};
