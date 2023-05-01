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
  const parsedRequest = validate(whoAmISchema, req);
};

// GET /mfa
// Get MFA status
const getMfaStatus = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = validate(getMfaStatusSchema, req);
};

// POST /mfa
// Add MFA source
const addMfaSource = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = validate(addMfaSourceSchema, req);
};

// PATCH /mfa/:mfaId
// Activate MFA source
const activateMfaSource = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = validate(activateMfaSourceSchema, req);
};

// DELETE /mfa/:mfaId
// Remove MFA source
const removeMfaSource = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = validate(removeMfaSourceSchema, req);
};

// POST /request-password-reset
// Invoke a password reset
const requestPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = validate(requestPasswordResetSchema, req);
};

// POST /reset-password
// Reset users password
const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  const parsedRequest = validate(resetPasswordSchema, req);
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
