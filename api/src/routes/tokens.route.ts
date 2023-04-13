import { Router } from "express";
import { authenticateController, refreshAccessController } from "../controllers/auth.controller";
import { validate } from "../middleware/validation.middleware";
import { authenticateSchema, refreshAccessSchema } from "../validation/auth.validation";

const tokenRouter = Router();

tokenRouter.post("/authenticate", validate(authenticateSchema), authenticateController);
tokenRouter.post("/refresh", validate(refreshAccessSchema), refreshAccessController);

export default tokenRouter;
