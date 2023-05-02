import { Router } from "express";
import { authenticate, refreshAccess } from "../controllers/tokens.controller";

const tokensRouter = Router();

tokensRouter.post("/authenticate", authenticate);
tokensRouter.post("/refresh", refreshAccess);

export default tokensRouter;
