import { validate } from "../schemas/validation";
import { authenticateSchema, refreshAccessSchema } from "../schemas/tokens.schemas";
import type { Request, Response, NextFunction } from "express";

// post /authenticate
// Authenticate with a given username and password
const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(authenticateSchema, req);
};

// post /refresh
// Refresh an access token with a refresh token
const refreshAccess = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(refreshAccessSchema, req);
};

export { authenticate, refreshAccess };
