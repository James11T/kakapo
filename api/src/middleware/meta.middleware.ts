import logger from "../logging";
import { IPToCountry } from "../utils/ip";
import { isDevelopmentEnv, DEPLOYMENT_CONSTANTS } from "../config";
import type { Request, Response, NextFunction } from "express";

const setRealIp = (req: Request, res: Response, next: NextFunction) => {
  let ip = DEPLOYMENT_CONSTANTS.REAL_IP_HEADER
    ? req.header(DEPLOYMENT_CONSTANTS.REAL_IP_HEADER)
    : req.ip;

  if (isDevelopmentEnv && req.header("x-test-ip")) ip = ip ?? req.header("x-test-ip");

  req.realIp = ip ?? req.ip;
  next();
};

// Attempt to get the country code from the request IP address
const setRequestCountry = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.realIp;

  const countryCode = req.header("CF-IPCountry") ?? IPToCountry(ip);
  req.country = countryCode;

  next();
};

const logRequest = (req: Request, res: Response, next: NextFunction) => {
  res.on("finish", () => {
    logger.log({
      level: res.statusCode < 400 ? "info" : "error",
      message: "HTTP request",
      method: req.method,
      url: req.originalUrl,
      ip: req.realIp,
      user: req.user?.username ?? null,
      status: res.statusCode,
    });
  });
  next();
};

const setRequestMetadata = [setRealIp, setRequestCountry];

export { setRealIp, logRequest };
export default setRequestMetadata;
