import { validate } from "../schemas/validation";
import {
  activateMfaSourceSchema,
  addMfaSourceSchema,
  getMfaStatusSchema,
  removeMfaSourceSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
  whoAmISchema,
} from "../schemas/auth.schemas";
import type { Request, Response, NextFunction } from "express";

// GET /whoami
// Return authenticated user
const whoAmI = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(whoAmISchema, req);
};

// GET /mfa
// Get MFA status
const getMfaStatus = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(getMfaStatusSchema, req);
};

// POST /mfa
// Add MFA source
const addMfaSource = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(addMfaSourceSchema, req);
};

// PATCH /mfa/:mfaId
// Activate MFA source
const activateMfaSource = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(activateMfaSourceSchema, req);
};

// DELETE /mfa/:mfaId
// Remove MFA source
const removeMfaSource = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(removeMfaSourceSchema, req);
};

// POST /request-password-reset
// Invoke a password reset
const requestPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(requestPasswordResetSchema, req);
};

// POST /reset-password
// Reset users password
const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = await validate(resetPasswordSchema, req);
};

export {
  whoAmI,
  getMfaStatus,
  addMfaSource,
  activateMfaSource,
  removeMfaSource,
  requestPasswordReset,
  resetPassword,
};
