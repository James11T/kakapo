import { bypassAuth } from "../config.js";
import { asyncController } from "../controllers/base.controller.js";
import { APIBadRequestError, APINotFoundError, APIUnauthorizedError } from "../errors.js";
import logger from "../logging.js";
import * as cognitoService from "../services/cognito.service.js";
import * as userService from "../services/user.service.js";
import type { User } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";

const authenticate = asyncController(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (bypassAuth) return next();

    let accessToken = req.headers.authorization;
    if (!accessToken || !accessToken.length) return next();

    if (accessToken.startsWith("Bearer ")) accessToken = accessToken.slice(7); // If the auth starts with Bearer, remove it

    const awsUser = await cognitoService.getCognitoUser(accessToken);

    try {
      const dbUser = await userService.getUser({ uuid: awsUser.uuid });

      req.user = dbUser;
    } catch (error) {
      if (error instanceof APINotFoundError) {
        logger.info(`Creating new DB user with uuid ${awsUser.uuid}`, { ID: "NEW_DB_USER" });

        const dbUser = await userService.createUser(awsUser.uuid, awsUser.email);

        req.user = dbUser;
        return next();
      }
      return next(error);
    }

    next();
  }
);

function protect<T extends { user: User }>(
  req: Partial<T>,
  allowUninitiated = false
): asserts req is T {
  if (!req.user) throw new APIUnauthorizedError();
  if (!req.user.initiated && !allowUninitiated)
    throw new APIBadRequestError(
      "USER_NOT_INITIATED",
      "You must initiate your profile before continuing."
    );
}

export { authenticate, protect };
