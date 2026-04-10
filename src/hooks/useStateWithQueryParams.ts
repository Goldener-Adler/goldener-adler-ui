import {useLocation, useNavigate} from "react-router";
import {type SetStateAction, useEffect, useState} from "react";

const SET_STATE_ERROR = 'Unallowed state change rejected';

export const useStateWithQueryParams = <TState extends object | string | number | boolean | undefined>(
  initialState: TState,
  queryParameterName: string,
  isValidState: (parsedData: unknown) => parsedData is TState
) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getStateValueFromQueryParameter = (previousState: TState): TState => {
    try {
      const queryParams = new URLSearchParams(location.search);
      const parameterValue = queryParams.get(queryParameterName);
      if (parameterValue) {
        const parsedData = JSON.parse(parameterValue);
        if(isValidState(parsedData)) {
          return parsedData;
        }
      }
      return initialState;
    } catch {
      return previousState;
    }
  };

  const [state, setState] = useState<TState>(() => getStateValueFromQueryParameter(initialState));

  const updateState = (setStateAction: SetStateAction<TState>): TState => {
    try {
      const newValue =
        typeof setStateAction === 'function'
          ? setStateAction(state)
          : setStateAction;

      const newQueryParameterValue = newValue !== undefined ? JSON.stringify(newValue) : undefined;

      if(!isValidState(newQueryParameterValue ? JSON.parse(newQueryParameterValue) : undefined)) {
        console.error(SET_STATE_ERROR);
        return state;
      }

      const queryParams = new URLSearchParams(location.search);

      if (newValue === undefined || newValue === initialState) {
        queryParams.delete(queryParameterName);
      } else {
        queryParams.set(queryParameterName, newQueryParameterValue!);
      }

      navigate({
        pathname: location.pathname,
        search: queryParams.toString(),
      });

      setState(setStateAction);
      return newValue;
    } catch {
      console.error(SET_STATE_ERROR);
      return state;
    }
  }

  useEffect(
    () => setState(getStateValueFromQueryParameter(state)),
    [location.search]
  );

  return [state, updateState] as const;
}