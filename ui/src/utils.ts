import type { SetStateBasedOnPrevious, SetStateParameter } from "./types";

const handleSetStateAction = <T>(
  value: SetStateParameter<T>,
  oldState: T
): T => {
  if (typeof value === "function")
    return (value as SetStateBasedOnPrevious<T>)(oldState);
  return value;
};

export { handleSetStateAction };
