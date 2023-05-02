import prisma from "../database";
import logger from "../logging";
import { decodeSignedToken } from "../services/tokens.service";
import { APIUnauthorizedError } from "../errors";
import { asyncController } from "../controllers/base.controller";
import type { JWTAccessToken } from "../types";
import type { Request, Response, NextFunction } from "express";
import type { User } from "@prisma/client";

const authenticate = asyncController(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let accessToken = req.headers.authorization;
    if (!accessToken || !accessToken.length) return next();

    if (accessToken.startsWith("Bearer ")) accessToken = accessToken.slice(7); // If the auth starts with Bearer, remove it

    const decodedToken = decodeSignedToken<JWTAccessToken>(accessToken);

    const user = await prisma.user.findFirst({ where: { uuid: decodedToken.sub } });
    if (!user) {
      logger.info("Access token with unknown subject was submitted");
      return next(new APIUnauthorizedError("UNAUTHORIZED", "Failed to access token subject user."));
    }

    req.user = user;
    next();
  }
);

function protect<T extends User>(user: T | undefined): asserts user is T {
  if (!user) throw new APIUnauthorizedError();
}

export { authenticate, protect };
