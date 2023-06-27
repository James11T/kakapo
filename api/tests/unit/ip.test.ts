import { IPToCountry, countryToEmoji, IPToCountryEmoji } from "../../src/utils/ip";
import { describe, it, expect } from "vitest";

describe("IPToCountry", () => {
  it("should return the ISO country code for a valid IP address", () => {
    const ip = "8.8.8.8";
    const expectedCountryCode = "US";
    const actualCountryCode = IPToCountry(ip);
    expect(actualCountryCode).toBe(expectedCountryCode);
  });

  it("should return FAIL_COUNTRY_CODE for an invalid IP address", () => {
    const ip = "invalid-ip";
    const expectedCountryCode = "XX";
    const actualCountryCode = IPToCountry(ip);
    expect(actualCountryCode).toBe(expectedCountryCode);
  });
});

describe("countryToEmoji", () => {
  it("should return the emoji corresponding to the given ISO country code", () => {
    const countryCode = "US";
    const expectedEmoji = "🇺🇸";
    const actualEmoji = countryToEmoji(countryCode);
    expect(actualEmoji).toBe(expectedEmoji);
  });

  it("should return FAIL_EMOJI for FAIL_COUNTRY_CODE", () => {
    const countryCode = "XX";
    const expectedEmoji = "❓";
    const actualEmoji = countryToEmoji(countryCode);
    expect(actualEmoji).toBe(expectedEmoji);
  });
});

describe("IPToCountryEmoji", () => {
  it("should return the emoji corresponding to the country of a valid IP address", () => {
    const ip = "8.8.8.8";
    const expectedEmoji = "🇺🇸";
    const actualEmoji = IPToCountryEmoji(ip);
    expect(actualEmoji).toBe(expectedEmoji);
  });

  it("should return FAIL_EMOJI for an invalid IP address", () => {
    const ip = "invalid-ip";
    const expectedEmoji = "❓";
    const actualEmoji = IPToCountryEmoji(ip);
    expect(actualEmoji).toBe(expectedEmoji);
  });
});
