import type Color from "color";

type ColorValue =
  | "_primary"
  | "_success"
  | "_secondary"
  | "_destructive"
  | string
  | Color;

type SetStateBasedOnPrevious<T> = (previousValue: T) => T;
type SetStateParameter<T> = T | SetStateBasedOnPrevious<T>;
type SetStateAction<T> = (value: SetStateParameter<T>) => void;

export type {
  ColorValue,
  SetStateAction,
  SetStateParameter,
  SetStateBasedOnPrevious
};
