import { nanoid } from "nanoid";
import { isDevelopmentEnv, DEPLOYMENT_CONSTANTS } from "../config";
import logger from "../logging";
import { IPToCountry } from "../utils/ip";
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
  const httpLogBase = {
    method: req.method,
    url: req.originalUrl,
    ip: req.realIp,
    requestId: req.id,
  };

  logger.info({ ...httpLogBase, message: "HTTP request started" });

  res.on("finish", () => {
    logger.log({
      ...httpLogBase,
      level: res.statusCode < 400 ? "info" : "error",
      message: "HTTP request finished",
      status: res.statusCode,
      user: req.user ? { username: req.user.username, id: req.user.id, uuid: req.user.id } : null,
    });
  });
  next();
};

const setRequestId = (req: Request, res: Response, next: NextFunction) => {
  req.id = nanoid();
  return next();
};

const setRequestMetadata = [setRequestId, setRealIp, setRequestCountry];

export { setRealIp, logRequest, setRequestId };
export default setRequestMetadata;
