import { protect } from "../middleware/auth.middleware.js";
import {
  activateMfaSourceSchema,
  addMfaSourceSchema,
  getMfaStatusSchema,
  removeMfaSourceSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
  whoAmISchema,
} from "../schemas/auth.schemas.js";
import { privateUserFilterSchema } from "../schemas/users.schemas.js";
import { validate } from "../schemas/validation.js";
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
  const parsedRequest = await validate(getMfaStatusSchema, req);
});

// POST /mfa
// Add MFA source
const addMfaSource = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  protect(req);
  const parsedRequest = await validate(addMfaSourceSchema, req);
});

// PATCH /mfa/:mfaId
// Activate MFA source
const activateMfaSource = asyncController(
  async (req: Request, res: Response, next: NextFunction) => {
    protect(req);
    const parsedRequest = await validate(activateMfaSourceSchema, req);
  }
);

// DELETE /mfa/:mfaId
// Remove MFA source
const removeMfaSource = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  protect(req);
  const parsedRequest = await validate(removeMfaSourceSchema, req);
});

// POST /request-password-reset
// Invoke a password reset
const requestPasswordReset = asyncController(
  async (req: Request, res: Response, next: NextFunction) => {
    const parsedRequest = await validate(requestPasswordResetSchema, req);
  }
);

// POST /reset-password
// Reset users password
const resetPassword = asyncController(async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(resetPasswordSchema, req);
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
