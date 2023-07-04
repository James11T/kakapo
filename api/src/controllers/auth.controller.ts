import logger from "../logging.js";
import { protect } from "../middleware/auth.middleware.js";
import {
  activateMfaSourceSchema,
  addMfaSourceSchema,
  getMfaStatusSchema,
  mfaSourceFilterSchema,
  removeMfaSourceSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
  whoAmISchema,
} from "../schemas/auth.schemas.js";
import { privateUserFilterSchema } from "../schemas/users.schemas.js";
import { validate } from "../schemas/validation.js";
import * as MFAService from "../services/mfa.service.js";
import * as passwordsService from "../services/passwords.service.js";
import { filter } from "../utils/objects.js";
import { asyncController } from "./base.controller.js";
import type { Request, Response, NextFunction } from "express";

// GET /whoami
// Return authenticated user
const whoAmI = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  protect(req);
  await validate(whoAmISchema, req);

  return res.json(filter(req.user, privateUserFilterSchema));
});

// GET /mfa
// Get MFA status
const getMfaStatus = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  protect(req);
  await validate(getMfaStatusSchema, req);

  const mfaSources = await MFAService.getMFASources(req.user);

  return res.json({
    anyActive: mfaSources.some((mfaSource) => mfaSource.activated),
    sources: mfaSources.map((mfaSource) => filter(mfaSource, mfaSourceFilterSchema)),
  });
});

// POST /mfa
// Add MFA source
const addMfaSource = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  protect(req);
  const parsedRequest = await validate(addMfaSourceSchema, req);

  const mfaDetails = await MFAService.createMFASource(req.user, parsedRequest.body.name);

  return res.json(mfaDetails);
});

// PATCH /mfa/:mfaId
// Activate MFA source
const activateMfaSource = asyncController(
  async (req: Request, res: Response, next: NextFunction) => {
    protect(req);
    const parsedRequest = await validate(activateMfaSourceSchema, req);

    const mfaSource = await MFAService.getMFASource(req.user, { uuid: parsedRequest.params.mfaId });

    await MFAService.activateMFASource(mfaSource, parsedRequest.body.totp);

    return res.sendStatus(204);
  }
);

// DELETE /mfa/:mfaId
// Remove MFA source
const removeMfaSource = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  protect(req);
  const parsedRequest = await validate(removeMfaSourceSchema, req);

  const mfaSource = await MFAService.getMFASource(req.user, { uuid: parsedRequest.params.mfaId });
  await MFAService.removeMFASource(mfaSource, parsedRequest.body.totp);

  return res.sendStatus(204);
});

// POST /request-password-reset
// Invoke a password reset
const requestPasswordReset = asyncController(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsedRequest = await validate(requestPasswordResetSchema, req);

    try {
      passwordsService.requestPasswordReset(parsedRequest.body.email);
    } catch (error) {
      logger.error("Failed to send password reset", {
        ID: "PASSWORD_RESET_FAIL",
        error: String(error),
      });
    }

    return res.sendStatus(204);
  }
);

// POST /reset-password
// Reset users password
const resetPassword = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(resetPasswordSchema, req);

  passwordsService.resetPassword(parsedRequest.body.resetToken, parsedRequest.body.password);

  return res.sendStatus(204);
});

export {
  whoAmI,
  getMfaStatus,
  addMfaSource,
  activateMfaSource,
  removeMfaSource,
  requestPasswordReset,
  resetPassword,
};
