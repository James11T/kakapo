import { Router } from "express";
import { resetPasswordController, whoAmIController } from "../controllers/auth.controller";
import { validate } from "../middleware/validation.middleware";
import { resetPasswordSchema } from "../validation/auth.validation";

const authRouter = Router();

authRouter.get("/:userId/reset-password/", validate(resetPasswordSchema), resetPasswordController);
authRouter.get("/whoami", whoAmIController);

export default authRouter;
