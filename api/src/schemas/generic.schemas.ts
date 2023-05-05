import { z } from "zod";
import { USERNAME_CONSTANTS, PASSWORD_CONSTANTS } from "../config.js";

const username = z
  .string()
  .trim()
  .min(USERNAME_CONSTANTS.minUsernameLength)
  .max(USERNAME_CONSTANTS.maxUsernameLength)
  .regex(USERNAME_CONSTANTS.matchRegex);

const totp = z.string().length(6);

const password = z
  .string()
  .min(PASSWORD_CONSTANTS.minPasswordLength)
  .max(PASSWORD_CONSTANTS.maxPasswordLength);

const paginationFrom = z.coerce.number().min(0).optional();
const paginationCount = z.coerce.number().min(0).max(100).optional();

const pagination = z.object({
  from: paginationFrom,
  count: paginationCount,
});

export { totp, username, password, pagination };
