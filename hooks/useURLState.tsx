import React from "react";
import { handleSetStateAction } from "../src/utils";
import type { SetStateParameter, SetStateAction } from "../src/types";

const ENCODED_PREFIX = "?s=";

interface URLStateProviderProps {
  children?: React.ReactNode;
  encoding?: "base64" | "hex" | "utf-8"; // Defaulted to utf-8 / plaintext
}

type ValueType = string | undefined;
type KeysType = Record<string, ValueType>;

interface URLStateContext {
  keys: KeysType;
  setKey: (key: string, value: SetStateParameter<ValueType>) => void;
  setKeys: (keys: KeysType) => void;
  clearKey: (key: string) => void;
  getKey: (key: string, defaultValue?: string) => ValueType;
}

const urlStateContext = React.createContext<URLStateContext>(
  {} as URLStateContext
);

const URLStateProvider = ({
  children,
  encoding = "utf-8"
}: URLStateProviderProps): JSX.Element => {
  const [keysState, setKeysState] = React.useState<KeysType>({});
  const keyStateJSON = JSON.stringify(keysState);

  const queryToState = React.useCallback(
    (query: string): KeysType => {
      if (!query.startsWith("?")) return {}; // No query

      const values =
        encoding === "utf-8"
          ? query.slice(1) // Remove leading ?
          : Buffer.from(query.slice(ENCODED_PREFIX.length), encoding).toString(
              "utf-8"
            ); // Remove leading ENCODED_PREFIX

      const params: KeysType = values
        .split("&") // Seperate parameters
        .reduce((prev, curr) => {
          const split = curr.split("="); // Split into key and value
          if (split.length === 1) return { ...prev, [split[0]]: undefined }; // If no value set default
          return { ...prev, [split[0]]: split[1] };
        }, {});

      return params;
    },
    [encoding]
  );

  const stateToQuery = React.useCallback((): string => {
    const keys = Object.keys(keysState).filter((key) =>
      Boolean(keysState[key])
    ); // Filter out nullables

    if (keys.length === 0) return "?"; // No query if no keys

    const queryKeys = keys.map((key) => `${key}=${keysState[key]}`).join("&"); // "key=x,key=y"

    if (encoding === "utf-8") return "?" + queryKeys;
    return ENCODED_PREFIX + Buffer.from(queryKeys, "utf-8").toString(encoding);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyStateJSON, encoding]);

  React.useEffect(() => {
    // Load default state on mount
    if (!window.location.search) return;
    setKeysState(queryToState(window.location.search));
  }, [queryToState]);

  React.useEffect(() => {
    // Update URL when state changes
    window.history.replaceState({}, document.title, stateToQuery());
  }, [keyStateJSON, stateToQuery]);

  const setKey = (key: string, value: SetStateParameter<ValueType>): void => {
    setKeysState((old) => ({
      ...old,
      [key]: handleSetStateAction(value, old[key])
    }));
  };

  const setKeys = (keys: Record<string, any>): void =>
    setKeysState((old) => ({ ...old, ...keys }));

  const clearKey = (key: string): void =>
    setKeysState((old) =>
      Object.keys(old)
        .filter((old) => old !== key)
        .reduce((prev, curr) => ({ ...prev, [curr]: old[curr] }), {})
    );

  const getKey = (key: string, fallback?: string): ValueType =>
    keysState[key] ?? fallback;

  return (
    <urlStateContext.Provider
      value={{ keys: keysState, setKey, setKeys, clearKey, getKey }}
    >
      {children}
    </urlStateContext.Provider>
  );
};

const useURLState = (): URLStateContext => React.useContext(urlStateContext);

// Use a specific key
const useURLStateKey = (
  key: string
): [string | undefined, SetStateAction<ValueType>] => {
  const URLState = useURLState();

  const updateKey = React.useCallback(
    (value: SetStateParameter<ValueType>): void =>
      URLState.setKey(key, handleSetStateAction(value, URLState.getKey(key))),
    [URLState, key]
  );

  return [URLState.getKey(key), updateKey];
};

export { URLStateProvider, useURLState, useURLStateKey };
