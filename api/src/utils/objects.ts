import type { z } from "zod";

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

const filter = <T extends z.AnyZodObject>(data: any, schema: T): RecursivePartial<z.infer<T>> => {
  const result = schema.parse(data);
  return result;
};

export { filter };
