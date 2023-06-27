import {
  countOccurrences,
  stripFileExtension,
  uuid,
  countryCodeToFlag,
} from "../../src/utils/strings";
import { describe, it, expect } from "vitest";

describe("countOccurrences", () => {
  it("should return the correct count of occurrences when there are matches with global regex", () => {
    const str = "Hello world, hello universe";
    const match = /hello/gi;
    const actualCount = countOccurrences(str, match);
    expect(actualCount).toBe(2);
  });

  it("should return the correct count of occurrences when there are matches with non-global regex", () => {
    const str = "Hello world, hello universe";
    const match = /hello/i;
    const actualCount = countOccurrences(str, match);
    expect(actualCount).toBe(2);
  });

  it("should return 0 when there are no matches", () => {
    const str = "Hello world, hello universe";
    const match = /foo/gi;
    const actualCount = countOccurrences(str, match);
    expect(actualCount).toBe(0);
  });
});

describe("stripFileExtension", () => {
  it("should strip the last file extension from a filename", () => {
    const filename1 = "selfie.png";
    const expectedFilename1 = "selfie";
    const actualFilename1 = stripFileExtension(filename1);
    expect(actualFilename1).toBe(expectedFilename1);

    const filename2 = ".env";
    const expectedFilename2 = ".env";
    const actualFilename2 = stripFileExtension(filename2);
    expect(actualFilename2).toBe(expectedFilename2);
  });

  it("should return the original filename when there is no extension", () => {
    const filename = "fileWithoutExtension";
    const expectedFilename = "fileWithoutExtension";
    const actualFilename = stripFileExtension(filename);
    expect(actualFilename).toBe(expectedFilename);
  });
});

describe("uuid", () => {
  it("should return a unique string of length 21", () => {
    const uuid1 = uuid();
    const uuid2 = uuid();
    expect(uuid1.length).toBe(21);
    expect(uuid2.length).toBe(21);
    expect(uuid1).not.toBe(uuid2);
  });
});

describe("countryCodeToFlag", () => {
  it("should return the regional values for a 2-letter country code", () => {
    const countryCode = "US";
    const expectedFlag = "🇺🇸";
    const actualFlag = countryCodeToFlag(countryCode);
    expect(actualFlag).toBe(expectedFlag);
  });

  it("should handle lowercase country codes", () => {
    const countryCode = "gb";
    const expectedFlag = "🇬🇧";
    const actualFlag = countryCodeToFlag(countryCode);
    expect(actualFlag).toBe(expectedFlag);
  });
});
