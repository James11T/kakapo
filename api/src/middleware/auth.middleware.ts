import { asyncController } from "../controllers/base.controller.js";
import { APIUnauthorizedError } from "../errors.js";
import { decodeSignedToken } from "../services/tokens.service.js";
import { getUserByUnique } from "../services/user.service.js";
import type { JWTAccessToken } from "../types.js";
import type { User } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";

const authenticate = asyncController(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let accessToken = req.headers.authorization;
    if (!accessToken || !accessToken.length) return next();

    if (accessToken.startsWith("Bearer ")) accessToken = accessToken.slice(7); // If the auth starts with Bearer, remove it

    let decodedToken: JWTAccessToken;
    try {
      decodedToken = decodeSignedToken<JWTAccessToken>(accessToken);
    } catch {
      return next(
        new APIUnauthorizedError(
          "INVALID_ACCESS_TOKEN",
          "The provided access token was invalid or had expired."
        )
      );
    }

    const user = await getUserByUnique({ uuid: decodedToken.sub });

    req.user = user;
    next();
  }
);

function protect<T extends { user: User }>(req: Partial<T>): asserts req is T {
  if (!req.user) throw new APIUnauthorizedError();
}

export { authenticate, protect };
