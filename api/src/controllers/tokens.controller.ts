import { APIBadRequestError, APIServerError, APIUnauthorizedError } from "../errors.js";
import logger from "../logging.js";
import { authenticateSchema, refreshAccessSchema } from "../schemas/tokens.schemas.js";
import { validate } from "../schemas/validation.js";
import * as MFAService from "../services/mfa.service.js";
import { verifyPassword } from "../services/passwords.service.js";
import {
  createAuthenticationRefreshToken,
  refreshAccessToken,
  signToken,
} from "../services/tokens.service.js";
import { getUser } from "../services/user.service.js";
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

  const user = await getUser({ email });
  const passwordsMatch = await verifyPassword(password, user.passwordHash);

  if (!passwordsMatch) {
    logger.info(`Failed authentication for user ${user.username}`, {
      ID: "FAILED_AUTHENTICATION",
      user: {
        username: user.username,
        uuid: user.uuid,
      },
      ip: req.realIp,
      requestId: req.id,
    });
    return next(authenticateFailError);
  }

  const userHasMFA = await MFAService.userHasMFA(user);
  if (userHasMFA) {
    if (!parsedRequest.body.totp)
      return next(new APIBadRequestError("MFA_REQUIRED", "An MFA pin is required."));
    const MFAMatch = await MFAService.verifyUserMFACode(user, parsedRequest.body.totp);
    if (!MFAMatch)
      return next(new APIUnauthorizedError("INVALID_MFA", "The MFA code provided was invalid."));
  }

  let refreshJWT: JWTRefreshToken;

  try {
    [refreshJWT] = await createAuthenticationRefreshToken(user, req.realIp);
  } catch (error) {
    logger.error("Failed to save refresh token", { ID: "PERSIST_REFRESH_TOKEN_FAIL" });
    logger.debug("Refresh token failed to generate", {
      ID: "GENERATE_REFRESH_TOKEN_FAIL",
      error: String(error),
    });
    return next(new APIServerError("SERVER_ERROR", "Failed to generate temporary credentials"));
  }

  const signedRefreshToken = signToken(refreshJWT);
  const signedAccessToken = await refreshAccessToken(signedRefreshToken, user.uuid);

  logger.info(`Successful authentication for user ${user.username}`, {
    ID: "SUCCESSFUL_AUTHENTICATION",
    username: user.username,
    ip: req.realIp,
    requestId: req.id,
  });

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
