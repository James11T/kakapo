import JWT from "jsonwebtoken";
import { REFRESH_TOKEN_CONSTANTS, ACCESS_TOKEN_CONSTANTS } from "../config.js";
import prisma from "../database.js";
import { APIServerError, APIUnauthorizedError } from "../errors.js";
import logger from "../logging.js";
import { uuid } from "../utils/strings.js";
import { getEpoch } from "../utils/time.js";
import { getUser } from "./user.service.js";
import type { JWTRefreshToken, JWTAccessToken } from "../types.js";
import type { User, RefreshToken } from "@prisma/client";

const { JWT_SECRET } = process.env;

const signToken = (payload: any): string => {
  try {
    const token = JWT.sign(payload, JWT_SECRET, { algorithm: "HS256" });
    return token;
  } catch (err) {
    logger.error("Failed to sign token", { ID: "JWT_SIGN_FAIL", error: String(err) });
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
    logger.debug("JWT verify error", { ID: "JWT_VERIFY_FAIL", error: String(error) });
    if (error instanceof JWT.TokenExpiredError)
      throw new APIUnauthorizedError("TOKEN_EXPIRED", "The supplied JWT had expired.");
    throw new APIUnauthorizedError("INVALID_TOKEN", "The supplied JWT was invalid.");
  }
};

const invalidRefreshTokenError = new APIUnauthorizedError(
  "INVALID_REFRESH_TOKEN",
  "The provided token is malformed or invalid."
);

const generateAccessToken = async (
  user: User,
  refreshToken: JWTRefreshToken
): Promise<JWTAccessToken> => {
  const DBRefreshToken = await prisma.refreshToken.findUnique({
    where: { uuid: refreshToken.jti },
  });

  if (!DBRefreshToken) {
    throw invalidRefreshTokenError;
  }

  if (DBRefreshToken.subjectId !== user.id) {
    logger.warn("Refresh token was attempted to be used on the wrong user", {
      ID: "REFRESH_TOKEN_USER_MISMATCH_FAIL",
      user: user.username,
      uuid: user.uuid,
    });
    throw invalidRefreshTokenError;
  }

  if (DBRefreshToken.isRevoked) {
    throw invalidRefreshTokenError;
  }

  const now = getEpoch({ truncate: true });

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

const createAuthenticationRefreshToken = async (
  user: User,
  ip: string
): Promise<[JWTRefreshToken, RefreshToken]> => {
  const [refreshToken, refreshTokenId] = generateRefreshToken(user, "auth");

  const dbRefreshToken = await prisma.refreshToken.create({
    data: {
      uuid: refreshTokenId,
      subjectId: user.id,
      expiresAt: new Date(getEpoch() + REFRESH_TOKEN_CONSTANTS.TOKEN_TTL),
      issuedAt: new Date(),
      deviceType: "UNKNOWN",
      sourceIp: ip,
    },
  });

  return [refreshToken, dbRefreshToken];
};

const refreshAccessToken = async (refreshToken: string, uuid: string) => {
  const user = await getUser({ uuid });

  const refreshJWT = decodeSignedToken<JWTRefreshToken>(refreshToken);

  if (refreshJWT.sub !== user.uuid) throw invalidRefreshTokenError;

  const accessToken = await generateAccessToken(user, refreshJWT);
  const accessJWT = signToken(accessToken);

  return accessJWT;
};

export {
  generateAccessToken,
  generateRefreshToken,
  signToken,
  decodeSignedToken,
  createAuthenticationRefreshToken,
  refreshAccessToken,
};
