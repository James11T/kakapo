import { getMemoryUsage } from "../../src/utils/process";
import { describe, it, expect } from "vitest";

describe("getMemoryUsage", () => {
  it("should return the a string resembling memory usage", () => {
    const memory = getMemoryUsage();
    expect(memory).toMatch(/\d+\.\d{2} MB/);
  });
});
