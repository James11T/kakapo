import { z } from "zod";
import { filter } from "../../src/utils/objects";
import { describe, it, expect } from "vitest";

describe("filter", () => {
  const schema = z.object({
    id: z.any(),
    name: z.any(),
    age: z.any(),
  });

  it("should filter out properties not defined in the schema", () => {
    const data = {
      id: 1,
      name: "John Doe",
      age: 25,
      address: "123 Main St",
    };
    const filteredData = filter(data, schema);
    const expectedData = {
      id: 1,
      name: "John Doe",
      age: 25,
    };
    expect(filteredData).toEqual(expectedData);
  });
});
