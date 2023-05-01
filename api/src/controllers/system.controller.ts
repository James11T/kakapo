import { validate } from "../schemas/validation";
import { getSystemStatusSchema } from "../schemas/system.schemas";
import type { Request, Response, NextFunction } from "express";

// get /status
// Return the API status
const getSystemStatus = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = validate(getSystemStatusSchema, req);
};

export { getSystemStatus };
