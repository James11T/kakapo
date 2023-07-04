import "dotenv/config";
import ip from "ip";
import app from "./app.js";
import { RUNTIME_CONSTANTS } from "./config.js";
import logger from "./logging.js";

const { API_PORT } = process.env;

const requiredEnvVars = [
  "API_PORT",
  "JWT_SECRET",
  "DATABASE_URL",
  "AWS_REGION",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "MEDIA_BUCKET_NAME",
  "MODERATION_OUTPUT_TABLE_NAME",
];

let anyMissing = false;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    logger.crit(`Required environment variable ${envVar} is not set`, { ID: "BAD_ENV" });
    anyMissing = true;
  }
}

if (anyMissing) process.exit(0);

const start = async () => {
  logger.info("API Starting", { ID: "START" });
  if (RUNTIME_CONSTANTS.IS_DEV) logger.debug("Running in development mode", { ID: "START_DEBUG" });
  if (RUNTIME_CONSTANTS.IS_DEV && RUNTIME_CONSTANTS.CAN_SEND_EMAILS)
    logger.debug("Emails enabled", { ID: "EMAILS_ENABLED" });

  app.listen(API_PORT, () => {
    logger.info(`API listening on port ${API_PORT}`, { ID: "API_LISTENING" });

    if (RUNTIME_CONSTANTS.IS_DEV) {
      const localAddr = `http://localhost:${API_PORT}/`;
      const remoteAddr = `http://${ip.address()}:${API_PORT}/`;
      logger.debug(`Connect locally with ${localAddr}`, { ID: "LOCAL_ADDR" });
      logger.debug(`Connect on another device with ${remoteAddr}`, { ID: "REMOTE_ADDR" });
    }
  });
};

start();
