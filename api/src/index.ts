import "dotenv/config";
import ip from "ip";
import chalk from "chalk";
import app from "./app";
import { RUNTIME_CONSTANTS } from "./config";
import format from "./utils/console";

const { API_PORT } = process.env;

const requiredEnvVars = [
  "API_PORT",
  "JWT_SECRET",
  "DATABASE_URL",
  "WEB_DOMAIN",
  "AWS_REGION",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_S3_IMAGE_BUCKET",
];

let anyMissing = false;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(format.fail(`Required environment variable ${chalk.bold(envVar)} is not set.`));
    anyMissing = true;
  }
}

if (anyMissing) process.exit(0);

const start = async () => {
  console.log(format.waiting("Starting..."));
  if (RUNTIME_CONSTANTS.IS_DEV) console.log(format.dev("Running in development mode"));

  app.listen(API_PORT, () => {
    const localAddr = `http://localhost:${API_PORT}/`;
    const remoteAddr = `http://${ip.address()}:${API_PORT}/`;

    console.log(`\n${chalk.green("●")} Server is running on port ${chalk.blue.bold(API_PORT)}`);
    console.log(`   Connect locally with ${format.link(localAddr)}`);
    console.log(`   Or on another device with ${format.link(remoteAddr)}`);
  });
};

start();
