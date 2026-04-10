import {useLocation} from "react-router";
import {type SetStateAction, useEffect, useState} from "react";

const SESSION_STORAGE_STATE_ERROR = "State is only in Memory";

// TODO: Make it handle Date objects correctly, see BookingContext for how to parse

export const useStateWithSessionStorage = <TState extends object | string | number | boolean>(
  initialState: TState,
  sessionStorageKeyLeaf: string,
  isValidState: (parsedData: unknown) => parsedData is TState
) => {
  const location = useLocation();
  const sessionsStorageKey = `${location.pathname}/${sessionStorageKeyLeaf}`;
  
  const getStateValueFromSessionStorage = (previousState: TState): TState => {
    const storedValue = sessionStorage.getItem(sessionsStorageKey);
    try {
      if (storedValue) {
        const parsedData = JSON.parse(storedValue);
        console.log("parsedData", parsedData);
        console.log("isValidState", isValidState(parsedData));
        if (isValidState(parsedData)) {
          return parsedData;
        }
      }
      return previousState;
    } catch {
      sessionStorage.removeItem(sessionsStorageKey);
      return previousState;
    }
  }
  
  const [state, setState] = useState<TState>(() => getStateValueFromSessionStorage(initialState));

  const updateState = (setStateAction: SetStateAction<TState>) => {
    try {
      const newValue =
        typeof setStateAction === 'function'
          ? setStateAction(state)
          : setStateAction;
      const newSessionStorageValue = JSON.stringify(newValue);

      console.log("newSessionStorageValue", newSessionStorageValue);
      console.log("isValidState", isValidState(JSON.parse(newSessionStorageValue)));
      
      if (!isValidState(JSON.parse(newSessionStorageValue))) {
        console.error(SESSION_STORAGE_STATE_ERROR)
        return;
      }

      sessionStorage.setItem(sessionsStorageKey, newSessionStorageValue);
      setState(setStateAction);
    } catch {
      console.error(SESSION_STORAGE_STATE_ERROR);
    }
  }

  useEffect(() => {
    sessionStorage.setItem(sessionsStorageKey, JSON.stringify(state));
  }, [state]);
  
  return [state, updateState] as const;
}