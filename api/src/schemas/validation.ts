import type { z } from "zod";
import type { Request } from "express";
import type { ValidationSchema } from "../types";
import { APIParameterError } from "../errors";

const validate = async <T extends ValidationSchema>(
  schema: T,
  req: Request
): Promise<z.infer<T>> => {
  const parseResult = await schema.safeParseAsync(req);

  if (!parseResult.success) {
    const processedErrors = parseResult.error.issues.map((issue) => ({
      location: issue.path.join("."),
      message: issue.message,
      type: issue.code,
    }));
    throw new APIParameterError(processedErrors);
  }
  return parseResult.data;
};

export { validate };
