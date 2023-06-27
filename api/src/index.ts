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
  "AWS_S3_IMAGE_BUCKET",
];

let anyMissing = false;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    logger.error(`Required environment variable ${envVar} is not set`);
    anyMissing = true;
  }
}

if (anyMissing) process.exit(0);

const start = async () => {
  logger.info("API Starting");
  if (RUNTIME_CONSTANTS.IS_DEV) logger.debug("Running in development mode");
  if (RUNTIME_CONSTANTS.IS_DEV && RUNTIME_CONSTANTS.CAN_SEND_EMAILS) logger.debug("Emails enabled");

  app.listen(API_PORT, () => {
    logger.info(`API listening on port ${API_PORT}`);

    if (RUNTIME_CONSTANTS.IS_DEV) {
      const localAddr = `http://localhost:${API_PORT}/`;
      const remoteAddr = `http://${ip.address()}:${API_PORT}/`;
      logger.debug(`Connect locally with ${localAddr}`);
      logger.debug(`Connect on another device with ${remoteAddr}`);
    }
  });
};

start();
