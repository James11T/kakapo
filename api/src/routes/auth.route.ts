import { Router } from "express";
import { whoAmI } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.get("/whoami", whoAmI);

export default authRouter;
