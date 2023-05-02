import { Ok, Err } from "../errors/errorHandling";
import { uuid } from "../utils/strings";
import { getEpoch } from "../utils/time";
import prisma from "../database";
import JWT from "jsonwebtoken";
import { REFRESH_TOKEN_CONSTANTS, ACCESS_TOKEN_CONSTANTS } from "../config";
import type { User, RefreshToken } from "@prisma/client";
import type { JWTRefreshToken, JWTAccessToken, AsyncResult } from "../types";
import type { Result } from "../types";

const { JWT_SECRET } = process.env;

const signToken = (payload: any): Result<string, "SIGN_TOKEN_ERROR"> => {
  try {
    const token = JWT.sign(payload, JWT_SECRET);
    return Ok(token);
  } catch (err) {
    console.error(err);

    return Err("SIGN_TOKEN_ERROR");
  }
};

const decodeSignedToken = <T>(token: string): Result<T, "INVALID_TOKEN" | "TOKEN_EXPIRED"> => {
  try {
    const decoded = JWT.verify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    }) as T;

    return Ok(decoded);
  } catch (error) {
    if (error instanceof JWT.TokenExpiredError) return Err("TOKEN_EXPIRED");
    return Err("INVALID_TOKEN");
  }
};

type GENERATE_ACCESS_TOKEN_ERRORS =
  | "REFRESH_TOKEN_EXPIRED"
  | "FAILED_TO_GET_REFRESH_TOKEN"
  | "REFRESH_TOKEN_REVOKED"
  | "INVALID_REFRESH_TOKEN";

const generateAccessToken = async (
  user: User,
  refreshToken: JWTRefreshToken
): AsyncResult<JWTAccessToken, GENERATE_ACCESS_TOKEN_ERRORS> => {
  if (refreshToken.exp < getEpoch()) return Err("REFRESH_TOKEN_EXPIRED");

  let DBRefreshToken: RefreshToken | null;

  try {
    DBRefreshToken = await prisma.refreshToken.findUnique({
      where: { uuid: refreshToken.jti },
    });
  } catch {
    return Err("FAILED_TO_GET_REFRESH_TOKEN");
  }

  if (!DBRefreshToken) return Err("FAILED_TO_GET_REFRESH_TOKEN");

  if (DBRefreshToken.subjectId !== user.id) return Err("INVALID_REFRESH_TOKEN");

  if (DBRefreshToken.isRevoked) return Err("REFRESH_TOKEN_REVOKED");

  const now = getEpoch();

  const data: JWTAccessToken = {
    refresh_jti: DBRefreshToken.uuid,
    sub: user.uuid,
    exp: now + ACCESS_TOKEN_CONSTANTS.TOKEN_TTL,
    iat: now,
  };

  return Ok(data);
};

const generateRefreshToken = async (
  user: User,
  scope: string
): Promise<[JWTRefreshToken, string]> => {
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
