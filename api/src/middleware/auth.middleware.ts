import prisma from "../database";
import { decodeSignedToken } from "../services/tokens.service";
import { APIUnauthorizedError } from "../errors/api";
import type { JWTAccessToken } from "../types";
import type { Request, Response, NextFunction } from "express";
import type { User } from "@prisma/client";

const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let accessToken = req.headers.authorization;
  if (!accessToken || !accessToken.length) return next();

  if (accessToken.startsWith("Bearer ")) accessToken = accessToken.slice(7); // If the auth starts with Bearer, remove it

  const decoded = decodeSignedToken<JWTAccessToken>(accessToken);
  if (decoded.err)
    return next(
      new APIUnauthorizedError("MALFORMED_TOKEN", "The supplied access token was malformed.")
    );

  const user = await prisma.user.findFirst({ where: { uuid: decoded.val.sub } });
  if (!user)
    return next(new APIUnauthorizedError("UNAUTHORIZED", "Failed to access token subject user."));

  req.user = user;
  next();
};

function protect<T extends User>(user: T | undefined): asserts user is T {
  if (!user) throw new APIUnauthorizedError();
}

export { authenticate, protect };
