import {EMPTY_STRING} from "@/assets/consts.ts";
import {useStateWithQueryParams} from "@/hooks/useStateWithQueryParams.ts";
import {useEffect, useState} from "react";

export const DEFAULT_SEARCH_INPUT_DEBOUNCE_MS = 500;

type SearchState = { searchInputValue: string, searchParameter: string };

const initialState: SearchState = {
  searchInputValue: EMPTY_STRING,
  searchParameter: EMPTY_STRING,
};

export const useSearchWithQueryParams = () => {
  const [searchParameter, setSearchParameter] = useStateWithQueryParams<string>(
    initialState.searchParameter,
    'search',
    validateSearchParameter
  );

  const [searchInputValue, setSearchInputValue] = useState<string>(searchParameter);

  useEffect(() => {
    const newInput = searchInputValue.trim();
    if (newInput === searchParameter) {
      return;
    }

    const timer = setTimeout(() => {
      const newValue = setSearchParameter(newInput);
      if (newValue !== newInput) {
        setSearchInputValue(newValue);
      }
    }, DEFAULT_SEARCH_INPUT_DEBOUNCE_MS);

    return () => {
      clearTimeout(timer);
    }
  }, [searchInputValue]);

  useEffect(() => setSearchInputValue(searchParameter), [searchParameter]);

  return {
    searchParameter,
    searchInputValue,
    setSearchInputValue
  }
}

const validateSearchParameter = (parsedData: unknown): parsedData is string => {
  return typeof parsedData === 'string';
}