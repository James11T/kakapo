import { uuid } from "../utils/strings";
import { getEpoch } from "../utils/time";
import prisma from "../database";
import JWT from "jsonwebtoken";
import { REFRESH_TOKEN_CONSTANTS, ACCESS_TOKEN_CONSTANTS } from "../config";
import type { User, RefreshToken } from "@prisma/client";
import type { JWTRefreshToken, JWTAccessToken } from "../types";
import logger from "../logging";
import { APIServerError, APIUnauthorizedError } from "../errors";

const { JWT_SECRET } = process.env;

const signToken = (payload: any): string => {
  try {
    const token = JWT.sign(payload, JWT_SECRET);
    return token;
  } catch (err) {
    logger.error(err);
    throw new APIServerError();
  }
};

const decodeSignedToken = <T>(token: string): T => {
  try {
    const decoded = JWT.verify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    }) as T;

    return decoded;
  } catch (error) {
    if (error instanceof JWT.TokenExpiredError)
      throw new APIUnauthorizedError("TOKEN_EXPIRED", "The supplied JWT had expired.");
    throw new APIUnauthorizedError("INVALID_TOKEN", "The supplied JWT was invalid.");
  }
};

type GENERATE_ACCESS_TOKEN_ERRORS =
  | "REFRESH_TOKEN_EXPIRED"
  | "FAILED_TO_GET_REFRESH_TOKEN"
  | "REFRESH_TOKEN_REVOKED"
  | "INVALID_REFRESH_TOKEN";

const invalidRefreshTokenError = new APIUnauthorizedError(
  "INVALID_REFRESH_TOKEN",
  "The provided token is malformed or invalid."
);

const generateAccessToken = async (
  user: User,
  refreshToken: JWTRefreshToken
): Promise<JWTAccessToken> => {
  if (refreshToken.exp < getEpoch())
    throw new APIUnauthorizedError(
      "REFRESH_TOKEN_EXPIRED",
      "The supplied refresh JWT had expired."
    );

  const DBRefreshToken = await prisma.refreshToken.findUnique({
    where: { uuid: refreshToken.jti },
  });

  if (!DBRefreshToken) {
    throw invalidRefreshTokenError;
  }
  if (DBRefreshToken.subjectId !== user.id) {
    logger.warn("refresh token was attempted to be used on the wrong user", {
      user: user.username,
      id: user.id,
      uuid: user.uuid,
    });
    throw invalidRefreshTokenError;
  }
  if (DBRefreshToken.isRevoked) {
    throw invalidRefreshTokenError;
  }

  const now = getEpoch();

  const data: JWTAccessToken = {
    refresh_jti: DBRefreshToken.uuid,
    sub: user.uuid,
    exp: now + ACCESS_TOKEN_CONSTANTS.TOKEN_TTL,
    iat: now,
  };

  return data;
};

const generateRefreshToken = (user: User, scope: string): [JWTRefreshToken, string] => {
  const tokenId = uuid();
  const now = getEpoch();

  const data = {
    jti: tokenId,
    sub: user.uuid,
    iat: now,
    exp: now + REFRESH_TOKEN_CONSTANTS.TOKEN_TTL,
    scp: scope,
  };

  return [data, tokenId];
};

export { generateAccessToken, generateRefreshToken, signToken, decodeSignedToken };
