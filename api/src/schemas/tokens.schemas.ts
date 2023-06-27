import { z } from "zod";
import { password } from "./generic.schemas.js";

// post /authenticate
// Authenticate with a given username and password
const authenticateSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: password,
    totp: z.string().optional(),
  }),
});

// post /refresh
// Refresh an access token with a refresh token
const refreshAccessSchema = z.object({
  body: z.object({
    refreshToken: z.string(),
    user: z.string(),
  }),
});

export { authenticateSchema, refreshAccessSchema };
