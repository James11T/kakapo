import { RUNTIME_CONSTANTS } from "../config.js";
import { getSystemStatusSchema } from "../schemas/system.schemas.js";
import { validate } from "../schemas/validation.js";
import { getMemoryUsage } from "../utils/process.js";
import { asyncController } from "./base.controller.js";
import type { Request, Response, NextFunction } from "express";

const { PACKAGE_VERSION } = process.env;

// get /status
// Return the API status
const getSystemStatus = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  await validate(getSystemStatusSchema, req);

  return res.json({
    status: "ONLINE",
    version: PACKAGE_VERSION ?? "UNKNOWN",
    country: req.country,
    memoryUsage: RUNTIME_CONSTANTS.IS_DEV ? getMemoryUsage() : undefined,
  });
});

export { getSystemStatus };
