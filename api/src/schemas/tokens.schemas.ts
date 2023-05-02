import { z } from "zod";
import { password } from "./generic.schemas";

// post /authenticate
// Authenticate with a given username and password
const authenticateSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: password,
  }),
});

// post /refresh
// Refresh an access token with a refresh token
const refreshAccessSchema = z.object({
  body: z.object({
    refreshToken: z.string(),
    user: z.string().uuid(),
  }),
});

export { authenticateSchema, refreshAccessSchema };
