import { uuid } from "../utils/strings";
import { getEpoch } from "../utils/time";
import prisma from "../database";
import JWT from "jsonwebtoken";
import logger from "../logging";
import { REFRESH_TOKEN_CONSTANTS, ACCESS_TOKEN_CONSTANTS } from "../config";
import { APIServerError, APIUnauthorizedError } from "../errors";
import { getUserByUnique } from "./user.service";
import type { User, RefreshToken } from "@prisma/client";
import type { JWTRefreshToken, JWTAccessToken } from "../types";

const { JWT_SECRET } = process.env;

const signToken = (payload: any): string => {
  try {
    const token = JWT.sign(payload, JWT_SECRET, { algorithm: "HS256" });
    return token;
  } catch (err) {
    logger.error("Failed to sign token", { error: String(err) });
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
    logger.debug("JWT verify error", { error: String(error) });
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
  const user = await getUserByUnique({ uuid });

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
