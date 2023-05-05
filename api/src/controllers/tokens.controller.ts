import { APIBadRequestError, APIServerError } from "../errors.js";
import logger from "../logging.js";
import { authenticateSchema, refreshAccessSchema } from "../schemas/tokens.schemas.js";
import { validate } from "../schemas/validation.js";
import { verifyPassword } from "../services/passwords.service.js";
import {
  createAuthenticationRefreshToken,
  refreshAccessToken,
  signToken,
} from "../services/tokens.service.js";
import { getUserByUnique } from "../services/user.service.js";
import { asyncController } from "./base.controller.js";
import type { JWTRefreshToken } from "../types.js";
import type { Request, Response, NextFunction } from "express";

const authenticateFailError = new APIBadRequestError(
  "INVALID_CREDENTIALS",
  "The provided credentials are unknown or incorrect"
);

// post /authenticate
// Authenticate with a given username and password
const authenticate = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(authenticateSchema, req);

  const { email, password } = parsedRequest.body;

  const user = await getUserByUnique({ email });
  const passwordsMatch = await verifyPassword(password, user.passwordHash);
  if (!passwordsMatch) return next(authenticateFailError);

  let refreshJWT: JWTRefreshToken;

  try {
    [refreshJWT] = await createAuthenticationRefreshToken(user, req.realIp);
  } catch (error) {
    logger.error("Failed to save refresh token");
    logger.debug("Refresh token failed to generate", { error: String(error) });
    return next(new APIServerError("SERVER_ERROR", "Failed to generate temporary credentials"));
  }

  const signedRefreshToken = signToken(refreshJWT);
  const signedAccessToken = await refreshAccessToken(signedRefreshToken, user.uuid);

  return res.json({ accessToken: signedAccessToken, refreshToken: signedRefreshToken });
});

// post /refresh
// Refresh an access token with a refresh token
const refreshAccess = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(refreshAccessSchema, req);

  const signedAccessToken = await refreshAccessToken(
    parsedRequest.body.refreshToken,
    parsedRequest.body.user
  );

  return res.json({
    accessToken: signedAccessToken,
  });
});

export { authenticate, refreshAccess };
