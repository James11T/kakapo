import { clamp } from "../../src/utils/math";
import { describe, it, expect } from "vitest";

describe("clamp", () => {
  it("should return the value itself when it is within the specified range", () => {
    const value = 5;
    const min = 1;
    const max = 10;
    const result = clamp(value, min, max);
    expect(result).toBe(value);
  });

  it("should clamp the value to the minimum when it is less than the specified range", () => {
    const value = -5;
    const min = 0;
    const max = 10;
    const result = clamp(value, min, max);
    expect(result).toBe(min);
  });

  it("should clamp the value to the maximum when it is greater than the specified range", () => {
    const value = 15;
    const min = 0;
    const max = 10;
    const result = clamp(value, min, max);
    expect(result).toBe(max);
  });

  it("should handle equal minimum and maximum values", () => {
    const value = 5;
    const min = 5;
    const max = 5;
    const result = clamp(value, min, max);
    expect(result).toBe(min);
  });

  it("should handle floating-point values", () => {
    const value = 3.7;
    const min = 1.5;
    const max = 5.2;
    const result = clamp(value, min, max);
    expect(result).toBe(value);
  });
});
