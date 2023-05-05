import type { TimeUnit, AnyTimeUnit } from "../types.js";

/**
 * If no date is passed, returns the current amount of time in seconds since 1970
 * If a date is passed, returns amount of time between date and 1970 in seconds
 *
 * @param date Optional date to get the epoch for
 * @returns Current epoch in ms
 */
const getEpoch = ({ date, truncate = false }: { date?: Date; truncate?: boolean } = {}): number => {
  const now = Number(date ? date : new Date()) / 1000;
  if (truncate) return Math.floor(now);
  return now;
};

const conversionRates: Record<TimeUnit, number> = {
  ms: 1,
  s: 1_000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
  w: 604_800_000,
  y: 31_536_000_000,
};

const durationMap: Record<AnyTimeUnit, TimeUnit> = {
  ms: "ms",
  s: "s",
  sec: "s",
  secs: "s",
  m: "m",
  min: "m",
  mins: "m",
  h: "h",
  hr: "h",
  hrs: "h",
  hour: "h",
  hours: "h",
  d: "d",
  day: "d",
  days: "d",
  w: "w",
  wk: "w",
  week: "w",
  weeks: "w",
  y: "y",
  yr: "y",
  yrs: "y",
  year: "y",
  years: "y",
};

const createConvert =
  (from: AnyTimeUnit) =>
  (duration: number, to: AnyTimeUnit = "ms") =>
    Math.floor(duration * (conversionRates[durationMap[from]] / conversionRates[durationMap[to]]));

const milliseconds = createConvert("ms");

const duration = (duration: number, to: TimeUnit = "ms") => milliseconds(duration, to);
duration.milliseconds = milliseconds;
duration.seconds = createConvert("s");
duration.minutes = createConvert("m");
duration.hours = createConvert("h");
duration.days = createConvert("d");
duration.weeks = createConvert("w");
duration.years = createConvert("y");

export { getEpoch, duration };
