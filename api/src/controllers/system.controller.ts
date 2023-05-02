import { validate } from "../schemas/validation";
import { getSystemStatusSchema } from "../schemas/system.schemas";
import { asyncController } from "./base.controller";
import { getMemoryUsage } from "../utils/process";
import { RUNTIME_CONSTANTS } from "../config";
import type { Request, Response, NextFunction } from "express";

const fail = async () => {
  throw new Error("A new error");
};

// get /status
// Return the API status
const getSystemStatus = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(getSystemStatusSchema, req);
  await fail();

  return res.json({
    status: "ONLINE",
    version: process.env.npm_package_version ?? "UNKNOWN",
    country: req.country,
    memoryUsage: RUNTIME_CONSTANTS.IS_DEV ? getMemoryUsage() : undefined,
  });
});

export { getSystemStatus };
