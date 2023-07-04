import type { ZodObject } from "zod";

type FriendshipStatus = "NOT_FRIENDS" | "PENDING" | "FRIENDS";

type RequireKey<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  { [K in keyof U]: Required<Pick<U[K], keyof U[K]>> }[keyof U];

type ValidationSchema = ZodObject<{
  params?: any;
  body?: any;
  query?: any;
}>;

const SHORT_TIME_UNITS = ["ms", "s", "m", "h", "d", "w", "y"] as const;
const LONG_TIME_UNITS = [
  "sec",
  "secs",
  "min",
  "mins",
  "hr",
  "hrs",
  "hour",
  "hours",
  "day",
  "days",
  "wk",
  "week",
  "weeks",
  "yr",
  "yrs",
  "year",
  "years",
] as const;

type TimeUnit = (typeof SHORT_TIME_UNITS)[number];
type LongTimeUnit = (typeof LONG_TIME_UNITS)[number];
type AnyTimeUnit = TimeUnit | LongTimeUnit;

interface Pagination {
  from?: number;
  count?: number;
}

type ID = number;
type UUID = string;

export { SHORT_TIME_UNITS, LONG_TIME_UNITS };
export type {
  FriendshipStatus,
  RequireKey,
  ValidationSchema,
  TimeUnit,
  LongTimeUnit,
  AnyTimeUnit,
  Pagination,
  ID,
  UUID,
};
