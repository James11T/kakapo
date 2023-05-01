import type { z } from "zod";
import type { Request } from "express";
import type { ValidationSchema } from "../types";

const validate = async <T extends ValidationSchema>(
  schema: T,
  req: Request
): Promise<z.infer<T>> => {
  const parseResult = await schema.safeParseAsync(req);

  // const processedErrors = parseResult.error.issues.map((issue) => ({
  //   location: issue.path.join("."),
  //   message: issue.message,
  //   type: issue.code,
  // }));

  if (!parseResult.success) throw new Error(); // TODO: Change to standardized error
  return parseResult.data;
};

export { validate };
