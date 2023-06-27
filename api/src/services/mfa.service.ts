import { totp, authenticator } from "otplib";
import qr from "qrcode";
import { TOTP_CONSTANTS } from "../config.js";
import prisma from "../database.js";
import { APIConflictError, APINotFoundError, APIUnauthorizedError } from "../errors.js";
import { uuid } from "../utils/strings.js";
import { getUserID, hydrateUser } from "./user.service.js";
import type { UniqueUser } from "./user.service.js";
import type { ID, RequireKey, UUID } from "../types.js";
import type { UserTOTP } from "@prisma/client";

type UniqueUserTOTPKeys = { id: ID; uuid: UUID };
type UniqueUserTOTP = RequireKey<UniqueUserTOTPKeys> & Partial<UserTOTP>;

const invalidMFACodeError = new APIUnauthorizedError(
  "INVALID_MFA_CODE",
  "The provided MFA code was invalid."
);

const createMFASource = async (user: UniqueUser, name: string) => {
  const hydratedUser = await hydrateUser(user, ["id", "email"]);

  const secret = authenticator.generateSecret();

  const dbMfa = await prisma.userTOTP.create({
    data: {
      uuid: uuid(),
      name,
      secret,
      userId: hydratedUser.id,
    },
  });

  const appUrl = authenticator.keyuri(hydratedUser.email, TOTP_CONSTANTS.SERVICE, secret);

  return { secret, appUrl, uuid: dbMfa.uuid };
};

const verifyMFACode = (mfaSource: UserTOTP, code: string) => {
  return totp.check(code, mfaSource.secret);
};

const verifyUserMFACode = async (user: UniqueUser, code: string, allowDeactivated = false) => {
  const id = await getUserID(user);

  const TOTPs = await prisma.userTOTP.findMany({
    where: { id },
    select: { secret: true, activated: true },
  });

  return TOTPs.some(
    (userTOTP) => (allowDeactivated || userTOTP.activated) && totp.check(code, userTOTP.secret)
  );
};

const getMFASources = async (user: UniqueUser) => {
  const TOTPs = await prisma.userTOTP.findMany({ where: { user } });

  return TOTPs;
};

const getMFASource = async (user: UniqueUser, userTotp: UniqueUserTOTP) => {
  const TOTPs = await prisma.userTOTP.findFirst({ where: { user, ...userTotp } });

  if (!TOTPs)
    throw new APINotFoundError(
      "SOURCE_NOT_FOUND",
      "No MFA source was found that matches the given criteria."
    );

  return TOTPs;
};

const activateMFASource = async (mfaSource: UserTOTP, code: string) => {
  if (mfaSource.activated)
    throw new APIConflictError(
      "SOURCE_ALREADY_ACTIVE",
      "The MFA source provided was already activated."
    );

  if (!authenticator.check(code, mfaSource.secret)) throw invalidMFACodeError;

  await prisma.userTOTP.update({ where: { id: mfaSource.id }, data: { activated: true } });
};

const removeMFASource = async (mfaSource: UserTOTP, code: string) => {
  if (!mfaSource.activated)
    throw new APIConflictError(
      "SOURCE_NOT_ACTIVE",
      "The MFA source provided has not bee activated."
    );

  if (!authenticator.check(code, mfaSource.secret)) throw invalidMFACodeError;

  await prisma.userTOTP.delete({ where: { id: mfaSource.id } });
};

const generateQR = async (appUrl: string) => {
  const image = await qr.toDataURL(appUrl);
  return image;
};

const userHasMFA = async (user: UniqueUser) => {
  const userMFA = await prisma.userTOTP.findFirst({ where: { user } });
  return Boolean(userMFA);
};

export {
  createMFASource,
  getMFASource,
  activateMFASource,
  removeMFASource,
  verifyMFACode,
  generateQR,
  verifyUserMFACode,
  userHasMFA,
  getMFASources,
};
