import { describe, it, expect } from "vitest";
import { duration } from "../../src/utils/time";
import type { TimeUnit } from "../../src/types";

interface Conversion {
  rate: number;
  unit: TimeUnit;
  func: (duration: number, unit: TimeUnit) => number;
}

const conversionRates: Conversion[] = [
  { rate: 1, unit: "ms", func: duration.milliseconds },
  { rate: 1_000, unit: "s", func: duration.seconds },
  { rate: 60_000, unit: "m", func: duration.minutes },
  { rate: 3_600_000, unit: "h", func: duration.hours },
  { rate: 86_400_000, unit: "d", func: duration.days },
  { rate: 604_800_000, unit: "w", func: duration.weeks },
  { rate: 31_536_000_000, unit: "y", func: duration.years },
];

describe("duration", () => {
  for (const conversion1 of conversionRates) {
    for (const conversion2 of conversionRates) {
      it(`should convert -5${conversion1.unit} to ${conversion2.unit}`, () => {
        expect(conversion1.func(-4, conversion2.unit)).toBe(
          Math.floor(-4 * (conversion1.rate / conversion2.rate))
        );
      });

      it(`should convert 0${conversion1.unit} to ${conversion2.unit}`, () => {
        expect(conversion1.func(0, conversion2.unit)).toBe(0);
      });

      it(`should convert 1${conversion1.unit} to ${conversion2.unit}`, () => {
        expect(conversion1.func(1, conversion2.unit)).toBe(
          Math.floor(1 * (conversion1.rate / conversion2.rate))
        );
      });

      it(`should convert 100${conversion1.unit} to ${conversion2.unit}`, () => {
        expect(conversion1.func(100, conversion2.unit)).toBe(
          Math.floor(100 * (conversion1.rate / conversion2.rate))
        );
      });
    }
  }
});
