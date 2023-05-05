import { asyncController } from "../controllers/base.controller.js";
import prisma from "../database.js";
import { APIUnauthorizedError } from "../errors.js";
import logger from "../logging.js";
import { decodeSignedToken } from "../services/tokens.service.js";
import type { JWTAccessToken } from "../types.js";
import type { User } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";

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
    console.log(user);
    next();
  }
);

function protect<T extends { user: User }>(req: Partial<T>): asserts req is T {
  if (!req.user) throw new APIUnauthorizedError();
}

export { authenticate, protect };
