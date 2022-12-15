import React from "react";

interface UseStorageConfig {
  ephemeral?: boolean;
  serialize?: <T>(value: T) => string;
  deserialize?: <T>(value: string) => T;
}

const getStorageType = (ephemeral: boolean): Storage =>
  ephemeral ? localStorage : sessionStorage;

const useStorageKey = <T = string>(
  key: string,
  {
    ephemeral = false,
    serialize = JSON.stringify,
    deserialize = JSON.parse
  }: UseStorageConfig = {}
): [T | null, (value: T) => void] => {
  const [storageValue, setStorageValue] = React.useState<T | null>(null);
  const serializedValue = storageValue ? serialize(storageValue) : null;

  React.useEffect(() => {
    const storage = getStorageType(ephemeral);
    const value = storage.getItem(key);
    if (!value) return;
    setStorageValue(deserialize(value));
  }, []);

  React.useEffect(() => {
    const storage = getStorageType(ephemeral);
    if (!storageValue || !serializedValue) return storage.removeItem(key);
    storage.setItem(key, serializedValue);
  }, [serializedValue]);

  return [storageValue, setStorageValue];
};

export default useStorageKey;
