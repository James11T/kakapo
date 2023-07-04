import { z } from "zod";
import { USERNAME_CONSTANTS, DATA_CONSTANTS } from "../config.js";

const username = z.string().trim().regex(USERNAME_CONSTANTS.matchRegex);

const totp = z.string().length(6);

const paginationFrom = z.coerce.number().min(0).optional();
const paginationCount = z.coerce
  .number()
  .min(0)
  .max(DATA_CONSTANTS.PAGINATION_TAKE_MAXIMUM)
  .optional();

const pagination = z.object({
  from: paginationFrom,
  count: paginationCount,
});

export { totp, username, pagination };
