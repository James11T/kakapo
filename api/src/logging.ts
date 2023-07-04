import winston from "winston";
import { RUNTIME_CONSTANTS } from "./config.js";

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
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
      level: RUNTIME_CONSTANTS.IS_DEV ? "debug" : "info",
    }),
  ],
});

export default logger;
