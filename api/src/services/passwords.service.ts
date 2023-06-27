import argon2 from "argon2";
import { HASHING_CONSTANTS, PASSWORD_RESET_CONSTANTS, WEB_CONSTANTS } from "../config.js";
import prisma from "../database.js";
import { APIBadRequestError, managePrismaError } from "../errors.js";
import logger from "../logging.js";
import { randomHex } from "../utils/strings.js";
import * as emailService from "./email.service.js";
import * as userService from "./user.service.js";
import type { User, UserPasswordReset } from "@prisma/client";

const hashingOptions = {
  type: HASHING_CONSTANTS.HASHING_FUNCTION,
  hashLength: HASHING_CONSTANTS.HASH_LENGTH_BYTES,
  saltLength: HASHING_CONSTANTS.SALT_SIZE_BYTES,
};

/**
 * Hash a password either with a generated salt.
 *
 * @param password A password to hash
 * @returns A password hash and salt
 */
const hashPassword = async (password: string): Promise<string> => {
  const hash = await argon2.hash(password, hashingOptions);
  return hash;
};

/**
 * Check that a password matches a given salt and hash.
 *
 * @param password A password to validate
 * @param hash A password hash to validate against
 * @returns True if the password is valid
 */
const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  const isValid = await argon2.verify(hash, password, hashingOptions);
  return isValid;
};

const requestPasswordReset = async (email: User["email"]) => {
  let user: User;
  try {
    user = await userService.getUser({ email });
  } catch (error) {
    logger.debug("request password failed to find user", { error: String(error) });
    return;
  }

  if (!user.emailVerified) {
    logger.debug("password reset attempted on non verified email", { email });
    return;
  }

  const token = randomHex(PASSWORD_RESET_CONSTANTS.tokenLength);

  const resetLink = `https://${WEB_CONSTANTS.DOMAIN}/reset-password?c=${token}`;

  await prisma.userPasswordReset.create({
    data: {
      userId: user.id,
      token,
      createdAt: new Date(),
    },
  });

  await emailService.sendTemplate(
    user.email,
    "resetPassword",
    { name: user.username, link: resetLink },
    { subject: "Password Reset Request" }
  );

  logger.info("password reset issued", { user: { uuid: user.uuid, username: user.username } });
};

const badResetTokenError = new APIBadRequestError(
  "INVALID_RESET_TOKEN",
  "The provided password reset token was invalid or has expired"
);

const resetPassword = async (resetToken: string, password: string) => {
  let dbResetToken: UserPasswordReset;
  try {
    dbResetToken = await prisma.userPasswordReset.findFirstOrThrow({
      where: {
        token: resetToken,
      },
    });
  } catch (error) {
    return managePrismaError(error, badResetTokenError);
  }

  const tokenAge = new Date().getTime() - dbResetToken.createdAt.getTime();
  if (tokenAge > PASSWORD_RESET_CONSTANTS.tokenTTL) {
    throw badResetTokenError;
  }

  const passwordHash = await hashPassword(password);

  await prisma.user.update({ where: { id: dbResetToken.userId }, data: { passwordHash } });
};

export { verifyPassword, hashPassword, requestPasswordReset, resetPassword };
