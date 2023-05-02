import winston from "winston";
import { RUNTIME_CONSTANTS } from "./config";

const logger = winston.createLogger({
  level: "info",
  transports: [
    new winston.transports.File({
      filename: "logs/combined.log",
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
    new winston.transports.File({
      filename: "logs/error.log",
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      level: "error",
    }),
  ],
});

if (RUNTIME_CONSTANTS.IS_DEV) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
      level: "debug",
    })
  );
}

export default logger;
