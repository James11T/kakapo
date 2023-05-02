import { Router } from "express";
import {
  activateMfaSource,
  addMfaSource,
  removeMfaSource,
  getMfaStatus,
  whoAmI,
  requestPasswordReset,
  resetPassword,
} from "../controllers/auth.controller";

const authRouter = Router();

authRouter.get("/whoami", whoAmI);

authRouter.get("/mfa", getMfaStatus); // Get MFA status
authRouter.post("/mfa", addMfaSource); // Add MFA source
authRouter.patch("/mfa/:mfaId", activateMfaSource); // Activate MFA source
authRouter.delete("/mfa/:mfaId", removeMfaSource); // Remove MFA source

authRouter.post("/request-password-reset", requestPasswordReset); // Invoke a password reset
authRouter.post("/reset-password", resetPassword); // Reset users password

export default authRouter;
