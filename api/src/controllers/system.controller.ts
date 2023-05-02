import { RUNTIME_CONSTANTS } from "../config";
import { getSystemStatusSchema } from "../schemas/system.schemas";
import { validate } from "../schemas/validation";
import { getMemoryUsage } from "../utils/process";
import { asyncController } from "./base.controller";
import type { Request, Response, NextFunction } from "express";

// get /status
// Return the API status
const getSystemStatus = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(getSystemStatusSchema, req);

  return res.json({
    status: "ONLINE",
    version: process.env.npm_package_version ?? "UNKNOWN",
    country: req.country,
    memoryUsage: RUNTIME_CONSTANTS.IS_DEV ? getMemoryUsage() : undefined,
  });
});

export { getSystemStatus };
