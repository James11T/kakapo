import { validate } from "../schemas/validation";
import { authenticateSchema, refreshAccessSchema } from "../schemas/tokens.schemas";
import { asyncController } from "./base.controller";
import type { Request, Response, NextFunction } from "express";

// post /authenticate
// Authenticate with a given username and password
const authenticate = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(authenticateSchema, req);

  const { email, password } = parsedRequest.body;

  // const user = await getUser({})
});

// post /refresh
// Refresh an access token with a refresh token
const refreshAccess = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(refreshAccessSchema, req);
});

export { authenticate, refreshAccess };
