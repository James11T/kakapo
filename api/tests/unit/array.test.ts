import { alwaysArray, removeDuplicates } from "../../src/utils/array";
import { describe, it, expect } from "vitest";

describe("alwaysArray", () => {
  it("should return an empty array when the value is null", () => {
    const value = null;
    const expectedArray: any[] = [];
    const result = alwaysArray(value);
    expect(result).toEqual(expectedArray);
  });

  it("should return an empty array when the value is undefined", () => {
    const value = undefined;
    const expectedArray: any[] = [];
    const result = alwaysArray(value);
    expect(result).toEqual(expectedArray);
  });

  it("should return the original array when the value is already an array", () => {
    const value = [1, 2, 3];
    const expectedArray = value;
    const result = alwaysArray(value);
    expect(result).toEqual(expectedArray);
  });

  it("should convert a single value into an array with that value", () => {
    const value = 5;
    const expectedArray = [value];
    const result = alwaysArray(value);
    expect(result).toEqual(expectedArray);
  });
});

describe("removeDuplicates", () => {
  it("should remove duplicate values from the array", () => {
    const value = [1, 2, 3, 2, 4, 1, 5];
    const expectedArray = [1, 2, 3, 4, 5];
    const result = removeDuplicates(value);
    expect(result).toEqual(expectedArray);
  });

  it("should handle an empty array", () => {
    const value: any[] = [];
    const expectedArray: any[] = [];
    const result = removeDuplicates(value);
    expect(result).toEqual(expectedArray);
  });

  it("should handle an array with a single value", () => {
    const value = [42];
    const expectedArray = value;
    const result = removeDuplicates(value);
    expect(result).toEqual(expectedArray);
  });
});
