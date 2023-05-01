import { z } from "zod";
import { password, totp } from "./generic.schemas";

// GET /whoami
// Return authenticated user
const whoAmISchema = z.object({});

// GET /mfa
// Get MFA status
const getMfaStatusSchema = z.object({});

// POST /mfa
// Add MFA source
const addMfaSourceSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(32),
  }),
});

// PATCH /mfa/:mfaId
// Activate MFA source
const activateMfaSourceSchema = z.object({
  body: z.object({
    totp: totp,
  }),
  params: z.object({
    mfaId: z.string().uuid(),
  }),
});

// DELETE /mfa/:mfaId
// Remove MFA source
const removeMfaSourceSchema = z.object({
  body: z.object({
    totp: totp,
  }),
  params: z.object({
    mfaId: z.string().uuid(),
  }),
});

// POST /request-password-reset
// Invoke a password reset
const requestPasswordResetSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

// POST /reset-password
// Reset users password
const resetPasswordSchema = z.object({
  body: z.object({
    resetToken: z.string(),
    password: password,
  }),
});

export {
  whoAmISchema,
  getMfaStatusSchema,
  addMfaSourceSchema,
  activateMfaSourceSchema,
  removeMfaSourceSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
};
