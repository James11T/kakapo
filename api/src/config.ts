import argon2 from "argon2";
import bytes from "bytes";
import { duration } from "./utils/time.js";

const { NODE_ENV = "PRODUCTION", DEV_SEND_EMAILS, DEV_BYPASS_AUTH } = process.env;

const isDevelopmentEnv = (NODE_ENV ?? "").toUpperCase().trim() === "DEVELOPMENT";
const sendEmailsInDev = (DEV_SEND_EMAILS ?? "").toUpperCase().trim() === "TRUE";
const bypassAuth = isDevelopmentEnv && (DEV_BYPASS_AUTH ?? "").toUpperCase().trim() === "TRUE";

export const SERVER_CONSTANTS = {
  RESPONSE_TIMEOUT: duration.seconds(10),
};

export const HASHING_CONSTANTS = {
  SALT_SIZE_BYTES: 16,
  HASH_LENGTH_BYTES: 32,
  HASHING_FUNCTION: argon2.argon2id,
};

export const PASSWORD_CONSTANTS = {
  minPasswordLength: 8,
  maxPasswordLength: 256,
};

export const USERNAME_CONSTANTS = {
  minUsernameLength: 3,
  maxUsernameLength: 32,
  matchRegex: /^(?=.{3,32}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/,
};

export const RUNTIME_CONSTANTS = {
  IS_DEV: isDevelopmentEnv,
  CAN_SEND_EMAILS: !isDevelopmentEnv || (isDevelopmentEnv && sendEmailsInDev),
};

export const WEB_CONSTANTS = {
  DOMAIN: "kakaposocial.com",
  MAIL_SUBDOMAIN: "mail",
  MEDIA_SUBDOMAIN: "media",
};

export const PASSWORD_RESET_CONSTANTS = {
  tokenTTL: duration.hours(1, "ms"),
  tokenLength: 64,
};

export const POST_CONSTANTS = {
  MAX_MEDIA_COUNT: 8,
  MAX_MEDIA_SIZE: bytes.parse("50MB"),
  SIGNED_URL_TTL: duration.minutes(1, "ms"),
};

export const REFRESH_TOKEN_CONSTANTS = {
  TOKEN_TTL: duration.days(60, "sec"),
};

export const ACCESS_TOKEN_CONSTANTS = {
  TOKEN_TTL: duration.hours(1, "sec"),
};

export const TOTP_CONSTANTS = {
  SERVICE: "Kakapo",
};

export const DEPLOYMENT_CONSTANTS = {
  REAL_IP_HEADER: "CF-Connecting-IP",
  COUNTRY_HEADER: "CF-IPCountry",
} as Record<string, string | undefined>;

export const DATA_CONSTANTS = {
  PAGINATION_TAKE_DEFAULT: 20,
  PAGINATION_TAKE_MAXIMUM: 100,
};

export { isDevelopmentEnv, bypassAuth };
